// Krete Works Concrete — landing page interactions

// ---- City swap (prepares for Google Ads location insertion) ----
// ?city=Pageland        → "Pageland, SC"
// ?loc=1025631          → same, via Google's location ID ({loc_physical_ms} in the URL suffix)
// Anything unknown      → stays on the default (Cheraw, SC) baked into the HTML.
(function () {
  var TOWNS = {
    // Google Ads geo IDs (pulled 2026-11-04) → display name
    '1025523': 'Cheraw, SC', '1025526': 'Chesterfield, SC', '1025631': 'Pageland, SC',
    '1025571': 'Hartsville, SC', '9209144': 'McBee, SC', '1025508': 'Bennettsville, SC',
    '1025534': 'Darlington, SC',
    '1021221': 'Monroe, NC', '1021207': 'Marshville, NC', '1020981': 'Aberdeen, NC',
    '1021312': 'Southern Pines, NC', '1021183': 'Laurinburg, NC', '1021288': 'Rockingham, NC',
    '1021348': 'Wadesboro, NC', '1021263': 'Pinehurst, NC',
    // counties → the main town we'd say
    '9059214': 'Chesterfield County, SC', '9059235': 'Marlboro County, SC', '9059217': 'Darlington County, SC',
    '9058791': 'Anson County, NC', '9058859': 'Richmond County, NC', '9058865': 'Scotland County, NC',
    '9058847': 'Moore County, NC'
  };
  var BY_NAME = {
    'cheraw': 'Cheraw, SC', 'chesterfield': 'Chesterfield, SC', 'pageland': 'Pageland, SC', 'hartsville': 'Hartsville, SC',
    'mcbee': 'McBee, SC', 'bennettsville': 'Bennettsville, SC', 'darlington': 'Darlington, SC',
    'monroe': 'Monroe, NC', 'marshville': 'Marshville, NC', 'aberdeen': 'Aberdeen, NC', 'southern pines': 'Southern Pines, NC',
    'laurinburg': 'Laurinburg, NC', 'rockingham': 'Rockingham, NC', 'wadesboro': 'Wadesboro, NC', 'pinehurst': 'Pinehurst, NC'
  };
  try {
    var q = new URLSearchParams(location.search);
    var name = null;
    if (q.get('city')) name = BY_NAME[q.get('city').trim().toLowerCase()] || null;
    if (!name && q.get('loc')) name = TOWNS[q.get('loc').trim()] || null;
    if (name) {
      document.querySelectorAll('[data-city]').forEach(function (el) { el.textContent = name; });
      document.querySelectorAll('[data-city-short]').forEach(function (el) { el.textContent = name.split(',')[0]; });
    }
  } catch (e) {}
})();

// ---- Scroll reveal ----
var reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(function (el) { io.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add('in'); });
}

// ---- Sticky mobile bar: only after the hero scrolls away ----
(function () {
  var bar = document.querySelector('.mobile-bar');
  var hero = document.querySelector('.hero');
  if (!bar || !hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (entries) {
    bar.classList.toggle('show', !entries[0].isIntersecting);
  }, { threshold: 0.05 }).observe(hero);
})();

// ---- Lightbox for the big work photos ----
(function () {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var lbImg = lightbox.querySelector('img');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var open = function (src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  var close = function () {
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.work-pic').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      open(img.getAttribute('src'), img.getAttribute('alt'));
    });
  });
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lightbox.classList.contains('open')) close(); });
})();

// ---- Call clicks → secondary gtag event (safe if gtag isn't configured yet) ----
document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
  a.addEventListener('click', function () {
    try { if (typeof gtag === 'function') gtag('event', 'call_click', { event_category: 'lead', event_label: location.pathname }); } catch (e) {}
  });
});

// ---- Quote form: don't pretend to send until the Web3Forms key is real ----
document.querySelectorAll('form.quote-form').forEach(function (form) {
  form.addEventListener('submit', function (ev) {
    // Bot trap: the hidden "botcheck" box is invisible to people; if a bot ticked it, drop the submit silently.
    var hp = form.querySelector('input[name="botcheck"]');
    if (hp && hp.checked) { ev.preventDefault(); return; }
    var key = form.querySelector('input[name="access_key"]');
    if (key && /YOUR_WEB3FORMS_KEY/.test(key.value)) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Form not live yet — call (704) 635-1960'; btn.disabled = true; }
      return;
    }
    try { if (typeof gtag === 'function') gtag('event', 'form_submit', { event_category: 'lead', event_label: location.pathname }); } catch (e) {}
  });
});

// ---- Footer year ----
document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
