<?php
// KIKFIA consultation form: emails each request to the inbox and answers the page with JSON.
// Sends through Hostinger's mail server as website@kikfia.com (signed, so it lands in the inbox),
// using the login in kikfia-mail.ini one folder above the web root. Without that file, or if the
// mail server does not answer, it falls back to PHP mail(). The page falls back to the visitor's
// email app whenever this does not answer { "ok": true }.
// Every request is also added to kikfia-leads.csv (same private folder), with the ad or link that
// brought the visitor. If kikfia-meta.ini holds a Meta pixel ID and access token, the lead is also
// reported to Meta's Conversions API, with the same event ID the browser Pixel uses.
declare(strict_types=1);

const TO_EMAIL   = 'kikfiaofficial3@kikfia.com';
const FROM_EMAIL = 'kikfiaofficial3@kikfia.com';   // sender for the PHP mail() fallback
const SMTP_REMOTE = 'ssl://smtp.hostinger.com:465';
const MAX_PER_WINDOW = 5;                           // requests per visitor...
const WINDOW_SECONDS = 600;                         // ...per ten minutes
const PRIVATE_DIR = __DIR__ . '/..';                // one folder above the web root: never served
const META_API_VERSION = 'v24.0';                   // kikfia-meta.ini can override with api_version=

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function reply(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body);
    exit;
}

// one line of text: control characters (and so header injection) removed, length capped
function line(string $key, int $max = 200): string
{
    $v = isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : '';
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

// free text: line breaks kept, other control characters removed, length capped
function text(string $key, int $max = 3000): string
{
    $v = isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : '';
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

// a few requests per visitor per window, counted in a small file outside the web root
function too_many(): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = rtrim(sys_get_temp_dir(), '/') . '/kikfia-form-' . hash('sha256', $ip);
    $now = time();
    $hits = [];
    if (is_readable($file)) {
        $saved = json_decode((string) file_get_contents($file), true);
        if (is_array($saved)) {
            $hits = array_values(array_filter($saved, fn($t) => is_int($t) && $t > $now - WINDOW_SECONDS));
        }
    }
    if (count($hits) >= MAX_PER_WINDOW) {
        return true;
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
    return false;
}

// a private settings file outside the web root: lines of key=value. Null unless every required key is set.
function private_ini(string $name, array $required): ?array
{
    $file = PRIVATE_DIR . '/' . $name;
    if (!is_readable($file)) {
        return null;
    }
    $cfg = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) {
        $p = strpos($l, '=');
        if ($p) {
            $cfg[trim(substr($l, 0, $p))] = trim(substr($l, $p + 1));
        }
    }
    foreach ($required as $k) {
        if (empty($cfg[$k])) {
            return null;
        }
    }
    return $cfg;
}

// the ad or link that brought the visitor, as kikfia-measure.js sends it ('first' or 'last' visit)
function visit(string $which): array
{
    $t = [];
    foreach (['source', 'medium', 'campaign', 'content', 'term', 'click', 'referrer', 'landing', 'time'] as $k) {
        $t[$k] = line($which . '_' . $k, $k === 'click' ? 520 : 160);
    }
    return $t;
}

// one readable line for the email, like "facebook / paid, campaign spring-adu, click from Facebook or Instagram (2026-10-06)"
function visit_text(array $t): string
{
    $bits = [];
    if ($t['source'] !== '') {
        $bits[] = $t['source'] . ($t['medium'] !== '' ? ' / ' . $t['medium'] : '');
    } elseif ($t['referrer'] !== '') {
        $bits[] = 'link from ' . $t['referrer'];
    }
    foreach (['campaign' => 'campaign ', 'content' => 'ad ', 'term' => 'keyword '] as $k => $label) {
        if ($t[$k] !== '') {
            $bits[] = $label . $t[$k];
        }
    }
    $clicks = ['fbclid' => 'click from Facebook or Instagram', 'gclid' => 'Google ad click', 'gbraid' => 'Google ad click',
        'wbraid' => 'Google ad click', 'msclkid' => 'Microsoft ad click', 'ttclid' => 'TikTok ad click'];
    $id = explode('=', $t['click'], 2)[0];
    if (isset($clicks[$id])) {
        $bits[] = $clicks[$id];
    }
    if (!$bits) {
        return 'direct visit or not known';
    }
    return implode(', ', $bits) . (preg_match('/^\d{4}-\d\d-\d\d/', $t['time'], $d) ? " ({$d[0]})" : '');
}

// adds one row to the private lead log; spreadsheet formulas in visitor text are neutralized
function log_lead(array $row): void
{
    $file = PRIVATE_DIR . '/kikfia-leads.csv';
    $fp = @fopen($file, 'ab');
    if (!$fp) {
        error_log('kikfia form: the lead log is not writable');
        return;
    }
    @chmod($file, 0600);
    if (flock($fp, LOCK_EX)) {
        if (fstat($fp)['size'] === 0) {
            fwrite($fp, "\xEF\xBB\xBF");   // lets Excel read the file as UTF-8
            fputcsv($fp, array_keys($row), ',', '"', '');
        }
        $safe = array_map(fn($v) => preg_match('/^[=+\-@\t\r]/', (string) $v) ? "'" . $v : (string) $v, $row);
        fputcsv($fp, $safe, ',', '"', '');
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

// reports the lead to Meta's Conversions API. Email, phone, and name are sent only as SHA-256 hashes.
function meta_lead(array $m, array $lead): void
{
    $h = fn(string $v) => hash('sha256', $v);
    $user = [
        'em' => [$h(strtolower($lead['email']))],
        'client_ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
        'client_user_agent' => mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
    ];
    $digits = preg_replace('/\D+/', '', $lead['phone']) ?? '';
    if (strlen($digits) === 10) {
        $digits = '1' . $digits;   // a US number written without the country code
    }
    if (strlen($digits) >= 8) {
        $user['ph'] = [$h($digits)];
    }
    $names = preg_split('/\s+/', trim(mb_strtolower($lead['name']))) ?: [];
    if (($names[0] ?? '') !== '') {
        $user['fn'] = [$h($names[0])];
    }
    if (count($names) > 1) {
        $user['ln'] = [$h((string) end($names))];
    }
    $fbp = (string) ($_COOKIE['_fbp'] ?? '');
    if (preg_match('/^fb\.\d\.\d+\.\d+$/', $fbp)) {
        $user['fbp'] = $fbp;
    }
    $fbc = (string) ($_COOKIE['_fbc'] ?? '');
    if ($fbc === '' && str_starts_with($lead['click'], 'fbclid=')) {
        $seen = strtotime($lead['click_time']) ?: time();
        $fbc = 'fb.1.' . ($seen * 1000) . '.' . substr($lead['click'], 7);
    }
    if (preg_match('/^fb\.\d\.\d+\.[\w-]+$/', $fbc)) {
        $user['fbc'] = $fbc;
    }
    $fields = [
        'data' => json_encode([[
            'event_name' => 'Lead',
            'event_time' => time(),
            'event_id' => $lead['event_id'],
            'action_source' => 'website',
            'event_source_url' => $lead['url'],
            'user_data' => $user,
            'custom_data' => ['content_name' => $lead['need'], 'content_category' => $lead['goal']],
        ]]),
        'access_token' => $m['access_token'],
    ];
    if (!empty($m['test_event_code'])) {
        $fields['test_event_code'] = $m['test_event_code'];   // shows the event under Test events in Events Manager
    }
    $c = curl_init(($m['remote'] ?? 'https://graph.facebook.com') . '/' . ($m['api_version'] ?? META_API_VERSION) . '/' . rawurlencode($m['pixel_id']) . '/events');
    curl_setopt_array($c, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($fields),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    $res = curl_exec($c);
    $code = curl_getinfo($c, CURLINFO_RESPONSE_CODE);
    curl_close($c);
    if ($code !== 200) {
        error_log('kikfia form: Meta Conversions API answered ' . $code . ' ' . mb_substr((string) $res, 0, 300));
    }
}

// a small SMTP client: login, one message, quit. Returns false at the first unexpected reply.
function smtp_send(array $cfg, string $to, string $subject, string $body): bool
{
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $fp = @stream_socket_client($cfg['remote'] ?? SMTP_REMOTE, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        error_log("kikfia form: SMTP connect failed: {$errstr}");
        return false;
    }
    stream_set_timeout($fp, 20);
    $talk = function (?string $line, array $ok) use ($fp): bool {
        if ($line !== null) {
            fwrite($fp, $line . "\r\n");
        }
        do {
            $r = fgets($fp, 1024);
            if ($r === false) {
                return false;
            }
        } while (isset($r[3]) && $r[3] === '-');
        if (!in_array((int) substr($r, 0, 3), $ok, true)) {
            error_log('kikfia form: SMTP said ' . trim($r));
            return false;
        }
        return true;
    };
    $user = $cfg['user'];
    // No Reply-To header: tested on 2026-10-06, Hostinger's filter sends any message with one to
    // Junk. The customer's address leads the body instead.
    $text = quoted_printable_encode(str_replace("\n", "\r\n", $body));
    $text = preg_replace('/^\./m', '..', $text);   // SMTP dot-stuffing
    $message = implode("\r\n", [
        'Date: ' . date(DATE_RFC2822),
        'From: KIKFIA Website <' . $user . '>',
        'To: <' . $to . '>',
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@kikfia.com>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: quoted-printable',
        '',
        $text,
    ]);
    $ok = $talk(null, [220])
        && $talk('EHLO kikfia.com', [250])
        && $talk('AUTH LOGIN', [334])
        && $talk(base64_encode($user), [334])
        && $talk(base64_encode($cfg['pass']), [235])
        && $talk('MAIL FROM:<' . $user . '>', [250])
        && $talk('RCPT TO:<' . $to . '>', [250, 251])
        && $talk('DATA', [354])
        && $talk($message . "\r\n.", [250]);
    @fwrite($fp, "QUIT\r\n");
    fclose($fp);
    return $ok;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'method']);
}

// bots fill the hidden field: answer as if sent, send nothing
if (line('website') !== '') {
    reply(200, ['ok' => true]);
}

$name  = line('name', 120);
$email = line('email', 200);
$phone = line('phone', 60);
$place = line('place', 200);
$need  = line('need_label', 120) ?: line('need', 60);
$goal  = line('goal_label', 120) ?: 'Not sure yet';
$size  = line('size_label', 120) ?: 'Not sure yet';
$time  = line('timeline_label', 120) ?: 'Not sure yet';
$reqs  = text('requirements');
$first = visit('first');
$last  = visit('last');
if (implode('', $last) === '') {
    $last = $first;   // only one visit known
}
$eventId = line('event_id', 64);
if (!preg_match('/^[\w-]{8,64}$/', $eventId)) {
    $eventId = 'lead-' . bin2hex(random_bytes(8));
}

if ($name === '' || $place === '' || $need === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    reply(422, ['ok' => false, 'error' => 'fields']);
}
if (too_many()) {
    reply(429, ['ok' => false, 'error' => 'rate']);
}

$subject = 'Free consultation: ' . $need . ', ' . $place . ', from ' . $name;
$body = "Reply to {$name}: {$email}\n\n"
    . "Free consultation request from the KIKFIA website\n\n"
    . "What I need: {$need}\n"
    . "My goal: {$goal}\n"
    . "Where it will be installed: {$place}\n"
    . "Preferred size: {$size}\n"
    . "Timeline: {$time}\n\n"
    . "Additional requirements:\n" . ($reqs !== '' ? $reqs : '-') . "\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . 'Phone or WhatsApp: ' . ($phone !== '' ? $phone : '-') . "\n\n"
    . (visit_text($first) === visit_text($last)
        ? 'How they found the site: ' . visit_text($first) . "\n\n"
        : 'First visit: ' . visit_text($first) . "\nLatest visit: " . visit_text($last) . "\n\n")
    . 'Sent ' . gmdate('Y-m-d H:i') . " UTC. To answer {$name}, write to {$email}: the Reply button goes to the website mailbox.\n";

$headers = implode("\r\n", [
    'From: KIKFIA Website <' . FROM_EMAIL . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$cfg = private_ini('kikfia-mail.ini', ['user', 'pass']);
$delivery = $cfg !== null && smtp_send($cfg, TO_EMAIL, $subject, $body) ? 'email' : '';
if ($delivery === '') {
    $delivery = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . FROM_EMAIL) ? 'email (backup sender)' : 'FAILED, visitor shown their email app';
}

$row = ['received_utc' => gmdate('Y-m-d H:i:s'), 'name' => $name, 'email' => $email, 'phone' => $phone, 'need' => $need,
    'goal' => $goal, 'install_location' => $place, 'size' => $size, 'timeline' => $time, 'requirements' => $reqs];
foreach (['first' => $first, 'last' => $last] as $which => $t) {
    foreach ($t as $k => $v) {
        $row["{$which}_{$k}"] = $v;
    }
}
log_lead($row + ['delivery' => $delivery, 'event_id' => $eventId]);

if (str_starts_with($delivery, 'FAILED')) {
    reply(500, ['ok' => false, 'error' => 'mail']);
}

// Meta Conversions API: only with its settings file, and only for visitors who allow ad tracking
$meta = private_ini('kikfia-meta.ini', ['pixel_id', 'access_token']);
if ($meta === null || line('ad_consent', 1) !== '1' || ($_SERVER['HTTP_SEC_GPC'] ?? '') === '1') {
    reply(200, ['ok' => true]);
}
ignore_user_abort(true);
http_response_code(200);
echo json_encode(['ok' => true]);
if (function_exists('litespeed_finish_request')) {
    litespeed_finish_request();   // the visitor sees "Thank you" now; Meta is told after
} elseif (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
}
$page = (string) ($_SERVER['HTTP_REFERER'] ?? '');
meta_lead($meta, ['email' => $email, 'phone' => $phone, 'name' => $name, 'need' => $need, 'goal' => $goal, 'event_id' => $eventId,
    'click' => $last['click'] ?: $first['click'], 'click_time' => $last['click'] !== '' ? $last['time'] : $first['time'],
    'url' => preg_match('#^https://kikfia\.com/[^?\#]*#', $page, $u) ? $u[0] : 'https://kikfia.com/']);
