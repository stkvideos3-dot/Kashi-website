<?php
// Deliverability probe for the kikfia.com form: sends the same realistic lead four ways through
// smtp.hostinger.com as the sending mailbox, so the inbox shows which format lands in Junk.
// Runs on the Hostinger server: php mail-variants.php  (uses kikfia-mail.ini, never in the repo)
$ini = getenv('HOME') . '/domains/kikfia.com/kikfia-mail.ini';
$cfg = [];
foreach (file($ini, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) {
    $p = strpos($l, '=');
    if ($p) $cfg[trim(substr($l, 0, $p))] = trim(substr($l, $p + 1));
}
$to = 'kikfiaofficial3@kikfia.com';
$body = "Free consultation request from the KIKFIA website\n\n"
    . "What I need: A guest house\nMy goal: Space for family\nWhere it will be installed: Austin, TX\n"
    . "Preferred size: Medium, 300 to 600 sq ft\nTimeline: Within 3 months\n\n"
    . "Additional requirements:\nTwo bedrooms and a covered porch. Deliverability probe %s.\n\n"
    . "Name: Jordan Lee\nEmail: jordan.lee@example.com\nPhone or WhatsApp: +1 512 555 0142\n\n"
    . 'Sent ' . gmdate('Y-m-d H:i') . " UTC. Reply to this email to answer Jordan Lee directly.\n";

function send(array $cfg, string $to, string $subject, string $body, string $enc, string $replyTo): string
{
    $fp = stream_socket_client('ssl://smtp.hostinger.com:465', $en, $es, 15);
    if (!$fp) return "connect failed: {$es}";
    stream_set_timeout($fp, 20);
    $last = '';
    $talk = function ($line, $ok) use ($fp, &$last) {
        if ($line !== null) fwrite($fp, $line . "\r\n");
        do { $r = fgets($fp, 1024); if ($r === false) return false; } while (isset($r[3]) && $r[3] === '-');
        $last = trim($r);
        return in_array((int) substr($r, 0, 3), $ok, true);
    };
    $crlf = str_replace("\n", "\r\n", $body);
    if ($enc === 'base64') $payload = rtrim(chunk_split(base64_encode($body), 76, "\r\n"));
    elseif ($enc === 'quoted-printable') $payload = quoted_printable_encode($crlf);
    else $payload = $crlf;
    $payload = preg_replace('/^\./m', '..', $payload);   // dot-stuffing
    $h = ['Date: ' . date(DATE_RFC2822), 'From: KIKFIA Website <' . $cfg['user'] . '>', 'To: <' . $to . '>'];
    if ($replyTo !== '') $h[] = 'Reply-To: ' . $replyTo;
    $h = array_merge($h, ['Subject: =?UTF-8?B?' . base64_encode($subject) . '?=', 'Message-ID: <' . bin2hex(random_bytes(12)) . '@kikfia.com>',
        'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: ' . $enc]);
    $ok = $talk(null, [220]) && $talk('EHLO kikfia.com', [250]) && $talk('AUTH LOGIN', [334])
        && $talk(base64_encode($cfg['user']), [334]) && $talk(base64_encode($cfg['pass']), [235])
        && $talk('MAIL FROM:<' . $cfg['user'] . '>', [250]) && $talk('RCPT TO:<' . $to . '>', [250, 251])
        && $talk('DATA', [354]) && $talk(implode("\r\n", $h) . "\r\n\r\n" . $payload . "\r\n.", [250]);
    fwrite($fp, "QUIT\r\n");
    fclose($fp);
    return $ok ? 'sent' : "failed at: {$last}";
}

$top = "Reply to Jordan Lee: jordan.lee@example.com\n\n";
foreach ([
    ['E', '"Jordan Lee" <jordan.lee@example.com>', 'A guest house, Austin, TX', ''],
    ['G', 'jordanlee.austin@gmail.com', 'A guest house, Austin, TX', ''],
    ['F', '', 'A guest house, Austin, TX, from Jordan Lee', $top],
] as [$v, $rt, $subj, $prefix]) {
    $subject = "Free consultation: {$subj} [probe {$v}]";
    echo "variant {$v} (reply-to " . ($rt !== '' ? $rt : 'none') . '): ' . send($cfg, $to, $subject, $prefix . sprintf($body, $v), 'quoted-printable', $rt) . "\n";
}
