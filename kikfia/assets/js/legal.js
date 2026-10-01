/* Fills contact facts on the legal pages from site-data.js. */
(function () {
  'use strict';
  var D = window.KIKFIA || {}, b = D.brand || {}, a = b.mailingAddress || {}, c = D.contact || {}, L = D.legal || {};
  function ph(t) { var s = document.createElement('span'); s.className = 'ph'; s.textContent = '[' + t + ']'; return s; }
  document.querySelectorAll('[data-email]').forEach(function (n) {
    if (c.email) { var l = document.createElement('a'); l.href = 'mailto:' + c.email; l.textContent = c.email; n.appendChild(l); }
    else n.appendChild(ph('EMAIL'));
  });
  document.querySelectorAll('[data-address]').forEach(function (n) {
    n.textContent = [a.line1, a.city + ', ' + a.region + ' ' + a.postalCode, a.country].join(', ');
  });
  document.querySelectorAll('[data-legal-date]').forEach(function (n) {
    if (L.lastUpdated) n.textContent = L.lastUpdated; else n.appendChild(ph('DATE AFTER LEGAL REVIEW'));
  });
  if (L.legalReviewDone) document.querySelectorAll('.legal-flag').forEach(function (n) { n.remove(); });
})();
