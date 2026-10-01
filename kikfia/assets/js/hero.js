/* Kikfia · scroll-scrubbed hero.
   The standard: whole-file Blob load behind an honest ring, eased time that
   rests when converged, one seek at a time, DOM writes only on change, bands
   paced in scroll distance, five still-hero gates kept live, and a page that
   is complete if the video never arrives. */
(function () {
  'use strict';

  var H = (window.KIKFIA && window.KIKFIA.hero) || {};
  var doc = document, root = doc.documentElement;
  var hero = doc.querySelector('.hero');
  if (!hero) return;
  var stage = hero.querySelector('.hero-stage');
  var video = hero.querySelector('.hero-video');
  var posterLayer = hero.querySelector('.hero-poster');
  var ring = hero.querySelector('.hero-ring');
  var cue = hero.querySelector('.scroll-cue');
  var staticPic = hero.querySelector('.hero-static');
  var art = hero.querySelector('.hero-art');
  var bandEls = Array.prototype.slice.call(hero.querySelectorAll('.band'));
  var bands = bandEls.map(function (b, i) {
    return { el: b, a: parseFloat(b.getAttribute('data-from')), b: parseFloat(b.getAttribute('data-to')), first: i === 0, last: i === bandEls.length - 1, op: -1, k: -1, live: null };
  });

  /* ---------- split band text into words (seeded, identical every load) ---------- */
  function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  Array.prototype.slice.call(hero.querySelectorAll('[data-split]')).forEach(function (node, n) {
    var r = rng(17 + n * 31), words = node.textContent.trim().split(/\s+/);
    node.textContent = '';
    words.forEach(function (w, i) {
      var s = doc.createElement('span');
      s.className = 'w'; s.textContent = w;
      s.style.setProperty('--th', (i / words.length * 0.5 + r() * 0.05).toFixed(3));
      node.appendChild(s);
      if (i < words.length - 1) node.appendChild(doc.createTextNode(' '));
    });
  });

  /* ---------- the five still-hero gates: same strings as site.css ---------- */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  var MQLS = GATES.map(function (q) { return matchMedia(q); });
  var NARROW = MQLS.slice(0, 3);
  var hasVideo = !!H.video;

  /* ---------- static hero image (phones, tablets, reduced motion) ---------- */
  var SIZES_M = H.mobileWidths || [720, 1080, 1440], SIZES_D = H.posterWidths || [960, 1440, 1920];
  function srcset(base, ws, ext) { return ws.map(function (w) { return base + '-' + w + '.' + ext + ' ' + w + 'w'; }).join(', '); }
  var staticFor = null;
  function setStatic() {
    var narrow = NARROW.some(function (m) { return m.matches; });
    var base = narrow ? (H.mobile || H.poster) : (H.poster || H.mobile);
    if (!base || staticFor === base) return;
    staticFor = base;
    var ws = base === H.mobile ? SIZES_M : SIZES_D;
    staticPic.textContent = '';
    ['avif', 'webp'].forEach(function (ext) {
      var s = doc.createElement('source');
      s.type = 'image/' + ext; s.srcset = srcset(base, ws, ext); s.sizes = '100vw';
      staticPic.appendChild(s);
    });
    var img = doc.createElement('img');
    img.alt = ''; img.decoding = 'async'; img.fetchPriority = 'high';
    img.src = base + '-' + ws[ws.length > 1 ? 1 : 0] + '.jpg'; img.srcset = srcset(base, ws, 'jpg'); img.sizes = '100vw';
    img.onload = function () { if (art) art.style.visibility = 'hidden'; };
    staticPic.appendChild(img);
    staticPic.hidden = false;
  }

  /* ---------- scroll progress through the pinned hero ---------- */
  function heroProgress() {
    var r = hero.getBoundingClientRect();
    var range = r.height - innerHeight;
    if (range <= 0) return 0;
    return Math.min(1, Math.max(0, -r.top / range));
  }

  /* ---------- gated seeks: one at a time, coalesce to the newest ---------- */
  var seekBusy = false, pendingTime = null;
  function requestSeek(t) {
    if (!video.duration || isNaN(t)) return;
    if (seekBusy) { pendingTime = t; return; }
    if (Math.abs(video.currentTime - t) < 0.001) return;
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', function () {
    seekBusy = false;
    if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', function () { seekBusy = false; pendingTime = null; failVideo(); });

  /* ---------- band pacing (delta-gated writes) ---------- */
  function smoothstep(p, e0, e1) { var t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
  var loadK = 0;
  function updateCaptions(p) {
    bands.forEach(function (bd) {
      var f = Math.min(0.02, (bd.b - bd.a) / 3);
      var inE = bd.first ? 1 : smoothstep(p, bd.a, bd.a + f);
      var outE = bd.last ? 0 : smoothstep(p, bd.b - f, bd.b);
      var op = inE * (1 - outE);
      var ramp = parseFloat(bd.el.getAttribute('data-ramp')) || Math.min(0.025, (bd.b - bd.a) * 0.35);
      var k = Math.min(1, Math.max(0, (p - bd.a) / ramp));
      if (bd.last) k = Math.min(1, Math.max(0, (p - bd.a) / Math.max(0.0001, (1 - bd.a) * 0.6)));
      if (bd.first) k = Math.max(k, loadK);
      if (Math.abs(op - bd.op) > 0.004) { bd.el.style.setProperty('--op', op.toFixed(3)); bd.op = op; }
      if (Math.abs(k - bd.k) > 0.008 || (k === 1 && bd.k !== 1) || (k === 0 && bd.k !== 0)) { bd.el.style.setProperty('--k', k.toFixed(3)); bd.k = k; }
      var live = op > 0.5;
      if (live !== bd.live) { bd.el.classList.toggle('live', live); bd.live = live; bd.el.toggleAttribute('inert', !live); }
    });
  }

  /* ---------- eased time in a rAF loop that rests ---------- */
  var target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var kSmooth = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - kSmooth, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    if (video.duration) requestSeek(shown * video.duration);
    updateCaptions(shown);
  }
  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { heroOnScreen = en[0].isIntersecting; if (heroOnScreen) onScroll(); }).observe(hero);
  }

  /* band one opens assembled: a short time ramp on load that hands over to scroll */
  function loadRamp() {
    var t0 = performance.now();
    (function step(now) {
      if (!scrubOn) return;
      loadK = Math.min(1, (now - t0) / 1100);
      loadK = 1 - Math.pow(1 - loadK, 3);
      updateCaptions(shown);
      if (loadK < 1 && scrubOn) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Blob loader with an honest ring ---------- */
  var started = false, failed = false;
  function startBlobFetch() {
    if (started) return;
    started = true;
    loadHeroBlob().catch(failVideo);
  }
  function loadHeroBlob() {
    ring.hidden = false;
    var ctrl = new AbortController();
    var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
    return fetch(H.video, { priority: 'low', signal: ctrl.signal }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('video ' + res.status);
      var total = Number(res.headers.get('Content-Length')) || H.videoBytes || 0;
      var reader = res.body.getReader(), chunks = [], got = 0, lastRing = 0;
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return;
          clearTimeout(watchdog);
          watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
          chunks.push(r.value); got += r.value.length;
          var frac = total ? Math.min(1, got / total) : 0;
          var now = performance.now();
          if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
          return pump();
        });
      }
      return pump().then(function () {
        clearTimeout(watchdog);
        ring.style.setProperty('--ld', 0);
        video.src = URL.createObjectURL(new Blob(chunks, { type: res.headers.get('Content-Type') || 'video/mp4' }));
        video.load();
        video.addEventListener('canplay', function () {
          requestSeek(heroProgress() * video.duration);
          stage.classList.add('video-ready');
          setTimeout(function () { ring.hidden = true; if (cue) cue.hidden = false; }, 400);
        }, { once: true });
      });
    });
  }
  function failVideo() {
    if (failed) return;
    failed = true;
    ring.hidden = true;
    if (cue) cue.hidden = false;
    stage.classList.remove('video-ready');
    stage.classList.add('video-failed');
  }

  var heroInit = false;
  function initHeroOnce() {
    if (heroInit) return;
    heroInit = true;
    var poster = H.poster ? H.poster + '-1920.jpg' : '';
    if (!poster) { startBlobFetch(); return; }
    posterLayer.style.backgroundImage = "url('" + poster + "')";
    var img = new Image();
    img.onload = function () { stage.classList.add('poster-ready'); if (art) art.style.visibility = 'hidden'; startBlobFetch(); };
    img.onerror = startBlobFetch;
    img.src = poster;
    setTimeout(startBlobFetch, 4000);
  }

  /* ---------- arm and disarm live with the gates ---------- */
  var scrubOn = false;
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    root.classList.add('scrub');
    initHeroOnce();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    bands.forEach(function (b) { b.op = -1; b.k = -1; b.live = null; });
    loadRamp();
    target = shown = heroProgress();
    updateCaptions(shown);
    onScroll();
  }
  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    root.classList.remove('scrub');
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    bands.forEach(function (b) { b.el.style.removeProperty('--op'); b.el.style.removeProperty('--k'); b.el.classList.remove('live'); b.el.removeAttribute('inert'); });
  }
  function applyHeroMode() {
    var gated = MQLS.some(function (m) { return m.matches; });
    if (gated || !hasVideo || failed) { disableScrub(); setStatic(); }
    else enableScrub();
  }
  MQLS.forEach(function (m) { m.addEventListener('change', applyHeroMode); });
  var origFail = failVideo;
  failVideo = function () { origFail(); applyHeroMode(); };
  applyHeroMode();
})();
