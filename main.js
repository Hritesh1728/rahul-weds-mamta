/* main.js: animations, countdown, RSVP, calendar and map.
   All texts, dates, links and colours live in config.js. */
var CFG = window.INVITE || {}, INV = window.INV;
var MAPBOX_TOKEN = (CFG.venue || {}).mapboxToken || '';

/* ---------- countdown to countdown.target in config.js ----------
   More than a day away: days, hours, minutes, seconds.
   On the day: hours, minutes, seconds (no "00 days").
   In the last hour: minutes and seconds. */
(function(){
  var t = INV.toDate((CFG.countdown || {}).target || '2026-01-01T00:00');
  var clock = document.getElementById('clock'), sec = clock.closest('section'), until = document.getElementById('until');
  var units = {}, seps = clock.querySelectorAll('.sep');
  clock.querySelectorAll('.unit').forEach(function(u){ units[u.dataset.u] = u; });
  function show(list){
    ['days','hours','minutes','seconds'].forEach(function(k, i){
      units[k].hidden = list.indexOf(k) < 0;
      if (i) seps[i-1].hidden = units[k].hidden || list.indexOf(k) === 0;
    });
  }
  function put(k, n){
    var b = units[k].querySelector('b'), v = String(n).padStart(2,'0');
    if (b.textContent !== v){ b.textContent = v; b.classList.remove('flip'); void b.offsetWidth; b.classList.add('flip'); }
    units[k].querySelector('span').textContent = (n === 1 ? k.slice(0,-1) : k);
  }
  function tick(){
    var d = Math.max(0, t - new Date());
    var D = Math.floor(d/864e5), H = Math.floor(d/36e5)%24, M = Math.floor(d/6e4)%60, S = Math.floor(d/1e3)%60;
    if (d === 0){
      show([]); sec.classList.add('is-today'); until.innerHTML = (CFG.countdown || {}).started || ''; return;
    }
    var list = D > 0 ? ['days','hours','minutes','seconds'] : (H > 0 ? ['hours','minutes','seconds'] : ['minutes','seconds']);
    show(list);
    clock.classList.toggle('today', D === 0);
    sec.classList.toggle('is-today', D === 0);
    if (D > 0) put('days', D);
    put('hours', D > 0 ? H : H); put('minutes', M); put('seconds', S);
  }
  tick(); setInterval(tick, 1000);
})();


/* ---------- phones: fit the first page to the full screen height ---------- */
(function(){
  var st = document.querySelector('.stage'); if (!st) return;
  function fit(){
    var wide = matchMedia('(min-width:900px) and (min-height:560px) and (min-aspect-ratio:1/1)').matches;
    st.classList.remove('roomy');
    if (wide){ st.style.removeProperty('--cs'); st.style.removeProperty('--ts'); st.style.removeProperty('--ty'); return; }
    var W = st.clientWidth, H = st.clientHeight, u = W / 512, extra = H - 722 * u;
    if (extra <= 2){ st.style.setProperty('--cs',1); st.style.setProperty('--ts',1); st.style.setProperty('--ty','0px'); return; }
    var cs = Math.min(1.42, 1 + (extra * 0.55) / (323 * u));
    var ts = Math.min(1.2, 1 + (extra * 0.3) / (255 * u));
    var gap = H - 323 * u * cs - 86 * u - 308 * u * ts - 14 * u;   /* free space between text and couple */
    var ty = Math.max(0, gap * 0.35);
    st.classList.toggle('roomy', gap > 60 * u);
    st.style.setProperty('--cs', cs.toFixed(3)); st.style.setProperty('--ts', ts.toFixed(3)); st.style.setProperty('--ty', ty.toFixed(1) + 'px');
  }
  fit(); addEventListener('resize', fit); addEventListener('orientationchange', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();

/* ---------- reveal on scroll ---------- */
(function(){
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){e.classList.add('in')}); return; }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(e){ io.observe(e) });
})();

/* ---------- falling petals over the hero ---------- */
(function(){
  var c = document.getElementById('petals');
  if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = c.getContext('2d'), P = [], W = 0, H = 0, run = false, dpr = Math.min(2, window.devicePixelRatio||1);
  var cols = (CFG.theme && CFG.theme.petals) || ['#f4a6c6','#e91e63','#f8bbd0','#ec407a','#ffd6e6','#c2185b','#f3c25a'];
  function size(){ W = c.clientWidth; H = c.clientHeight; c.width = W*dpr; c.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  function make(top){ return {x:Math.random()*W, y:top?Math.random()*-H:Math.random()*H, r:4+Math.random()*6, vy:.35+Math.random()*.7, vx:-.3+Math.random()*.6, a:Math.random()*6.28, va:-.02+Math.random()*.04, sw:Math.random()*6.28, c:cols[Math.random()*cols.length|0], k:Math.random()}; }  /* k: <.2 heart, <.32 gold sparkle, else rose petal */
  function frame(){
    if (!run) return;
    ctx.clearRect(0,0,W,H);
    P.forEach(function(p){
      p.sw += .02; p.y += p.vy; p.x += p.vx + Math.sin(p.sw)*.4; p.a += p.va;
      if (p.y > H+20) { Object.assign(p, make(true)); p.y = -20; }
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.scale(1, Math.abs(Math.cos(p.sw))*.6+.4);
      ctx.fillStyle = p.c; ctx.globalAlpha = .8; ctx.beginPath();
      if (p.k < .2){ var r = p.r*.8; ctx.fillStyle = p.c === '#f3c25a' ? '#e91e63' : p.c; ctx.moveTo(0,r*.9); ctx.bezierCurveTo(-r*1.4,0,-r*.7,-r*1.1,0,-r*.35); ctx.bezierCurveTo(r*.7,-r*1.1,r*1.4,0,0,r*.9); }
      else if (p.k < .32){ var s = p.r*.7; ctx.fillStyle = '#f3c25a'; ctx.globalAlpha = .55 + .45*Math.abs(Math.sin(p.sw*2)); ctx.moveTo(0,-s); ctx.lineTo(s*.25,-s*.25); ctx.lineTo(s,0); ctx.lineTo(s*.25,s*.25); ctx.lineTo(0,s); ctx.lineTo(-s*.25,s*.25); ctx.lineTo(-s,0); ctx.lineTo(-s*.25,-s*.25); ctx.closePath(); }
      else { ctx.moveTo(0,-p.r); ctx.quadraticCurveTo(p.r*.9,0,0,p.r); ctx.quadraticCurveTo(-p.r*.9,0,0,-p.r); }
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', size);
  var n = W > 900 ? 46 : 24; for (var i=0;i<n;i++) P.push(make(false));
  window.startPetals = function(){
    new IntersectionObserver(function(es){ var v = es[0].isIntersecting; if (v && !run){ run = true; frame(); } else if (!v) run = false; }).observe(c);
  };
})();

/* ---------- RSVP via WhatsApp ---------- */
(function(){
  var f = document.getElementById('rsvpForm');
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('rsvpName').value.trim(), msg = document.getElementById('rsvpMsg');
    if (!name){ msg.textContent = 'Please enter your name first.'; return; }
    msg.textContent = '';
    var evs = [].slice.call(f.querySelectorAll('input[name=events]:checked')).map(function(c){return c.value});
    var R = CFG.rsvp || {};
    var text = encodeURIComponent(INV.txt(R.messageTitle || 'RSVP')) + '%0A' +
      'Name: ' + encodeURIComponent(name) + '%0A' +
      'Guests: ' + encodeURIComponent(document.getElementById('rsvpGuests').value) + '%0A' +
      'Attending: ' + encodeURIComponent(evs.length ? evs.join(', ') : 'Not yet decided');
    window.open('https://wa.me/' + INV.digits(R.whatsapp) + '?text=' + text, '_blank', 'noopener');
  });
})();

/* ---------- background music ---------- */
(function(){
  var audio = document.getElementById('bgm'), btn = document.getElementById('musicBtn'), label = document.getElementById('musicLabel');
  audio.volume = (CFG.music && CFG.music.volume != null) ? CFG.music.volume : .6;
  function set(on){ btn.classList.toggle('on',on); btn.setAttribute('aria-pressed',on); label.textContent = on ? 'Music on' : 'Music off'; }
  window.startMusic = function(){ var p = audio.play(); if (p && p.then) p.then(function(){set(true)}).catch(function(){ set(false); label.textContent = 'Tap to play music'; }); };
  btn.addEventListener('click', function(e){ e.stopPropagation(); if (audio.paused){ btn.dataset.off=''; window.startMusic(); } else { audio.pause(); btn.dataset.off='1'; } });
  audio.addEventListener('pause', function(){set(false)});
  audio.addEventListener('play', function(){set(true)});
})();


/* ---------- mobile UX: calendar, swipe dots, guest stepper, quick-action bar ---------- */
(function(){
  /* add to calendar: Google Calendar on Android, an .ics file everywhere else */
  var V = CFG.venue || {}, N = CFG.names || {};
  var couple = (N.first || '') + ' & ' + (N.second || '');
  document.querySelectorAll('.cal').forEach(function(b){
    b.addEventListener('click', function(){
      var ev = CFG.events[+b.dataset.i], c = ev.calendar || {};
      var t = INV.txt(ev.title) + ' · ' + couple, s = INV.toICS(c.start), e = INV.toICS(c.end || c.start);
      var LOC = INV.txt(c.location || V.calendarLocation || V.address || ''), MAP = c.mapUrl || INV.venueLink;
      if (/Android/i.test(navigator.userAgent)) {
        window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(t) + '&dates=' + s + '/' + e +
          '&location=' + encodeURIComponent(LOC) + '&details=' + encodeURIComponent('Directions: ' + MAP), '_blank', 'noopener');
        return;
      }
      var ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','BEGIN:VEVENT',
        'UID:' + s + '-' + b.dataset.i + '@wedding-invite','DTSTAMP:' + new Date().toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z',
        'DTSTART:' + s,'DTEND:' + e,'SUMMARY:' + t,'LOCATION:' + LOC.replace(/,/g,'\\,'),'DESCRIPTION:Directions: ' + MAP,
        'BEGIN:VALARM','TRIGGER:-PT3H','ACTION:DISPLAY','DESCRIPTION:' + t,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
      var url = URL.createObjectURL(new Blob([ics], {type:'text/calendar;charset=utf-8'}));
      var a = document.createElement('a'); a.href = url; a.download = t.split(' · ')[0].replace(/[^a-z]+/gi,'-') + '.ics';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
    });
  });

  /* event carousel: dots follow the centred card, tap a dot to jump to it */
  var row = document.querySelector('.events'), dots = document.querySelectorAll('#evDots button');
  if (row && dots.length){
    var cards = row.querySelectorAll('.event');
    function cur(){
      var mid = row.scrollLeft + row.clientWidth / 2, best = 0, d = 1e9;
      cards.forEach(function(c, i){ var m = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (m < d){ d = m; best = i; } });
      dots.forEach(function(x, i){ x.classList.toggle('on', i === best); x.setAttribute('aria-selected', i === best); });
      cards.forEach(function(c, i){ c.classList.toggle('cur', i === best); });
    }
    row.addEventListener('scroll', function(){ requestAnimationFrame(cur); }, {passive:true});
    dots.forEach(function(x, i){ x.addEventListener('click', function(){
      var c = cards[i]; row.scrollTo({left: c.offsetLeft - (row.clientWidth - c.offsetWidth) / 2, behavior:'smooth'});
    }); });
    cur(); addEventListener('resize', cur);
  }

  /* guest stepper */
  var out = document.getElementById('rsvpGuests');
  document.querySelectorAll('.stepper button').forEach(function(b){
    b.addEventListener('click', function(){
      var n = Math.min(25, Math.max(1, (parseInt(out.textContent, 10) || 1) + Number(b.dataset.d)));
      out.textContent = n; out.value = String(n);
    });
  });

  /* quick-action bar: appears after the first screen, highlights the section you are in */
  var nav = document.getElementById('mnav'), hero = document.getElementById('invitation');
  if (!nav) return;
  new IntersectionObserver(function(es){
    var away = !es[0].isIntersecting;
    nav.classList.toggle('show', away); document.body.classList.toggle('nav-on', away);
  }, {threshold:.15}).observe(hero.querySelector('.stage'));
  var links = {}; nav.querySelectorAll('a[data-s]').forEach(function(a){ links[a.dataset.s] = a; });
  /* the highlighted tab follows the section the guest is reading */
  var ids = ['celebrations','venue','rsvp','contacts'], ticking = false;
  function activeSection(){
    ticking = false;
    var line = window.innerHeight * 0.45, cur = null;
    ids.forEach(function(id){ var el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= line) cur = id; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = 'contacts';
    Object.keys(links).forEach(function(k){ links[k].classList.toggle('on', k === cur); });
  }
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(activeSection); } }, {passive:true});
  window.addEventListener('resize', activeSection);
  activeSection();

  /* music toggle in the bar mirrors the floating button */
  var mb = document.getElementById('mnavMusic'), main = document.getElementById('musicBtn'), audio = document.getElementById('bgm');
  mb.addEventListener('click', function(){ main.click(); });
  function sync(){ var on = !audio.paused; mb.classList.toggle('on', on); mb.setAttribute('aria-pressed', on); mb.querySelector('.lbl').textContent = on ? 'Music on' : 'Music off'; }
  audio.addEventListener('play', sync); audio.addEventListener('pause', sync);
})();

/* ---------- envelope: tap to open, then play the hero entrance ---------- */
(function(){
  var gate = document.getElementById('gate'), hero = document.getElementById('invitation'), opened = false;
  var cols = ['#f3c25a','#f4a6c6','#ffd6e6','#d99a2b','#c2185b','#ffffff','#e91e63'];
  /* soft twinkling lights around the envelope */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) for (var t=0;t<18;t++){ var tw = document.createElement('span'); tw.className = 'twinkle';
    tw.style.left = (5 + Math.random()*90) + '%'; tw.style.top = (5 + Math.random()*90) + '%'; tw.style.animationDelay = (-Math.random()*3).toFixed(2) + 's'; tw.style.animationDuration = (2.2 + Math.random()*2.4).toFixed(2) + 's'; gate.appendChild(tw); }
  function burst(){
    for (var i=0;i<56;i++){
      var c = document.createElement('span'); c.className = 'confetti'; c.style.background = cols[i%cols.length]; gate.appendChild(c);
      var ang = Math.random()*6.28, dist = 140+Math.random()*240, dx = Math.cos(ang)*dist, dy = Math.sin(ang)*dist-80, rot = Math.random()*720-360;
      var a = c.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) rotate('+rot+'deg)',opacity:0}],{duration:1400+Math.random()*700,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});
      a.onfinish = (function(el){return function(){el.remove()}})(c);
    }
  }
  function open(){
    if (opened) return; opened = true;
    gate.classList.add('opening');
    if (window.startMusic) window.startMusic();
    setTimeout(burst, 1100);
    setTimeout(function(){
      gate.classList.add('hide'); document.body.classList.remove('locked');
      requestAnimationFrame(function(){ hero.classList.add('live'); if (window.startPetals) window.startPetals(); });
    }, 2400);
  }
  gate.addEventListener('click', open);
  gate.addEventListener('keydown', function(e){ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
})();

/* ---------- Mapbox map: main pin, extra places, road routes from nearby cities, satellite view ---------- */
window.addEventListener('load', function(){
  var el = document.getElementById('map'), chips = document.getElementById('routes');
  var V = CFG.venue || {}, M = V.main || {};
  var VENUE = [M.lng, M.lat];
  var gdir = function(){ return INV.gdir(M.lat, M.lng); };
  var PIN_COLOR = (CFG.theme && CFG.theme.main) || '#a0105a';
  /* everything that gets a route to the main pin: cities + extra places */
  var CITIES = (V.cities || []).map(function(c){ return {name:c.name, at:[c.lng, c.lat], color:c.color || PIN_COLOR, side:c.labelSide || 'top'}; })
    .concat((V.places || []).map(function(p, i){ return {name:'place' + i, at:[p.lng, p.lat], color:p.color || PIN_COLOR, place:p}; }));
  if (!window.mapboxgl || !/^pk\./.test(MAPBOX_TOKEN)) {
    var fb = document.createElement('div'); fb.className = 'map-fallback';
    fb.innerHTML = '<span>The map needs a Mapbox token to load.</span><a class="btn" href="' + INV.venueLink + '" target="_blank" rel="noopener">Open in Google Maps</a>';
    el.appendChild(fb); el.querySelector('.map-toggle').style.display = 'none';
    return;
  }
  mapboxgl.accessToken = MAPBOX_TOKEN;
  var STYLES = {streets:'mapbox://styles/mapbox/streets-v12', satellite:'mapbox://styles/mapbox/satellite-streets-v12'};
  var map = new mapboxgl.Map({container:el, style:STYLES.streets, center:VENUE, zoom:8, cooperativeGestures:true});
  map.addControl(new mapboxgl.NavigationControl({showCompass:false}), 'top-right');
  map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

  /* fetch real road routes (falls back to a straight line if a request fails) */
  var features = CITIES.map(function(c){
    return {type:'Feature', properties:{name:c.name, color:c.color}, geometry:{type:'LineString', coordinates:[c.at, VENUE]}};
  });
  var ready = Promise.all(CITIES.map(function(c, i){
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + c.at.join(',') + ';' + VENUE.join(',') +
              '?geometries=geojson&overview=full&access_token=' + MAPBOX_TOKEN;
    return fetch(url).then(function(r){ return r.json(); }).then(function(j){
      var rt = j.routes && j.routes[0]; if (!rt) return;
      features[i].geometry = rt.geometry;
      c.km = Math.round(rt.distance/1000);
      var m = Math.round(rt.duration/60); c.time = (m >= 60 ? Math.floor(m/60) + ' h ' : '') + (m%60) + ' min';
    }).catch(function(){});
  }));

  function bounds(list){
    var b = new mapboxgl.LngLatBounds(VENUE, VENUE);
    list.forEach(function(f){ f.geometry.coordinates.forEach(function(p){ b.extend(p); }); });
    return b;
  }
  var pad = function(){ return el.clientWidth < 600 ? 40 : 70; };

  /* layers have to be re-added whenever the style changes (map ⇄ satellite) */
  var dashStep = 0, dashSeq = [[0,4,3],[0.5,4,2.5],[1,4,2],[1.5,4,1.5],[2,4,1],[2.5,4,0.5],[3,4,0],[0,0.5,3,3.5],[0,1,3,3],[0,1.5,3,2.5],[0,2,3,2],[0,2.5,3,1.5],[0,3,3,1],[0,3.5,3,0.5]];
  function addLayers(){
    if (map.getSource('routes')) return;
    map.addSource('routes', {type:'geojson', data:{type:'FeatureCollection', features:features}});
    map.addLayer({id:'route-casing', type:'line', source:'routes', layout:{'line-join':'round','line-cap':'round'}, paint:{'line-color':'#ffffff','line-width':['interpolate',['linear'],['zoom'],6,5,12,10],'line-opacity':.9}});
    map.addLayer({id:'route-line', type:'line', source:'routes', layout:{'line-join':'round','line-cap':'round'}, paint:{'line-color':['get','color'],'line-width':['interpolate',['linear'],['zoom'],6,3,12,6]}});
    map.addLayer({id:'route-dash', type:'line', source:'routes', layout:{'line-join':'round','line-cap':'round'}, paint:{'line-color':'#fde68a','line-width':['interpolate',['linear'],['zoom'],6,1.5,12,3],'line-dasharray':dashSeq[0]}});
    if (active) highlight(active, false);
  }
  setInterval(function(){
    if (!map.getLayer('route-dash')) return;
    dashStep = (dashStep + 1) % dashSeq.length;
    map.setPaintProperty('route-dash', 'line-dasharray', dashSeq[dashStep]);
  }, 70);
  map.on('style.load', addLayers);

  /* pins: the main venue and any extra places share the same look */
  function pinSvg(color){ return '<svg viewBox="0 0 46 58" width="46" height="58"><circle class="ring" cx="23" cy="22" r="14" fill="none" stroke="#f59e0b" stroke-width="3"/><path d="M23 2C12 2 4 10 4 21c0 14 19 34 19 34s19-20 19-34C42 10 34 2 23 2z" fill="' + color + '" stroke="#fff" stroke-width="2.5"/><circle cx="23" cy="21" r="8" fill="#f8e0a8"/></svg>'; }
  function makePin(o, color, lngLat, dir){
    var p = document.createElement('div'); p.className = 'venue-pin';
    p.innerHTML = pinSvg(color) + '<div class="venue-tag" style="background:' + color + '">' + (o.label || '') + '<small></small></div>';
    var pop = new mapboxgl.Popup({offset:34, closeButton:false}).setHTML('<strong>' + (o.popupTitle || '') + '</strong>' + (o.popupText || '') + '<br><a href="' + dir + '" target="_blank" rel="noopener">Directions</a>');
    new mapboxgl.Marker({element:p, anchor:'bottom'}).setLngLat(lngLat).setPopup(pop).addTo(map);
    return p;
  }
  makePin(M, PIN_COLOR, VENUE, gdir());

  /* city labels + route chips */
  var active = null, chipEls = {}, tags = {};
  function highlight(name, fly){
    active = name;
    var on = name ? ['case',['==',['get','name'],name],1,.25] : 1;
    if (map.getLayer('route-line')) { map.setPaintProperty('route-line','line-opacity',on); map.setPaintProperty('route-dash','line-opacity',on); }
    Object.keys(chipEls).forEach(function(k){ chipEls[k].setAttribute('aria-pressed', String(k === (name || 'all'))); });
    Object.keys(tags).forEach(function(k){ tags[k].classList.toggle('dim', !!name && k !== name); });
    if (fly !== false) map.fitBounds(bounds(name ? features.filter(function(f){return f.properties.name === name}) : features), {padding:pad(), duration:1400});
  }
  function chip(key, label, color, extra){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'route-chip'; b.setAttribute('aria-pressed', key === 'all');
    if (color) b.style.setProperty('--c', color);
    b.innerHTML = '<span>' + label + '</span><b>' + (extra || '&nbsp;') + '</b>';
    b.addEventListener('click', function(){ highlight(key === 'all' ? null : key); });
    chips.appendChild(b); chipEls[key] = b;
  }
  CITIES.forEach(function(c){
    if (c.place){ tags[c.name] = makePin(c.place, c.color, c.at, INV.gdir(c.place.lat, c.place.lng)); return; }
    var left = c.side === 'left', below = c.side === 'below';
    var tag = document.createElement('div'); tag.className = 'rtag' + (left ? ' left' : '') + (below ? ' below' : ''); tag.style.setProperty('--c', c.color);
    tag.innerHTML = '<div class="pill"><span>' + c.name + '</span><small></small></div><div class="stem"></div><div class="dot"></div>';
    tag.title = 'Route from ' + c.name;
    tag.addEventListener('click', function(e){ e.stopPropagation(); highlight(c.name); });
    new mapboxgl.Marker({element:tag, anchor: left ? 'right' : (below ? 'top' : 'bottom'), offset: left ? [6,0] : (below ? [0,-6] : [0,6])}).setLngLat(c.at).addTo(map);
    tags[c.name] = tag;
  });

  ready.then(function(){
    chip('all', 'All routes', '#d99a2b', 'Overview');
    CITIES.forEach(function(c){
      var info = c.km ? c.km + ' km · ' + c.time : 'Route';
      chip(c.name, c.place ? (c.place.routeButton || 'Route') : 'From ' + c.name, c.color, info);
      if (c.km) tags[c.name].querySelector('small').textContent = c.km + ' km · ' + c.time;
    });
    var put = function(){ if (map.getSource('routes')) map.getSource('routes').setData({type:'FeatureCollection', features:features}); else addLayers(); map.fitBounds(bounds(features), {padding:pad(), duration:1600}); };
    if (map.isStyleLoaded()) put(); else map.once('load', put);
  });

  /* Map / Satellite toggle */
  el.querySelectorAll('.map-toggle button').forEach(function(b){
    b.addEventListener('click', function(){
      el.querySelectorAll('.map-toggle button').forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      map.setStyle(STYLES[b.dataset.style]);
    });
  });
});
