/* =====================================================================
   template.js — builds the page from config.js.
   You should not need to edit this file; change config.js instead.
   ===================================================================== */
(function(){
  var C = window.INVITE || {};
  window.INVITE = C;

  /* ---------- helpers (shared with main.js through window.INV) ---------- */
  function get(path){ return path.split('.').reduce(function(o,k){ return o == null ? o : o[k]; }, C); }
  function esc(s){ return String(s == null ? '' : s).replace(/&(?![a-z#0-9]+;)/gi,'&amp;').replace(/"/g,'&quot;'); }
  function txt(s){ var d = document.createElement('div'); d.innerHTML = s || ''; return d.textContent; }
  var TZ = C.timezone || '+05:30';
  function toDate(local){ return new Date(local.length <= 16 ? local + ':00' + TZ : local); }       // '2026-11-22T11:00'
  function toICS(local){ return toDate(local).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'; }
  function digits(p){ return String(p || '').replace(/[^\d]/g,''); }
  function gdir(lat, lng){ return 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng; }
  var V = C.venue || {};
  var main = V.main || {};
  window.INV = { C:C, get:get, txt:txt, toDate:toDate, toICS:toICS, digits:digits, gdir:gdir,
                 venueLink: V.mapsLink || gdir(main.lat, main.lng) };

  /* ---------- colour theme: 3 colours in, every shade mixed from them ---------- */
  var T = C.theme;
  if (typeof T === 'string') T = (window.THEMES || {})[T];
  T = T || {};
  C.theme = T;
  var main = T.main || '#a0105a', dark = T.dark || '#5c0733', gold = T.gold || '#d99a2b';
  function mix(a, p, b){ return 'color-mix(in srgb,' + a + ' ' + p + '%,' + b + ')'; }
  var shades = {
    '--maroon': main, '--maroon-d': dark, '--maroon-l': mix(main, 82, '#fff'),
    '--red': mix(main, 80, dark), '--vermilion': mix(main, 85, '#fff'), '--pink': mix(main, 55, '#fff'),
    '--gold': gold, '--gold-l': mix(gold, 40, '#fff'),
    '--blush': mix(main, 18, '#fff'), '--blush-l': mix(main, 6, '#fff'),
    '--cream': mix(main, 3, '#fff'), '--paper': mix(main, 5, '#fff'),
    '--ink': mix(dark, 75, '#000'), '--muted': mix(dark, 60, '#888'),
    '--line': mix(main, 14, '#fff'), '--border': mix(main, 24, '#fff'), '--on-dark': mix(main, 12, '#fff'),
    '--img-filter': T.pictures || 'saturate(1)'
  };
  var root = document.documentElement.style;
  Object.keys(shades).forEach(function(k){ root.setProperty(k, shades[k]); });
  var tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = main;
  /* petals use the theme: main, two lighter shades, gold and white */
  T.petals = [main, mixHex(main, .55), mixHex(main, .3), gold, '#ffffff', mixHex(main, .75)];
  function mixHex(h, w){   /* h mixed with white, w = share of white (petals are drawn on canvas, which needs real hex) */
    var n = parseInt(h.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    return 'rgb(' + [r, g, b].map(function(c){ return Math.round(c + (255 - c) * w); }).join(',') + ')';
  }

  /* ---------- page title ---------- */
  if (C.pageTitle) document.title = C.pageTitle;
  if (C.pageDescription){ var d = document.querySelector('meta[name=description]'); if (d) d.content = C.pageDescription; }

  /* ---------- plain texts: every element with data-t="path.in.config" ---------- */
  var N = C.names || {};
  var couple = (N.first || '') + ' ' + (N.joiner || '&') + ' ' + (N.second || '');
  document.querySelectorAll('[data-t]').forEach(function(el){
    var k = el.getAttribute('data-t');
    var v = k === '@couple' ? couple : get(k);
    if (v == null || v === '') { el.style.display = 'none'; return; }   // empty text = hide that line
    el.innerHTML = esc(v).replace(/&quot;/g,'"');
  });

  /* ---------- pictures & music ---------- */
  var I = C.images || {};
  function src(id, f){ var e = document.getElementById(id); if (e && f) e.src = f; }
  src('imgGate', I.gateBackground); src('imgSeal', I.seal); src('imgGanesh', I.ganesh); src('imgCouple', I.couple);
  if (I.mirrorCouple === false) { var cp = document.getElementById('imgCouple'); if (cp) cp.style.scale = '1 1'; }
  if (I.pillarLeft)  document.querySelector('.lyr-L').style.borderImageSource = 'url("' + I.pillarLeft + '")';
  if (I.pillarRight) document.querySelector('.lyr-R').style.borderImageSource = 'url("' + I.pillarRight + '")';
  if (C.music && C.music.file) document.getElementById('bgm').src = C.music.file;

  /* ---------- facts strip ---------- */
  var facts = document.getElementById('facts');
  (C.facts || []).forEach(function(f){
    facts.insertAdjacentHTML('beforeend',
      '<div class="fact rv"><svg class="ic" aria-hidden="true"><use href="#i-' + (f.icon || 'kalash') + '"/></svg>' +
      '<p class="kicker">' + esc(f.kicker) + '</p><strong>' + esc(f.title) + '</strong><small>' + (f.text || '') + '</small></div>');
  });

  /* ---------- events ---------- */
  var COLORS = {
    saffron: ['#e8730c','#9a2c06','#b4410e','#fff1e2','#f6cfa8'],
    green:   ['#e9b10e','#3f7a1e','#3f6f1c','#fbf6d8','#e3d891'],
    teal:    ['#0e8a8f','#0b3644','#0b5f68','#e7f5f3','#a9d8d4'],
    rose:    ['#ec407a','#880e4f','#ad1457','#fff0f6','#f8bbd0'],
    purple:  ['#8e44ad','#3c1361','#6a1b9a','#f5ecfb','#dcc3ee'],
    maroon:  ['#a3171c','#5a0a0e','#8b0f14','#fff1ea','#f1c9b8']
  };
  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var evWrap = document.getElementById('events'), dots = document.getElementById('evDots'), checks = document.getElementById('rsvpChecks');
  (C.events || []).forEach(function(e, i){
    var p = (e.date || '').split('-').map(Number), dt = new Date(Date.UTC(p[0], p[1]-1, p[2]));
    var col = COLORS[e.color] || COLORS.saffron;
    var cal = e.calendar || {};
    var sched = (e.schedule || []).map(function(r){ return '<li><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></li>'; }).join('');
    var ml = e.mapLink || {};
    var html =
      '<article class="event rv" style="--e1:' + col[0] + ';--e2:' + col[1] + ';--ea:' + col[2] + ';--el:' + col[3] + ';--eb:' + col[4] + '">' +
        '<div class="event-top"><svg aria-hidden="true"><use href="#i-' + (e.icon || 'kalash') + '"/></svg>' +
          '<div class="wd">' + (e.weekday || DAYS[dt.getUTCDay()]) + '</div><div class="dn">' + (e.day || dt.getUTCDate()) + '</div>' +
          '<div class="mo">' + (e.month || MONTHS[dt.getUTCMonth()] + ' ' + dt.getUTCFullYear()) + '</div></div>' +
        '<div class="event-body"><h3>' + esc(e.title) + '</h3>' +
          (e.subtitle ? '<div class="hi">' + esc(e.subtitle) + '</div>' : '') +
          (sched ? '<ul class="sched">' + sched + '</ul>' : '') +
          (e.note ? '<p>' + esc(e.note) + '</p>' : '') +
          (cal.start ? '<button class="cal" type="button" data-i="' + i + '"><svg aria-hidden="true"><use href="#i-cal"/></svg>Add to calendar</button>' : '') +
          (ml.text !== '' ? '<a class="go" href="' + esc(ml.url || window.INV.venueLink) + '" target="_blank" rel="noopener">' + esc(ml.text || 'Open in Google Maps ↗') + '</a>' : '') +
        '</div></article>';
    evWrap.insertAdjacentHTML('beforeend', html);
    var b = document.createElement('button'); b.type = 'button'; if (!i) b.className = 'on'; b.setAttribute('aria-label', txt(e.title)); dots.appendChild(b);
    var lab = document.createElement('label'); var cb = document.createElement('input');
    cb.type = 'checkbox'; cb.name = 'events'; cb.value = txt(e.rsvpLabel || e.title);
    lab.appendChild(cb); lab.appendChild(document.createTextNode(' ' + txt(e.rsvpLabel || e.title))); checks.appendChild(lab);
  });

  /* ---------- map buttons ---------- */
  var foot = document.getElementById('mapFoot');
  (V.buttons || []).forEach(function(b){
    var a = document.createElement('a'); a.className = 'btn' + (b.style === 'outline' ? ' ghost-m' : '');
    a.href = b.url || gdir(main.lat, main.lng); a.target = '_blank'; a.rel = 'noopener'; a.textContent = txt(b.text);
    foot.appendChild(a);
  });

  /* ---------- contacts ---------- */
  var people = document.getElementById('people');
  ((C.footer || {}).contacts || []).forEach(function(p){
    people.insertAdjacentHTML('beforeend',
      '<div class="person"><strong>' + esc(p.name) + '</strong>' + (p.role ? '<em>' + esc(p.role) + '</em>' : '') +
      '<span class="num">' + esc(p.phone) + '</span>' +
      '<a class="call" href="tel:+' + digits(p.phone) + '"><svg aria-hidden="true"><use href="#i-phone"/></svg>Call</a></div>');
  });
})();
