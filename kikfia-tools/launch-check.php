<?php
// Launch check for kikfia.com. Run it on the Hostinger server (for example from a one-off cron job):
//   php launch-check.php
// It fetches the live site over the public internet, checks SSL, redirects, every asset and DNS,
// sends one real consultation request (first run only), and prints a compact report.
$home = getenv('HOME') ?: sys_get_temp_dir();
$token = 'LT' . gmdate('YmdHis');
$expectMd5 = '7080e0a414f249d1c2a60a16d1246177';

function req(string $url, array $opt = []): array
{
    $h = [];
    $c = curl_init($url);
    curl_setopt_array($c, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_TIMEOUT => 40,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 KIKFIA-launch-check',
        CURLOPT_ENCODING => '',
        CURLOPT_HEADERFUNCTION => function ($c, $l) use (&$h) {
            $p = strpos($l, ':');
            if ($p) $h[strtolower(trim(substr($l, 0, $p)))] = trim(substr($l, $p + 1));
            return strlen($l);
        },
    ] + $opt);
    $b = curl_exec($c);
    $r = [
        'code' => curl_getinfo($c, CURLINFO_RESPONSE_CODE),
        'err' => curl_error($c),
        'body' => is_string($b) ? $b : '',
        'h' => $h,
        'ssl' => curl_getinfo($c, CURLINFO_SSL_VERIFYRESULT),
        'ip' => curl_getinfo($c, CURLINFO_PRIMARY_IP),
        'ms' => (int) round(curl_getinfo($c, CURLINFO_TOTAL_TIME) * 1000),
    ];
    curl_close($c);
    return $r;
}
function hv(array $r, string $k): string { return $r['h'][$k] ?? '-'; }

echo "== KIKFIA launch check " . gmdate('Y-m-d H:i:s') . " UTC token={$token}\n";

// 1. home page
$home1 = req('https://kikfia.com/');
preg_match('/<title>([^<]*)/', $home1['body'], $t);
echo 'HOME https://kikfia.com/ code=' . $home1['code'] . ' err=' . ($home1['err'] ?: '-') . ' ssl_verify=' . $home1['ssl']
    . ' ip=' . $home1['ip'] . ' ms=' . $home1['ms'] . "\n";
echo '  title=' . ($t[1] ?? '-') . ' bytes=' . strlen($home1['body']) . ' md5_match=' . (md5($home1['body']) === $expectMd5 ? 'yes' : 'NO ' . md5($home1['body']))
    . ' encoding=' . hv($home1, 'content-encoding') . ' type=' . hv($home1, 'content-type') . "\n";
echo '  headers: cache-control=' . hv($home1, 'cache-control') . ' nosniff=' . hv($home1, 'x-content-type-options') . ' referrer=' . hv($home1, 'referrer-policy')
    . ' server=' . hv($home1, 'server') . ' platform=' . hv($home1, 'platform') . ' cdn=' . hv($home1, 'x-hcdn-cache-status') . "\n";

// 2. redirects
foreach (['https://www.kikfia.com/', 'http://kikfia.com/', 'http://www.kikfia.com/', 'https://kikfia.com/index.html'] as $u) {
    $r = req($u, [CURLOPT_NOBODY => true]);
    echo "REDIRECT {$u} code={$r['code']} location=" . hv($r, 'location') . ' err=' . ($r['err'] ?: '-') . "\n";
}
$www = req('https://www.kikfia.com/', [CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 5]);
echo 'WWW followed: code=' . $www['code'] . ' md5_match=' . (md5($www['body']) === $expectMd5 ? 'yes' : 'NO') . ' ssl_verify=' . $www['ssl'] . "\n";

// 3. certificates
foreach (['kikfia.com', 'www.kikfia.com'] as $host) {
    $ctx = stream_context_create(['ssl' => ['capture_peer_cert' => true, 'SNI_enabled' => true, 'peer_name' => $host, 'verify_peer' => true]]);
    $s = @stream_socket_client("ssl://{$host}:443", $en, $es, 20, STREAM_CLIENT_CONNECT, $ctx);
    if (!$s) { echo "CERT {$host} FAILED {$es}\n"; continue; }
    $cert = openssl_x509_parse(stream_context_get_params($s)['options']['ssl']['peer_certificate']);
    echo "CERT {$host} subject=" . ($cert['subject']['CN'] ?? '-') . ' issuer=' . ($cert['issuer']['O'] ?? '-') . '/' . ($cert['issuer']['CN'] ?? '-')
        . ' valid_until=' . gmdate('Y-m-d', $cert['validTo_time_t']) . ' san=' . ($cert['extensions']['subjectAltName'] ?? '-') . "\n";
    fclose($s);
}

// 4. every asset the page references
preg_match_all('/assets\/[A-Za-z0-9._-]+/', $home1['body'], $m);
$assets = array_values(array_unique($m[0]));
$bad = [];
$ok = 0;
foreach ($assets as $a) {
    $r = req('https://kikfia.com/' . $a, [CURLOPT_NOBODY => true, CURLOPT_ENCODING => null]);
    $type = hv($r, 'content-type');
    $want = str_ends_with($a, '.mp4') ? 'video/mp4' : (str_ends_with($a, '.jpg') ? 'image/jpeg' : '');
    if ($r['code'] !== 200 || ($want && stripos($type, $want) !== 0)) $bad[] = "{$a} code={$r['code']} type={$type}";
    else $ok++;
}
echo 'ASSETS referenced=' . count($assets) . ' ok=' . $ok . ' failed=' . (count($bad) ? implode('; ', $bad) : 'none') . "\n";
$jpg = req('https://kikfia.com/assets/goal-living.jpg', [CURLOPT_NOBODY => true, CURLOPT_ENCODING => null]);
echo '  sample jpg: length=' . hv($jpg, 'content-length') . ' cache-control=' . hv($jpg, 'cache-control') . ' expires=' . hv($jpg, 'expires') . "\n";
$mp4 = req('https://kikfia.com/assets/hero-scrub.mp4', [CURLOPT_NOBODY => true, CURLOPT_ENCODING => null]);
echo '  hero mp4: length=' . hv($mp4, 'content-length') . ' (expect 7392777) accept-ranges=' . hv($mp4, 'accept-ranges') . ' cache-control=' . hv($mp4, 'cache-control') . "\n";
$rng = req('https://kikfia.com/assets/film-delivery.mp4', [CURLOPT_RANGE => '0-1023', CURLOPT_ENCODING => null]);
echo '  range request: code=' . $rng['code'] . ' (expect 206) bytes=' . strlen($rng['body']) . ' content-range=' . hv($rng, 'content-range') . "\n";

// 5. small files and things that must stay private
foreach (['robots.txt' => 200, 'sitemap.xml' => 200, 'contact.php' => 405, 'release/' => 404, 'deploy/kikfia-site.zip' => 404, '.htaccess' => 403, 'default.php' => 404] as $p => $want) {
    $r = req('https://kikfia.com/' . $p);
    echo "PATH /{$p} code={$r['code']} want={$want} " . ($r['code'] === $want || ($want === 403 && $r['code'] === 404) ? 'ok' : 'CHECK') . "\n";
}

// 6. DNS for web and mail
foreach (['kikfia.com' => DNS_MX, '_dmarc.kikfia.com' => DNS_TXT] as $n => $type) {
    $recs = @dns_get_record($n, $type) ?: [];
    echo "DNS {$n} " . implode(' | ', array_map(fn($x) => ($x['target'] ?? '') . ($x['txt'] ?? '') . (isset($x['pri']) ? ' pri=' . $x['pri'] : ''), $recs)) . "\n";
}
$txt = @dns_get_record('kikfia.com', DNS_TXT) ?: [];
echo 'DNS kikfia.com TXT ' . implode(' | ', array_map(fn($x) => $x['txt'] ?? '', $txt)) . "\n";
foreach (['hostingermail-a._domainkey.kikfia.com', 'hostingermail-b._domainkey.kikfia.com', 'hostingermail-c._domainkey.kikfia.com'] as $n) {
    $recs = @dns_get_record($n, DNS_CNAME) ?: [];
    echo "DNS {$n} " . implode(' | ', array_map(fn($x) => $x['target'] ?? '', $recs)) . "\n";
}
echo 'PHP ' . PHP_VERSION . ' mail_function=' . (function_exists('mail') ? 'yes' : 'no') . ' sendmail_path=' . ini_get('sendmail_path') . "\n";

// 7. one real form request (only on the first run)
$lock = $home . '/.kikfia-launch-check-sent';
if (!file_exists($lock)) {
    @touch($lock);
    $r = req('https://kikfia.com/contact.php', [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => [
            'need' => 'custom', 'need_label' => 'Launch test (please ignore)', 'goal' => 'other', 'goal_label' => 'Launch test',
            'place' => 'Launch test', 'size' => 'unsure', 'size_label' => 'Not sure yet', 'timeline' => 'flexible', 'timeline_label' => 'Not sure yet',
            'requirements' => "Automatic end-to-end test of the kikfia.com form. Token {$token}.",
            'name' => 'KIKFIA launch test', 'email' => 'kikfiaofficial3@kikfia.com', 'phone' => '', 'website' => '',
        ],
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    echo "FORM POST code={$r['code']} body={$r['body']} token={$token}\n";
} else {
    echo "FORM skipped (already sent on an earlier run)\n";
}
echo "== done\n";
