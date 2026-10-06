/* KIKFIA measurement.
   Loads Meta Pixel, Google Analytics 4 and Google Ads only when their IDs are set in kikfia-config.js,
   and only for visitors who have not opted out. Counts a Lead when the consultation form sends, and a
   Contact when someone taps WhatsApp, call, or email. Also remembers which ad or link brought the
   visitor, so each consultation request says where it came from. */
(() => {
  'use strict';
  const cfg = window.KIKFIA_TRACKING || {};
  const OPT_KEY = 'kikfia-privacy';
  const ATTR_KEY = 'kikfia-attribution';
  const ATTR_DAYS = 90;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------- privacy: Global Privacy Control, the opt-out on privacy.html, and Europe ---------- */
  const gpc = navigator.globalPrivacyControl === true;
  // A European time zone stands in for the EEA, UK and Switzerland, where ad and analytics cookies need
  // consent first. The site has no consent banner, so no tags load there. Google's own regional default
  // below also covers European visitors whose device clock says otherwise.
  const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } })();
  const europe = /^Europe\//.test(tz) || /^Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz);
  const optedOut = () => store.get(OPT_KEY) === 'optout';
  const allowed = () => !gpc && !europe && !optedOut();
  const EEA = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
    'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH'];

  function clearCookies() {
    const host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').map(c => c.split('=')[0].trim())
      .filter(n => /^(_fbp|_fbc|_ga|_ga_.+|_gid|_gcl_.+)$/.test(n))
      .forEach(n => ['', '; domain=' + host, '; domain=.' + host].forEach(d => { document.cookie = n + '=; Max-Age=0; path=/' + d; }));
  }

  window.kikfiaPrivacy = {
    gpc, europe,
    optedOut,
    allowed,
    optOut() {
      store.set(OPT_KEY, 'optout');
      if (window.fbq) window.fbq('consent', 'revoke');
      if (window.gtag) window.gtag('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
      clearCookies();
    },
    optIn() { store.del(OPT_KEY); }
  };

  /* ---------- where the visitor came from (kept in this browser for 90 days) ---------- */
  const CLICK_IDS = ['fbclid', 'gclid', 'gbraid', 'wbraid', 'msclkid', 'ttclid'];
  function thisTouch() {
    const q = new URLSearchParams(location.search);
    const t = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
      const v = q.get(k);
      if (v) t[k.slice(4)] = v.slice(0, 150);
    });
    const id = CLICK_IDS.find(k => q.get(k));
    if (id) t.click = id + '=' + q.get(id).slice(0, 500);
    try {
      const r = document.referrer ? new URL(document.referrer) : null;
      if (r && r.hostname !== location.hostname) t.referrer = r.hostname;
    } catch (e) {}
    if (!Object.keys(t).length) return null;   // a direct or internal visit
    t.landing = location.pathname;
    t.time = new Date().toISOString();
    return t;
  }
  let attr = null;
  try { attr = JSON.parse(store.get(ATTR_KEY) || 'null'); } catch (e) {}
  if (!attr || !attr.first || Date.now() - Date.parse(attr.first.time) > ATTR_DAYS * 864e5) attr = null;
  const touch = thisTouch();
  if (!attr) attr = { first: touch || { landing: location.pathname, time: new Date().toISOString() }, last: touch };
  else if (touch) attr.last = touch;
  store.set(ATTR_KEY, JSON.stringify(attr));

  // flat fields for the consultation form: first_source, first_medium, ... last_click, last_time
  window.kikfiaAttribution = () => {
    const out = {};
    [['first', attr.first], ['last', attr.last || attr.first]].forEach(([p, t]) => {
      ['source', 'medium', 'campaign', 'content', 'term', 'click', 'referrer', 'landing', 'time'].forEach(k => {
        if (t && t[k]) out[p + '_' + k] = t[k];
      });
    });
    return out;
  };

  /* ---------- the tags ---------- */
  const pixel = /^\d{5,20}$/.test(cfg.metaPixelId || '') ? cfg.metaPixelId : '';
  const ga4 = /^G-[A-Z0-9]+$/i.test(cfg.ga4MeasurementId || '') ? cfg.ga4MeasurementId : '';
  const ads = /^AW-\d+$/i.test(cfg.googleAdsId || '') ? cfg.googleAdsId : '';
  const adsLabel = ads && /^[\w-]+$/.test(cfg.googleAdsLeadLabel || '') ? cfg.googleAdsLeadLabel : '';
  const on = allowed();

  function addScript(src) {
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  if (on && pixel) {
    // Meta's standard Pixel loader
    const n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    addScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixel);
    window.fbq('track', 'PageView');
  }

  if (on && (ga4 || ads)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', region: EEA });
    window.gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    if (ga4) window.gtag('config', ga4);
    if (ads) window.gtag('config', ads);
    addScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4 || ads));
  }

  /* ---------- events ---------- */
  // lead: { eventId, need, goal, timeline }    contact: { method: 'whatsapp' | 'phone' | 'email' }
  window.kikfiaTrack = (name, d = {}) => {
    if (!on) return;
    try {
      if (name === 'lead') {
        if (pixel && window.fbq) window.fbq('track', 'Lead', { content_name: d.need || '', content_category: d.goal || '' }, { eventID: d.eventId });
        if (ga4 && window.gtag) window.gtag('event', 'generate_lead', { send_to: ga4, lead_source: 'consultation_form', need: d.need, goal: d.goal, timeline: d.timeline });
        if (adsLabel && window.gtag) window.gtag('event', 'conversion', { send_to: ads + '/' + adsLabel, transaction_id: d.eventId });
      } else if (name === 'contact') {
        if (pixel && window.fbq) window.fbq('track', 'Contact', { content_name: d.method });
        if (ga4 && window.gtag) window.gtag('event', 'contact', { send_to: ga4, method: d.method });
      }
    } catch (e) {}
  };

  // every WhatsApp, call, and email link on the page
  document.addEventListener('click', e => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a) return;
    const h = a.getAttribute('href');
    const method = /^tel:/i.test(h) ? 'phone' : /^mailto:/i.test(h) ? 'email' : /(wa\.me|whatsapp\.com)\//i.test(h) ? 'whatsapp' : '';
    if (method) window.kikfiaTrack('contact', { method });
  }, true);
})();
