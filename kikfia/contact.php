<?php
// KIKFIA consultation form: emails each request to the inbox and answers the page with JSON.
// The page falls back to the visitor's email app whenever this does not answer { "ok": true }.
declare(strict_types=1);

const TO_EMAIL   = 'kikfiaofficial3@kikfia.com';
const FROM_EMAIL = 'kikfiaofficial3@kikfia.com';   // must be a mailbox on kikfia.com
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

$subject = 'Free consultation: ' . $need . ', ' . $place;
$body = "Free consultation request from the KIKFIA website\n\n"
    . "What I need: {$need}\n"
    . "My goal: {$goal}\n"
    . "Where it will be installed: {$place}\n"
    . "Preferred size: {$size}\n"
    . "Timeline: {$time}\n\n"
    . "Additional requirements:\n" . ($reqs !== '' ? $reqs : '-') . "\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . 'Phone or WhatsApp: ' . ($phone !== '' ? $phone : '-') . "\n\n"
    . 'Sent ' . gmdate('Y-m-d H:i') . " UTC. Reply to this email to answer {$name} directly.\n";

$headers = implode("\r\n", [
    'From: KIKFIA Website <' . FROM_EMAIL . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$sent = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . FROM_EMAIL);

if (!$sent) {
    reply(500, ['ok' => false, 'error' => 'mail']);
}
reply(200, ['ok' => true]);
