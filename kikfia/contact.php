<?php
// KIKFIA consultation form: emails each request to the inbox and answers the page with JSON.
// Sends through Hostinger's mail server as website@kikfia.com (signed, so it lands in the inbox),
// using the login in kikfia-mail.ini one folder above the web root. Without that file, or if the
// mail server does not answer, it falls back to PHP mail(). The page falls back to the visitor's
// email app whenever this does not answer { "ok": true }.
declare(strict_types=1);

const TO_EMAIL   = 'kikfiaofficial3@kikfia.com';
const FROM_EMAIL = 'kikfiaofficial3@kikfia.com';   // sender for the PHP mail() fallback
const SMTP_REMOTE = 'ssl://smtp.hostinger.com:465';
const MAX_PER_WINDOW = 5;                           // requests per visitor...
const WINDOW_SECONDS = 600;                         // ...per ten minutes

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

// the sending mailbox login, kept outside the web root: lines of key=value (user, pass)
function mail_config(): ?array
{
    $file = dirname(__DIR__) . '/kikfia-mail.ini';
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
    return !empty($cfg['user']) && !empty($cfg['pass']) ? $cfg : null;
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
    . 'Sent ' . gmdate('Y-m-d H:i') . " UTC. To answer {$name}, write to {$email}: the Reply button goes to the website mailbox.\n";

$headers = implode("\r\n", [
    'From: KIKFIA Website <' . FROM_EMAIL . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$cfg = mail_config();
$sent = $cfg !== null && smtp_send($cfg, TO_EMAIL, $subject, $body);
if (!$sent) {
    $sent = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . FROM_EMAIL);
}

if (!$sent) {
    reply(500, ['ok' => false, 'error' => 'mail']);
}
reply(200, ['ok' => true]);
