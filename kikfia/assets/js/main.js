/* Kikfia · page behavior. Reads every changeable fact from site-data.js. */
(function () {
  'use strict';

  var D = window.KIKFIA || {};
  var brand = D.brand || {}, contact = D.contact || {}, person = D.person || {};
  var doc = document, root = doc.documentElement;
  var reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------- helpers ---------------- */
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function el(tag, attrs, kids) {
    var n = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'class') n.className = v;
      else n.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c); });
    return n;
  }
  function ph(text) { return el('span', { class: 'ph', text: '[' + text + ']' }); }
  function icon(id, cls) {
    var s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', cls || 'ic'); s.setAttribute('aria-hidden', 'true');
    var u = doc.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#' + id); s.appendChild(u); return s;
  }
  function hasExt(p) { return /\.(jpe?g|png|webp|avif|svg|gif)$/i.test(p || ''); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* Responsive picture. A base path without an extension means Claude made
     -480/-800/-1200/-1600 versions in avif, webp and jpg. */
  var WIDTHS = [480, 800, 1200, 1600];
  function picture(base, alt, sizes, eager) {
    if (!base) return null;
    var img = el('img', { alt: alt || '', loading: eager ? 'eager' : 'lazy', decoding: 'async' });
    if (hasExt(base)) { img.src = base; return img; }
    var set = function (ext) { return WIDTHS.map(function (w) { return base + '-' + w + '.' + ext + ' ' + w + 'w'; }).join(', '); };
    var pic = el('picture', null, [
      el('source', { type: 'image/avif', srcset: set('avif'), sizes: sizes }),
      el('source', { type: 'image/webp', srcset: set('webp'), sizes: sizes })
    ]);
    img.src = base + '-800.jpg'; img.srcset = set('jpg'); img.sizes = sizes;
    pic.appendChild(img); return pic;
  }
  function media(base, alt, sizes, label, iconId, eager) {
    var box = el('div', { class: 'media' });
    var pic = picture(base, alt, sizes, eager);
    if (pic) box.appendChild(pic);
    else {
      var p = el('div', { class: 'media-ph', role: 'img', 'aria-label': (alt || 'Image') + ' (coming soon)' }, [icon(iconId || 'i-house', 'ic-l')]);
      if (label) p.appendChild(ph(label));
      box.appendChild(p);
    }
    return box;
  }
  var money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  /* ---------------- analytics (off until IDs + consent) ---------------- */
  var A = D.analytics || {};
  var analyticsOn = false;
  function track(name, params) {
    if (!analyticsOn) return;
    params = params || {};
    try {
      if (window.gtag) window.gtag('event', name, params);
      if (window.fbq) {
        if (name === 'generate_lead') window.fbq('track', 'Lead');
        else window.fbq('trackCustom', name, params);
      }
    } catch (e) { /* analytics must never break the page */ }
  }
  function loadAnalytics() {
    if (analyticsOn) return;
    analyticsOn = true;
    if (A.ga4) {
      var s = el('script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(A.ga4) });
      doc.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', A.ga4);
    }
    if (A.metaPixel) {
      /* Meta Pixel base code */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', A.metaPixel);
      window.fbq('track', 'PageView');
    }
  }
  function initConsent() {
    if (!A.ga4 && !A.metaPixel) return;
    var choice = store('kikfia-analytics');
    if (choice === 'yes') { loadAnalytics(); return; }
    if (choice === 'no') return;
    var box = $('#consent');
    box.hidden = false;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      store('kikfia-analytics', b.getAttribute('data-consent'));
      if (b.getAttribute('data-consent') === 'yes') loadAnalytics();
      box.hidden = true;
    });
  }
  doc.addEventListener('click', function (e) {
    var c = e.target.closest('[data-cta]');
    if (c && c.type !== 'submit') track('cta_click', { cta_id: c.getAttribute('data-cta') });
  });

  /* ---------------- brand, contact, footer ---------------- */
  function renderBrand() {
    if (brand.logo) $$('[data-brand-mark]').forEach(function (m) {
      m.textContent = '';
      m.appendChild(el('img', { src: brand.logo, alt: brand.fullName || 'Kikfia', width: 120, height: 30 }));
    });
    var a = brand.mailingAddress || {};
    var addr = $('[data-render="mailing-address"]');
    if (addr) {
      addr.textContent = '';
      [a.line1, (a.city || '') + ', ' + (a.region || '') + ' ' + (a.postalCode || ''), a.country].forEach(function (line, i) {
        if (i) addr.appendChild(el('br'));
        addr.appendChild(doc.createTextNode(line));
      });
    }
    var legal = $('[data-render="legal-line"]');
    if (legal && brand.legalLine) legal.textContent = brand.legalLine;
    $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  }
  function waLink() { return contact.whatsapp ? 'https://wa.me/' + String(contact.whatsapp).replace(/\D/g, '') : ''; }
  function contactItems(withName) {
    var items = [];
    items.push(contact.email
      ? el('li', null, [icon('i-mail'), el('a', { href: 'mailto:' + contact.email, text: contact.email })])
      : el('li', null, [icon('i-mail'), ph('EMAIL')]));
    items.push(contact.phone
      ? el('li', null, [icon('i-phone'), el('a', { href: 'tel:' + contact.phone.replace(/[^\d+]/g, ''), text: contact.phone })])
      : el('li', null, [icon('i-phone'), ph('PHONE')]));
    if (contact.whatsapp) items.push(el('li', null, [icon('i-chat'), el('a', { href: waLink(), target: '_blank', rel: 'noopener', text: 'WhatsApp' })]));
    if (withName) items.push(el('li', { text: 'Contact: ' + (person.name || '') }));
    return items;
  }
  function renderContact() {
    var row = $('[data-render="contact-row"]');
    if (row) contactItems(false).forEach(function (i) { row.appendChild(i); });
    var fc = $('[data-render="footer-contact"]');
    if (fc) contactItems(true).forEach(function (i) { fc.appendChild(i); });
    var social = $('[data-render="social"]'), S = D.social || {};
    var names = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn' };
    Object.keys(names).forEach(function (k) {
      if (S[k]) social.appendChild(el('li', null, [el('a', { href: S[k], target: '_blank', rel: 'noopener', text: names[k] })]));
    });
    if (!social.children.length) social.remove();
    // WhatsApp in the phone bar
    var wa = $('[data-whatsapp]');
    if (wa && contact.whatsapp) { wa.href = waLink(); wa.hidden = false; }
  }

  /* ---------------- person ---------------- */
  function renderPerson() {
    // the photo area shows only when a real photo is set; otherwise the section is text only
    var fig = $('[data-render="kashan-photo"]');
    if (fig) {
      if (person.photo) fig.appendChild(el('div', { class: 'media' }, [el('img', { src: person.photo, alt: person.photoAlt || person.name, loading: 'lazy', decoding: 'async' })]));
      else { fig.parentNode.classList.add('no-photo'); fig.remove(); }
    }
    var note = $('[data-render="kashan-note"]');
    if (note) {
      note.appendChild(el('p', { text: person.note || '' }));
      if (!person.note) note.appendChild(ph('BUSINESS INFORMATION REQUIRED: personal note'));
      else if (!person.noteApproved) note.appendChild(ph('DRAFT NOTE: NEEDS OWNER APPROVAL'));
    }
    var n = $('[data-render="person-name"]'); if (n && person.name) n.textContent = person.name;
    var r = $('[data-render="person-role"]'); if (r && person.role) r.textContent = person.role;
  }

  /* ---------------- homes ---------------- */
  var cats = D.categories || [], products = D.products || [], pricing = D.pricing || {};
  var activeCat = 'all';
  function priceNode(p) {
    if (pricing.showStartingPrices && p && p.startingPrice > 0) {
      return el('span', { class: 'price', text: 'Starting from ' + money.format(p.startingPrice) });
    }
    return el('a', { class: 'price', href: '#start', 'data-cta': 'card_quote', 'data-home-type': p && p.formValue || '', text: 'Request a Project Quote' });
  }
  function categoryCard(c, wide) {
    var card = el('article', { class: 'card' + (wide ? ' wide' : '') });
    card.appendChild(media(c.image, c.imageAlt, wide ? '(max-width: 760px) 100vw, 640px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px', 'Rendering pending · ' + (c.assetId || ''), 'i-house'));
    var body = el('div', { class: 'card-body' }, [el('h3', { text: c.name }), el('p', { text: c.text })]);
    if (wide) body.appendChild(el('p', { class: 'card-more', text: 'Tell us what you need, and Kashan will send you the options that match.' }));
    var link = el('a', { class: 'card-link', href: '#start', 'data-home-type': c.formValue, 'data-cta': 'category_' + c.id }, ['Ask About This Category', icon('i-arrow')]);
    body.appendChild(el('div', { class: 'card-foot' }, [link, priceNode({ formValue: c.formValue })]));
    card.appendChild(body);
    return card;
  }
  function productCard(p) {
    var cat = cats.filter(function (c) { return c.id === p.category; })[0] || {};
    var img = (p.images && p.images[0]) || {};
    var card = el('article', { class: 'card' });
    card.appendChild(media(img.src, img.alt || p.name, '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px', 'Photo pending', 'i-house'));
    var specs = [];
    if (p.sizeSqFt) specs.push('≈ ' + p.sizeSqFt + ' sq ft');
    if (p.bedrooms !== undefined && p.bedrooms !== null && p.bedrooms !== '') specs.push(p.bedrooms === 0 ? 'Studio' : p.bedrooms + ' bed');
    if (p.bathrooms) specs.push(p.bathrooms + ' bath');
    var body = el('div', { class: 'card-body' });
    if (p.type) body.appendChild(el('span', { class: 'tag-soft', text: p.type }));
    body.appendChild(el('h3', { text: p.name }));
    if (specs.length) body.appendChild(el('p', { class: 'card-specs' }, specs.map(function (s) { return el('span', { text: s }); })));
    if (p.description) body.appendChild(el('p', { text: p.description }));
    if (p.features && p.features.length) body.appendChild(el('ul', { class: 'card-feats' }, p.features.slice(0, 3).map(function (f) { return el('li', { text: f }); })));
    if (p.customizable) body.appendChild(el('span', { class: 'tag-soft', text: 'Customizable' }));
    var view = el('button', { class: 'card-link', type: 'button', 'data-view': p.id, 'data-cta': 'view_home' }, ['View Home', icon('i-arrow')]);
    body.appendChild(el('div', { class: 'card-foot' }, [view, priceNode({ startingPrice: p.startingPrice, formValue: cat.formValue })]));
    if (pricing.showStartingPrices && p.startingPrice > 0) body.appendChild(el('p', { class: 'price-note', text: p.priceIncludes || pricing.homeOnlyNote }));
    card.appendChild(body);
    return card;
  }
  function renderHomes() {
    var tabs = $('[data-render="home-tabs"]'), grid = $('[data-render="home-grid"]');
    if (!tabs || !grid) return;
    var list = [{ id: 'all', name: 'All' }].concat(cats);
    list.forEach(function (c, i) {
      var t = el('button', { class: 'tab', type: 'button', role: 'tab', id: 'tab-' + c.id, 'aria-controls': 'home-grid', 'aria-selected': i === 0 ? 'true' : 'false', tabindex: i === 0 ? '0' : '-1', 'data-cat': c.id, text: c.name });
      tabs.appendChild(t);
    });
    grid.setAttribute('aria-labelledby', 'tab-all');
    tabs.addEventListener('click', function (e) { var t = e.target.closest('[role=tab]'); if (t) selectCat(t.getAttribute('data-cat'), true); });
    tabs.addEventListener('keydown', function (e) { rovingKeys(e, tabs, function (t) { selectCat(t.getAttribute('data-cat'), true); }); });
    drawHomes();
  }
  function selectCat(id, focus) {
    activeCat = id;
    $$('[data-render="home-tabs"] [role=tab]').forEach(function (t) {
      var on = t.getAttribute('data-cat') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    $('#home-grid').setAttribute('aria-labelledby', 'tab-' + id);
    drawHomes();
  }
  function drawHomes() {
    var grid = $('#home-grid');
    grid.textContent = '';
    var withProducts = {};
    products.forEach(function (p) { withProducts[p.category] = true; });
    var items = [];
    if (activeCat === 'all') {
      products.forEach(function (p) { items.push(productCard(p)); });
      cats.forEach(function (c) { if (!withProducts[c.id]) items.push(categoryCard(c, false)); });
    } else {
      var ps = products.filter(function (p) { return p.category === activeCat; });
      var c = cats.filter(function (x) { return x.id === activeCat; })[0];
      if (ps.length) ps.forEach(function (p) { items.push(productCard(p)); });
      else if (c) items.push(categoryCard(c, true));
    }
    items.forEach(function (n, i) { n.classList.add('reveal'); n.style.setProperty('--i', i % 3); grid.appendChild(n); });
    observeReveals(grid);
  }
  function rovingKeys(e, list, act) {
    var tabs = $$('[role=tab]', list), i = tabs.indexOf(doc.activeElement), n = -1;
    if (i < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault(); act(tabs[n]);
  }

  /* product drawer */
  function openDrawer(id) {
    var p = products.filter(function (x) { return x.id === id; })[0];
    var dlg = $('#home-drawer');
    if (!p || !dlg || !dlg.showModal) return;
    var cat = cats.filter(function (c) { return c.id === p.category; })[0] || {};
    var body = $('[data-render="drawer"]', dlg);
    body.textContent = '';
    var imgs = p.images || [];
    var main = media(imgs[0] && imgs[0].src, imgs[0] && imgs[0].alt, '(max-width: 720px) 100vw, 600px', 'Photo pending', 'i-house', true);
    body.appendChild(main);
    if (imgs.length > 1) {
      var thumbs = el('div', { class: 'drawer-thumbs', role: 'group', 'aria-label': 'More photos' });
      imgs.forEach(function (im, i) {
        var b = el('button', { type: 'button', 'aria-label': 'Show photo ' + (i + 1), 'aria-current': i === 0 ? 'true' : 'false' }, [picture(im.src, '', '76px')]);
        b.addEventListener('click', function () {
          var fresh = media(im.src, im.alt, '(max-width: 720px) 100vw, 600px', '', 'i-house', true);
          body.replaceChild(fresh, main); main = fresh;
          $$('button', thumbs).forEach(function (t) { t.setAttribute('aria-current', t === b ? 'true' : 'false'); });
        });
        thumbs.appendChild(b);
      });
      body.appendChild(thumbs);
    }
    if (p.isRendering) body.appendChild(el('span', { class: 'tag-soft', text: 'Digital rendering' }));
    var head = el('div', { class: 'sec-head', style: 'margin:0;gap:10px' });
    if (p.type) head.appendChild(el('span', { class: 'tag-soft', text: p.type }));
    head.appendChild(el('h3', { id: 'drawer-title', text: p.name, style: 'font-size:clamp(26px,3vw,34px)' }));
    if (p.description) head.appendChild(el('p', { class: 'lede', text: p.description }));
    body.appendChild(head);
    var rows = [];
    if (p.sizeSqFt) rows.push(['Approximate size', '≈ ' + p.sizeSqFt + ' sq ft']);
    if (p.dimensions) rows.push(['Dimensions', p.dimensions]);
    if (p.bedrooms !== undefined && p.bedrooms !== '') rows.push(['Bedrooms', p.bedrooms === 0 ? 'Studio' : String(p.bedrooms)]);
    if (p.bathrooms) rows.push(['Bathrooms', String(p.bathrooms)]);
    (p.specs || []).forEach(function (s) { rows.push(s); });
    if (rows.length) {
      var t = el('table', { class: 'spec-table' }, [el('caption', { class: 'sr-only', text: 'Specifications' })]);
      var tb = el('tbody');
      rows.forEach(function (r) { tb.appendChild(el('tr', null, [el('th', { scope: 'row', text: r[0] }), el('td', { text: r[1] })])); });
      t.appendChild(tb); body.appendChild(el('div', null, [el('h4', { text: 'Specifications' }), t]));
    }
    if (p.features && p.features.length) body.appendChild(el('div', null, [el('h4', { text: 'Key features' }), el('ul', { class: 'card-feats' }, p.features.map(function (f) { return el('li', { text: f }); }))]));
    body.appendChild(el('div', null, [el('h4', { text: 'Customization' }), el('p', { text: p.customizable ? 'This home can be customized. Available options vary by model.' : 'Ask Kashan which options are available for this home.' })]));
    [['Included', p.included], ['Optional upgrades', p.optional], ['Location-dependent', p.locationDependent]].forEach(function (g) {
      if (g[1] && g[1].length) body.appendChild(el('div', null, [el('h4', { text: g[0] }), el('ul', { class: 'card-feats' }, g[1].map(function (f) { return el('li', { text: f }); }))]));
    });
    var priceBox = el('div', null, [el('h4', { text: 'Price' })]);
    if (pricing.showStartingPrices && p.startingPrice > 0) {
      priceBox.appendChild(el('p', { style: 'font-weight:600;font-size:20px', text: 'Starting from ' + money.format(p.startingPrice) }));
      priceBox.appendChild(el('p', { class: 'fine', text: p.priceIncludes || pricing.homeOnlyNote }));
    } else priceBox.appendChild(el('p', { text: 'Request a Project Quote.' }));
    priceBox.appendChild(el('p', { class: 'fine', text: 'Your final project cost depends on your home, customization, location, transport, site requirements, permits and installation.' }));
    body.appendChild(priceBox);
    var cta = el('a', { class: 'btn btn-primary btn-block', href: '#start', 'data-cta': 'drawer_assessment', 'data-home-type': cat.formValue || '', 'data-model': p.name, text: 'Get Your Project Assessment' });
    cta.addEventListener('click', function () { dlg.close(); });
    body.appendChild(cta);
    dlg.showModal();
    track('view_home', { model_id: p.id });
  }
  function initDrawer() {
    var dlg = $('#home-drawer');
    if (!dlg) return;
    $('.drawer-close', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { body_unlock(); });
    dlg.addEventListener('cancel', function () { body_unlock(); });
    doc.addEventListener('click', function (e) {
      var v = e.target.closest('[data-view]');
      if (v) { openDrawer(v.getAttribute('data-view')); }
    });
  }
  function body_unlock() { doc.body.classList.remove('lock'); }

  /* prefill home type (and model) when a card or drawer button is used */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-home-type]');
    if (!a) return;
    var v = a.getAttribute('data-home-type');
    var sel = $('#f-type');
    if (v && sel) sel.value = v;
    var m = a.getAttribute('data-model');
    if (m) { var msg = $('#f-msg'); if (msg && !msg.value) msg.value = 'I am interested in the ' + m + '.'; }
  });

  /* ---------------- interiors ---------------- */
  function renderInteriors() {
    var g = $('[data-render="interiors"]');
    if (!g) return;
    var strip = el('div', { class: 'strip', tabindex: '0', role: 'region', 'aria-label': 'Interior renderings. Scroll sideways to see more.' });
    (D.interiors || []).forEach(function (it, i) {
      var f = el('figure', { class: 'shot' + (i === 0 ? ' big' : '') });
      f.appendChild(media(it.image, it.alt, i === 0 ? '(max-width: 720px) 78vw, 840px' : '(max-width: 720px) 78vw, 450px', 'Rendering pending · ' + (it.assetId || ''), i === 0 ? 'i-extras' : ['i-kitchen', 'i-extras', 'i-bath', 'i-doc'][i - 1]));
      f.appendChild(el('figcaption', { text: it.label }));
      strip.appendChild(f);
    });
    g.appendChild(strip);
    var prev = el('button', { class: 'strip-btn prev', type: 'button', 'aria-label': 'Previous image' }, [icon('i-arrow')]);
    var next = el('button', { class: 'strip-btn next', type: 'button', 'aria-label': 'Next image' }, [icon('i-arrow')]);
    function step(dir) {
      var shot = $('.shot', strip); if (!shot) return;
      strip.scrollBy({ left: dir * (shot.getBoundingClientRect().width + 16), behavior: reduceMQ.matches ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    g.appendChild(el('div', { class: 'strip-nav' }, [prev, next]));
  }

  /* ---------------- make it yours (homes) ---------------- */
  function renderMakeIt() {
    var box = $('[data-render="make-it"]'), opts = (D.customize || []).filter(function (o) { return o.verified !== false; });
    if (!box) return;
    if (!opts.length) { box.remove(); return; }
    box.appendChild(el('p', { class: 'make-it-h', text: 'Make it yours. Choose your:' }));
    box.appendChild(el('ul', { class: 'chiplist' }, opts.map(function (o) { return el('li', { text: o.name }); })));
  }

  /* ---------------- faq ---------------- */
  function renderFaq() {
    var box = $('[data-render="faq"]'), F = D.faq || [];
    if (!box) return;
    F.forEach(function (f, i) {
      var d = el('details', { class: 'reveal' });
      d.style.setProperty('--i', 0);
      d.appendChild(el('summary', null, [el('span', { text: f.q }), icon('i-down')]));
      var a = el('div', { class: 'faq-a' }, [el('p', { text: f.a })]);
      if (f.needs) a.appendChild(el('p', null, [ph(f.needs)]));
      d.appendChild(a);
      d.addEventListener('toggle', function () { if (d.open) track('faq_open', { faq_index: i + 1 }); });
      box.appendChild(d);
    });
  }

  /* ---------------- other images ---------------- */
  function renderImages() {
    var H = D.hero || {};
    var start = $('[data-render="start-image"]');
    if (start && H.ending) {
      var pic = picture(H.ending, '', '100vw');
      if (pic) { $('.start-art', start).remove(); start.appendChild(pic); }
    }
    var proc = $('[data-render="process-photos"]'), P = (D.process || []).filter(function (x) { return x && x.image; });
    if (proc) {
      if (!P.length) proc.remove();
      else {
        P.forEach(function (x) {
          proc.appendChild(el('figure', { class: 'proc' }, [media(x.image, x.alt, '(max-width: 720px) 100vw, 600px'), el('figcaption', { text: x.caption || '' })]));
        });
        proc.appendChild(el('span', { class: 'render-tag proc-tag', text: 'Renderings' }));
      }
    }
  }

  /* ---------------- select options ---------------- */
  var ISO = 'US CA MX GB IE AU NZ AE SA QA KW BH OM PK IN BD LK NP DE FR ES IT PT NL BE CH AT SE NO DK FI IS PL CZ SK HU RO BG GR HR SI RS TR IL JO EG MA DZ TN NG GH KE TZ UG ZA ET JP KR CN HK TW SG MY TH VN PH ID BR AR CL CO PE EC UY PY BO VE CR PA GT HN SV NI DO JM TT BS BB PR'.split(' ');
  function fillSelects() {
    var names;
    try { names = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) { names = null; }
    var countries = ISO.map(function (c) { return { code: c, name: names ? names.of(c) : c }; });
    var head = countries.shift();
    countries.sort(function (a, b) { return a.name.localeCompare(b.name); });
    countries.unshift(head);
    $$('[data-countries]').forEach(function (s) {
      countries.forEach(function (c) { s.appendChild(el('option', { value: c.name, text: c.name })); });
      s.appendChild(el('option', { value: 'Other', text: 'Another country' }));
      s.value = 'United States';
    });
    var types = cats.map(function (c) { return c.formValue; }).concat(['Not sure yet']);
    $$('[data-hometypes]').forEach(function (s) {
      s.appendChild(el('option', { value: '', text: 'Choose one' }));
      types.forEach(function (t) { s.appendChild(el('option', { value: t, text: t })); });
    });
    $$('select[data-list]').forEach(function (s) {
      s.getAttribute('data-list').split('|').forEach(function (v) { s.appendChild(el('option', { value: v, text: v || 'Choose one' })); });
    });
  }

  /* ---------------- lead form ---------------- */
  function initLeadForm() {
    var form = $('#lead-form'); if (!form) return;
    var s1 = $('[data-lead-step="1"]', form), s2 = $('[data-lead-step="2"]', form), done = $('.lead-done', form);
    var rules = [
      ['#f-name', function (v) { return v.trim().length > 1; }, '#f-name-err'],
      ['#f-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }, '#f-email-err'],
      ['#f-phone', function (v) { return v.replace(/\D/g, '').length >= 7; }, '#f-phone-err'],
      ['method', function () { return !!$('[name="contactMethod"]:checked', form); }, '#f-method-err'],
      ['#f-country', function (v) { return !!v; }, '#f-country-err'],
      ['#f-zip', function (v) { return v.trim().length > 1; }, '#f-zip-err'],
      ['#f-type', function (v) { return !!v; }, '#f-type-err'],
      ['#f-consent', function () { return $('#f-consent').checked; }, '#f-consent-err']
    ];
    function check(focusFirst) {
      var firstBad = null;
      rules.forEach(function (r) {
        var input = r[0] === 'method' ? $('[name="contactMethod"]', form) : $(r[0], form);
        var ok = r[1](input && input.value || '');
        var err = $(r[2], form);
        err.hidden = ok;
        var wrap = r[0] === 'method' ? input.closest('fieldset') : input.closest('.field');
        if (wrap) wrap.classList.toggle('invalid', !ok);
        if (input && r[0] !== 'method') input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstBad) firstBad = input;
      });
      if (firstBad && focusFirst) firstBad.focus();
      return !firstBad;
    }
    $('[data-lead-next]', form).addEventListener('click', function () {
      if (!check(true)) return;
      s1.hidden = true; s2.hidden = false;
      $('[data-lead-step2-title]', form).focus();
      track('lead_step_1_complete');
    });
    $('[data-lead-back]', form).addEventListener('click', function () { s2.hidden = true; s1.hidden = false; $('#f-name').focus(); });
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field, fieldset');
      if (f && f.classList.contains('invalid')) check(false);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!check(false)) { s2.hidden = true; s1.hidden = false; check(true); return; }
      var first = $('#f-name').value.trim().split(/\s+/)[0];
      var method = ($('[name="contactMethod"]:checked', form) || {}).value || 'Email';
      var methodWord = { Phone: 'phone', WhatsApp: 'WhatsApp', Email: 'email' }[method] || method;
      if ($('[name="_gotcha"]', form).value) { finish('ok', first, methodWord); return; }
      var endpoint = (D.form || {}).endpoint;
      if (!endpoint) { finish('notconnected'); return; }
      var btns = $$('button[type=submit]', form);
      btns.forEach(function (b) { b.disabled = true; });
      var data = new FormData(form);
      data.append('_subject', 'New Kikfia project assessment request');
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); finish('ok', first, methodWord); track('generate_lead', { home_type: $('#f-type').value, contact_method: method }); })
        .catch(function () { finish('fail'); })
        .then(function () { btns.forEach(function (b) { b.disabled = false; }); });
    });
    function finish(state, first, methodWord) {
      done.textContent = ''; done.classList.remove('warn');
      if (state === 'ok') {
        s1.hidden = true; s2.hidden = true;
        done.appendChild(icon('i-check', 'ic-l'));
        done.appendChild(el('h3', { text: 'Thank you, ' + first + '.' }));
        done.appendChild(el('p', { text: 'Your request is in. Kashan will contact you by ' + methodWord + '.' }));
        form.reset();
      } else if (state === 'notconnected') {
        done.classList.add('warn');
        done.appendChild(icon('i-mail', 'ic-l'));
        done.appendChild(el('p', { text: "This form isn't connected yet, so nothing was sent." }));
        done.appendChild(ph('BUSINESS INFORMATION REQUIRED: form endpoint in site-data.js'));
      } else {
        done.classList.add('warn');
        done.appendChild(icon('i-mail', 'ic-l'));
        var p = el('p', { text: "Your request didn't go through. Please try again, or email us at " });
        if (contact.email) p.appendChild(el('a', { href: 'mailto:' + contact.email, text: contact.email }));
        else p.appendChild(ph('EMAIL'));
        p.appendChild(doc.createTextNode('.'));
        done.appendChild(p);
      }
      done.hidden = false;
      done.focus();
    }
  }

  /* ---------------- header, nav, menu, bottom bar ---------------- */
  function initChrome() {
    var header = $('#site-header');
    var lastScrolled = null;
    function onScroll() {
      var s = scrollY > 8;
      if (s !== lastScrolled) { header.classList.toggle('scrolled', s); lastScrolled = s; }
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // active nav link
    var links = $$('.nav-links a');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          var a = map[en.target.id]; if (a) a.setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('main > section[id]').forEach(function (s) { io.observe(s); });
    }

    // menu sheet
    var btn = $('.menu-btn'), sheet = $('#menu-sheet'), lastFocus = null;
    function openMenu() {
      lastFocus = doc.activeElement;
      sheet.hidden = false; btn.setAttribute('aria-expanded', 'true');
      doc.body.classList.add('lock'); bar(false);
      $('.menu-close', sheet).focus();
    }
    function closeMenu(restore) {
      sheet.hidden = true; btn.setAttribute('aria-expanded', 'false');
      doc.body.classList.remove('lock');
      if (restore !== false && lastFocus) lastFocus.focus();
      updateBar();
    }
    btn.addEventListener('click', openMenu);
    $('.menu-close', sheet).addEventListener('click', function () { closeMenu(); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(false); });
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a, button', sheet), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // phone bottom bar: after the hero, hidden near the form and while the menu is open
    var barEl = $('#bottom-bar'), pastHero = false, nearForm = false, shown = null;
    barEl.hidden = false;
    function bar(on) { if (on !== shown) { barEl.classList.toggle('show', on); shown = on; barEl.setAttribute('aria-hidden', on ? 'false' : 'true'); $$('a', barEl).forEach(function (a) { a.tabIndex = on ? 0 : -1; }); } }
    function updateBar() { bar(pastHero && !nearForm && sheet.hidden); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { pastHero = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; updateBar(); }, { threshold: 0 }).observe($('.hero'));
      new IntersectionObserver(function (en) { nearForm = en[0].isIntersecting; updateBar(); }, { rootMargin: '0px 0px -10% 0px' }).observe($('#start'));
    }
    bar(false);
  }

  /* ---------------- reveals and drawn lines ---------------- */
  var revealIO = null;
  function settle(n) {
    var d = parseFloat(getComputedStyle(n).getPropertyValue('--i')) || 0;
    setTimeout(function () { n.classList.add('settled'); }, 950 + d * 80);
  }
  function observeReveals(scope) {
    var items = $$('.reveal:not(.in)', scope || doc);
    if (!revealIO || reduceMQ.matches) { items.forEach(function (n) { n.classList.add('in', 'settled'); }); return; }
    items.forEach(function (n) { revealIO.observe(n); });
  }
  function initReveals() {
    // stagger siblings inside grids
    ['.plan-steps', '.process-photos'].forEach(function (sel) {
      $$(sel).forEach(function (g) { $$('.reveal', g).forEach(function (n, i) { n.style.setProperty('--i', i); }); });
    });
    if ('IntersectionObserver' in window) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('in'); settle(en.target); revealIO.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      var secIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); secIO.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -20% 0px', threshold: 0.05 });
      $$('main > section, .you-line').forEach(function (s) { secIO.observe(s); });
    } else {
      $$('main > section, .you-line').forEach(function (s) { s.classList.add('in'); });
    }
    observeReveals();
  }

  /* ---------------- structured data ---------------- */
  function structuredData() {
    var a = brand.mailingAddress || {}, S = D.social || {};
    var org = {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: brand.fullName, alternateName: brand.name, legalName: brand.legalEntity,
      address: { '@type': 'PostalAddress', streetAddress: a.line1, addressLocality: a.city, addressRegion: a.region, postalCode: a.postalCode, addressCountry: 'US' }
    };
    if (brand.domain) { org.url = brand.domain + '/'; if (brand.logo) org.logo = brand.domain + '/' + brand.logo; }
    if (contact.email) org.email = contact.email;
    if (contact.phone) org.telephone = contact.phone;
    var same = Object.keys(S).map(function (k) { return S[k]; }).filter(Boolean);
    if (same.length) org.sameAs = same;
    var graph = [org];
    if (brand.domain) graph.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: brand.fullName, url: brand.domain + '/' });
    var faqs = (D.faq || []).filter(function (f) { return !f.needs; });
    if (faqs.length) graph.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) });
    graph.forEach(function (g) { doc.head.appendChild(el('script', { type: 'application/ld+json', text: JSON.stringify(g) })); });
  }

  /* ---------------- motion housekeeping ---------------- */
  doc.addEventListener('visibilitychange', function () { doc.body.classList.toggle('paused', doc.hidden); });
  reduceMQ.addEventListener('change', function (e) { if (e.matches) $$('.reveal, main > section, .you-line').forEach(function (n) { n.classList.add('in', 'settled'); }); });

  /* ---------------- start ---------------- */
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.error(e); } }
  safe(renderBrand); safe(renderContact); safe(renderPerson); safe(fillSelects);
  safe(renderHomes); safe(initDrawer); safe(renderMakeIt); safe(renderInteriors);
  safe(renderFaq); safe(renderImages); safe(initLeadForm); safe(initChrome);
  safe(initReveals); safe(structuredData); safe(initConsent);
})();
