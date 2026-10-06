# KIKFIA ads and tracking setup

Everything is built and live. Each tool switches on when its ID is added. Nothing loads before that.

**Connected:** Google Analytics 4 (`G-VR919FGXSG`, since 2026-10-06). **Waiting for an ID:** Meta Pixel, Google Ads.

## Where each ID goes

`kikfia/kikfia-config.js` (on the server: `public_html/kikfia-config.js`)

| Setting | Where to find it | Looks like |
|---|---|---|
| `metaPixelId` | Meta Events Manager > Data sources > your pixel | `1234567890123456` |
| `ga4MeasurementId` | Google Analytics > Admin > Data streams > Web stream | `G-XXXXXXXXXX` |
| `googleAdsId` (optional) | Google Ads > Goals > Conversions > your lead conversion > Tag setup | `AW-123456789` |
| `googleAdsLeadLabel` (optional) | Same screen, the part after the slash in `send_to` | `AbCdEfGhIj` |

The update script installs this file only when it is missing, so IDs saved on the server are never overwritten. To push a new version from the repo, run it with `with-config`.

## What gets counted

| Moment | Meta Pixel | Google Analytics 4 | Google Ads |
|---|---|---|---|
| Any page view | PageView | page_view | page view |
| Form sent (the email reached the inbox) | Lead | generate_lead | conversion (with label) |
| WhatsApp, call, or email tapped | Contact | contact (method: whatsapp, phone, email) | |

The Pixel Lead and the server Lead (Conversions API) share one event ID, so Meta counts each lead once.

## Who is never tracked

- Visitors who opt out on `privacy.html#choices` (saved in their browser)
- Browsers that send Global Privacy Control
- Devices set to a European time zone. Google's regional consent default also covers visitors located in the EEA, UK, and Switzerland.

The site has no cookie banner, because it targets US visitors. Add one before advertising in Europe.

## Lead log

Every request is added to `domains/kikfia.com/kikfia-leads.csv` (one folder above `public_html`, never served). Download it from Hostinger File Manager and open it in Excel or Google Sheets. One row per request: the form answers, the first and latest ad or link that brought the visitor (utm tags, click ID, referring site), whether the email went out, and the event ID.

## Meta Conversions API (optional, recommended)

Create `domains/kikfia.com/kikfia-meta.ini` (next to `kikfia-mail.ini`, never in the repo):

```
pixel_id=1234567890123456
access_token=EAAB...
```

Meta Events Manager > your pixel > Settings > Conversions API > Generate access token. Add `test_event_code=TEST12345` for a test run, and remove it afterwards.

## Search Console

Property `https://kikfia.com/` is verified with Google's HTML file method: `kikfia/google0789247f424b483a.html` sits at the site root. **Never delete it**: Google rechecks it, and verification is lost without it. The update script reinstalls it on every deploy.

After verifying, submit `sitemap.xml` under Sitemaps. A Domain property (DNS TXT record) can be added later to cover every address of kikfia.com in one view.
