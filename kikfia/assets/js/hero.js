/* Kikfia · autoplay videos (hero drone loop and the inside walk-through).
   Each video is muted, loops, plays only while on screen, and has a
   pause/play button. Reduced motion or Data Saver: no autoplay, the still
   image stays, and the button lets people play it if they want.
   The page is complete if a video never arrives. */
(function () {
  'use strict';

  var D = window.KIKFIA || {};
  var doc = document;
  var reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  var phoneMQ = matchMedia('(max-width: 720px)');
  var conn = navigator.connection || {};
  function autoplayOK() { return !reduceMQ.matches && !conn.saveData; }

  function srcset(base, ws, ext) { return ws.map(function (w) { return base + '-' + w + '.' + ext + ' ' + w + 'w'; }).join(', '); }
  function fillPicture(pic, base, ws, sizes, onload) {
    pic.textContent = '';
    ['avif', 'webp'].forEach(function (ext) {
      var s = doc.createElement('source');
      s.type = 'image/' + ext; s.srcset = srcset(base, ws, ext); s.sizes = sizes;
      pic.appendChild(s);
    });
    var img = doc.createElement('img');
    img.alt = ''; img.decoding = 'async';
    img.src = base + '-' + ws[Math.min(1, ws.length - 1)] + '.jpg'; img.srcset = srcset(base, ws, 'jpg'); img.sizes = sizes;
    if (onload) { img.onload = onload; img.onerror = onload; }
    pic.appendChild(img);
    pic.hidden = false;
    return img;
  }

  /* one controller per video: plays while on screen, respects the button */
  function loopVideo(host, video, btn, pickSrc) {
    var choice = null, onScreen = false, armed = false, failed = false, loadedFor = '';
    function wantPlay() { return armed && !failed && onScreen && !doc.hidden && (choice === 'play' || (choice === null && autoplayOK())); }
    function setBtn() {
      var playing = !video.paused && !failed;
      btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
      btn.classList.toggle('is-paused', !playing);
    }
    function sync() {
      var src = pickSrc();
      btn.hidden = failed || !src;
      if (!src || failed) { if (!video.paused) video.pause(); host.classList.remove('vid-on'); return; }
      if (!wantPlay()) { if (!video.paused) video.pause(); setBtn(); return; }
      if (loadedFor !== src) { loadedFor = src; host.classList.remove('vid-on'); video.preload = 'auto'; video.src = src; }
      var p = video.play();
      if (p && p.catch) p.catch(function () { setBtn(); });
    }
    video.addEventListener('playing', function () { host.classList.add('vid-on'); setBtn(); });
    video.addEventListener('pause', setBtn);
    video.addEventListener('error', function () { failed = true; host.classList.remove('vid-on'); sync(); });
    btn.addEventListener('click', function () {
      choice = video.paused ? 'play' : 'pause';
      if (choice === 'play') onScreen = true;
      sync(); setBtn();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; sync(); }, { rootMargin: '150px 0px' }).observe(host);
    } else onScreen = true;
    doc.addEventListener('visibilitychange', sync);
    [reduceMQ, phoneMQ].forEach(function (m) { m.addEventListener('change', sync); });
    setBtn();
    return { arm: function () { if (!armed) { armed = true; sync(); } }, sync: sync };
  }

  /* ---------- hero ---------- */
  (function () {
    var H = D.hero || {};
    var hero = doc.querySelector('.hero');
    if (!hero) return;
    var stage = hero.querySelector('.hero-stage');
    var video = hero.querySelector('.hero-video');
    var pic = hero.querySelector('.hero-static');
    var art = hero.querySelector('.hero-art');
    var btn = hero.querySelector('.hero-toggle');
    var shownFor = '';
    function showStill(done) {
      var phone = phoneMQ.matches;
      var base = phone ? (H.mobile || H.poster) : (H.poster || H.mobile);
      if (!base) { done(); return; }
      if (shownFor === base) return;
      shownFor = base;
      var ws = base === H.mobile ? (H.mobileWidths || [360, 540]) : (H.posterWidths || [960, 1440, 1920]);
      var img = fillPicture(pic, base, ws, '100vw', function () { if (art) art.style.visibility = 'hidden'; done(); });
      img.fetchPriority = 'high';
    }
    var ctl = loopVideo(stage, video, btn, function () { return phoneMQ.matches ? (H.videoPhone || H.video) : (H.video || H.videoPhone); });
    var armT = setTimeout(ctl.arm, 3000);
    showStill(function () { clearTimeout(armT); ctl.arm(); });
    phoneMQ.addEventListener('change', function () { showStill(function () {}); });
  })();

  /* ---------- inside walk-through ---------- */
  (function () {
    var V = D.insideVideo || {};
    var fig = doc.querySelector('[data-render="inside-film"]');
    if (!fig) return;
    if (!V.video) { fig.remove(); return; }
    fig.hidden = false;
    var frame = fig.querySelector('.film-frame');
    if (V.poster) fillPicture(fig.querySelector('.film-poster'), V.poster, V.posterWidths || [800, 1280], '(max-width: 1240px) 100vw, 1180px');
    var cap = fig.querySelector('.film-cap');
    if (V.caption) cap.textContent = V.caption; else cap.remove();
    loopVideo(frame, fig.querySelector('.film-video'), fig.querySelector('.film-toggle'), function () { return V.video; }).arm();
  })();
})();
