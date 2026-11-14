/* =====================================================================
   WEDDING INVITATION — EDIT EVERYTHING HERE
   ---------------------------------------------------------------------
   Change any text, date, time, link, contact or colour below, save the
   file and refresh the page. You never need to touch index.html,
   main.js or style.css.

   Tips
   • Keep the quotes '...' around every value. If your text has an
     apostrophe (groom's), use double quotes "..." instead.
   • Small HTML is allowed in texts: <br> for a new line, <sup>nd</sup>.
   • Dates are 'YYYY-MM-DD'. Times are 'YYYY-MM-DDTHH:MM' (24-hour).
     They are read in the timezone below (India = +05:30).
   • Map positions are lat / lng. In Google Maps, long-press a spot and
     copy the two numbers it shows (first = lat, second = lng).
   ===================================================================== */

window.INVITE = {

  /* ---------- 1. BASICS ---------- */
  names: { first: 'Rahul', second: 'Mamta', joiner: '&' },   // shown in this order
  pageTitle: 'Rahul & Mamta · Wedding Invitation',
  pageDescription: 'Rahul & Mamta are getting married. 23 – 25 November 2026, Satyam Garden, Kotputli, Rajasthan.',
  timezone: '+05:30',

  /* ---------- 2. COLOUR THEME ----------
     Just 3 colours. Every other shade on the page is mixed from these.
     Or use a ready-made theme by writing its name instead, e.g.
         theme: 'royalBlue',
     Themes (see the bottom of this file): raniPink, blushRose, maroon, wine,
     sindoorRed, marigold, haldi, peachCoral, terracotta, emerald,
     mehndiGreen, sage, teal, royalBlue, navyGold, royalPurple, lavender */
  theme: 'mehndiGreen',
  // {
  //   main:     '#a0105a',      // main colour: buttons, headings, names
  //   dark:     '#5c0733',      // dark backgrounds: envelope, countdown, footer
  //   gold:     '#d99a2b',      // gold details and ornaments
  //   pictures: 'saturate(1)'   // tint for the pink pictures. 'saturate(1)' = no change,
  //                             // 'hue-rotate(160deg)' = green, 'hue-rotate(-60deg)' = purple
  // },

  /* ---------- 3. PICTURES & MUSIC ---------- */
  images: {
    ganesh: 'ganesh.webp',
    couple: 'couple.webp',
    mirrorCouple: false,            // true = bride on the left
    gateBackground: 'gate-background.jpg',
    seal: 'wax-seal.png',
    pillarLeft: 'pillar-left.webp',
    pillarRight: 'pillar-right.webp'
  },
  music: { file: 'music.mp3', volume: 0.6 },

  /* ---------- 4. ENVELOPE (first screen) ---------- */
  envelope: {
    title: 'Wedding Invitation',
    cardKicker: 'You are invited',
    cardDates: '23 – 25 November 2026'
  },

  /* ---------- 5. FIRST PAGE ---------- */
  hero: {
    shloka: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
    blessing: 'With the blessings of our families',
    label: 'Wedding Invitation',
    date: '23rd – 25th November 2026',
    address: 'Satyam Garden, Kripa Ka Tibara<br>Kotputli, Rajasthan',
    leftPanel:  { kicker: 'Save the dates', big: '23<sup>rd</sup> – 25<sup>th</sup>', text: 'November 2026', small: 'Wedding on Wednesday, 25th' },
    rightPanel: { kicker: 'Wedding Venue', big: 'Kotputli', text: 'Satyam Garden', small: 'Kripa Ka Tibara' }
  },

  /* ---------- 6. STRIP UNDER THE FIRST PAGE ---------- */
  tagline: 'With the love and blessings of our families, we invite you to celebrate the wedding of Rahul & Mamta.',
  // icon can be: kalash, pin, diya, dholak, safa
  facts: [
    { icon: 'kalash', kicker: 'When', title: '23 – 25 November 2026', text: 'Wedding on Wednesday, 25 November' },
    { icon: 'pin', kicker: 'Where', title: 'Satyam Garden', text: 'Kripa Ka Tibara, Kotputli · <a href="#venue">See the map &amp; routes</a>' },
    { icon: 'diya', kicker: 'Celebrations begin', title: 'Lagan & Tikka', text: "Monday 23 November · Groom's residence, Bansur" }
  ],
  factsButton: 'See all the celebrations ↓',

  /* ---------- 7. EVENTS ---------- */
  eventsSection: {
    kicker: 'Manglik Karyakram',
    title: 'Three days of celebrations',
    text: 'Join us for our family traditions, music, rituals and wedding celebrations.',
    swipeHint: 'Swipe to see all celebrations →'
  },
  // Weekday, day and month are worked out from `date` automatically.
  events: [
    {
      date: '2026-11-23', color: 'saffron', icon: 'kalash',
      title: 'Lagan-Tikka, Chak Pujan, Bhat & Preetibhoj',
      subtitle: 'Manglik Karyakram',
      schedule: [
        ['Lagan-Tikka', '1:15 PM'],
        ['Chak Pujan', '3:15 PM'],
        ['Bhat', '4:15 PM'],
        ['Preetibhoj', '5:15 PM onwards']
      ],
      note: "The wedding celebrations begin with the traditional Lagan-Tikka, Chak Pujan, Bhat and Preetibhoj ceremonies.",
      mapLink: { text: "Groom's residence, Bansur · Google Maps ↗", url: 'https://maps.app.goo.gl/VX25hP4HGGRSGhYT8' },
      rsvpLabel: 'Lagan-Tikka & family ceremonies · Mon 23 Nov'
    },
    {
      date: '2026-11-24', color: 'green', icon: 'dholak',
      title: 'Haldi-Mehndi & Mahila Sangeet',
      subtitle: 'Rasmon aur sangeet ki shaam',
      schedule: [['Haldi-Mehndi', '10:15 AM'], ['Mahila Sangeet', '6:15 PM']],
      note: 'A day of colours, traditions, music and celebration.',
      mapLink: { text: "Groom's residence, Bansur · Google Maps ↗", url: 'https://maps.app.goo.gl/VX25hP4HGGRSGhYT8' },
      rsvpLabel: 'Haldi-Mehndi & Mahila Sangeet · Tue 24 Nov'
    },
    {
      date: '2026-11-25', color: 'teal', icon: 'safa',
      title: 'Nikasi & Barat Prasthan',
      subtitle: 'Shubh Vivah',
      schedule: [['Nikasi (निकासी)', '3:15 PM'], ['Barat Prasthan', '4:15 PM']],
      note: "The baraat will depart from the groom's residence in Bansur via Kripa Ka Tibara towards Satyam Garden, Kotputli.",
      mapLink: { text: 'Satyam Garden, Kotputli · Google Maps ↗', url: 'https://maps.app.goo.gl/nxTo5xjsZUNKtq7x6' },
      rsvpLabel: 'Nikasi & Barat Prasthan · Wed 25 Nov'
    }
  ],

  /* ---------- 8. COUNTDOWN ---------- */
  countdown: {
    target: '2026-11-25T16:15',
    kicker: 'Counting the days',
    title: 'The wedding celebrations are here',
    when: 'Wednesday, 25 November 2026 · 4:15 PM',
    until: 'until the baraat departs',
    todayNote: 'Today is the day!',
    started: 'The celebrations are underway. Join us!'
  },

  /* ---------- 9. VENUE & MAP ---------- */
  venue: {
    kicker: 'Padharo sa',
    title: 'Finding your way to us',
    text: "The wedding venue is Satyam Garden at Kripa Ka Tibara, Kotputli. The baraat will depart from the groom's residence in Bansur on 25 November. Both locations are marked on the map.",
    address: 'Satyam Garden, Kripa Ka Tibara, Kotputli, Rajasthan',
    calendarLocation: 'Satyam Garden, Kripa Ka Tibara, Kotputli, Rajasthan, India',
    mapsLink: 'https://maps.app.goo.gl/nxTo5xjsZUNKtq7x6',
    mapboxToken: 'pk.eyJ1IjoiaHJpdGVzaC1zYWluaSIsImEiOiJjbXZ4Z2Z0bncwZmV2NGRzOTh1MzkwMXh6In0.wic7uCrsrA5tnJ4Jl0PqRA',

    // Main wedding venue: Satyam Garden, Kotputli (from the supplied map link)
    main: { lat: 27.7091998, lng: 76.1760362,
            label: '♥ Wedding Venue · Satyam Garden',
            popupTitle: 'Rahul & Mamta', popupText: 'Satyam Garden, Kripa Ka Tibara, Kotputli' },

    // Groom's residence in Bansur
    places: [
      { lat: 27.6864107, lng: 76.3566716, color: '#e91e63',
        label: "♥ Groom's Home · Bansur",
        popupTitle: "Groom's Residence", popupText: 'Bansur<br>Lagan-Tikka · 23 Nov; Barat Prasthan · 25 Nov',
        routeButton: 'Bansur → Satyam Garden, Kotputli' }
    ],

    cities: [
      { name: 'Delhi',    lat: 28.6139, lng: 77.2090, color: '#a0105a', labelSide: 'top' },
      { name: 'Jaipur',   lat: 26.9124, lng: 75.7873, color: '#d97706', labelSide: 'top' },
      { name: 'Alwar',    lat: 27.5530, lng: 76.6346, color: '#2f7d32', labelSide: 'below' },
      { name: 'Rewari',   lat: 28.1970, lng: 76.6170, color: '#0e7490', labelSide: 'top' },
      { name: 'Bansur',   lat: 27.6864107, lng: 76.3566716, color: '#7c3aed', labelSide: 'below' }
    ],

    buttons: [
      { text: 'Directions to Satyam Garden, Kotputli', url: '', style: 'solid' },
      { text: "Directions to Groom's Home, Bansur", url: 'https://www.google.com/maps/dir/?api=1&destination=27.6864107,76.3566716', style: 'outline' }
    ]
  },

  /* ---------- 10. RSVP ---------- */
  rsvp: {
    kicker: 'Kindly respond',
    title: 'Will you be there?',
    text: 'A little heads-up from you helps us make all the arrangements just right.',
    cardTitle: 'Your reply',
    nameLabel: 'Your name',
    guestsLabel: 'Number of guests (including you)',
    eventsLabel: 'Which celebrations will you attend?',
    button: 'Send on WhatsApp',
    whatsapp: '+91 9460600366',                       // replies go to this number
    messageTitle: "RSVP for Rahul & Mamta's wedding"
  },

  /* ---------- 11. FOOTER & CONTACTS ---------- */
  footer: {
    title: 'With love, Rahul & Mamta',
    text: "It wouldn't be the same without you. We look forward to celebrating with you!",
    when: '23 – 25 November 2026 · Satyam Garden, Kotputli',
    contactTitle: 'Address & contacts',
    address: 'Wedding venue: Satyam Garden<br>Kripa Ka Tibara, Kotputli, Rajasthan<br>Groom’s residence: Holi Ka Tiba, Bansur',
    contacts: [
      { name: 'Dr. Babulal Saini', role: 'Contact', phone: '+91 9460600366' },
      { name: 'Kailashchand Saini', role: 'Contact', phone: '+91 9829688302' },
      { name: 'Family Contact', role: 'Contact', phone: '+91 9229292911' }
    ],
    backToTop: 'Back to top ↑'
  },

  /* ---------- 12. BOTTOM BAR (phones) ---------- */
  nav: { events: 'Events', map: 'Map', rsvp: 'RSVP', help: 'Need Help?' }
};

/* ---------- ready-made themes ----------
   Use one by writing its name in section 2, e.g.  theme: 'royalBlue',
   main = buttons & headings · dark = dark backgrounds · gold = details
   pictures = tint so the (pink) pictures match the theme              */
window.THEMES = {
  // pinks & reds
  raniPink:    { main: '#a0105a', dark: '#5c0733', gold: '#d99a2b', pictures: 'saturate(1)' },
  blushRose:   { main: '#c2627a', dark: '#6e2f40', gold: '#d4a76a', pictures: 'saturate(.65) brightness(1.08)' },
  maroon:      { main: '#8b0f14', dark: '#5a0a0e', gold: '#d99a2b', pictures: 'hue-rotate(25deg)' },
  wine:        { main: '#6d1a36', dark: '#3a0c1c', gold: '#c9a227', pictures: 'hue-rotate(12deg) saturate(.8) brightness(.95)' },
  sindoorRed:  { main: '#c0161d', dark: '#640a0e', gold: '#e0a526', pictures: 'hue-rotate(32deg) saturate(1.1)' },

  // warm
  marigold:    { main: '#c2560c', dark: '#6b2a05', gold: '#e0a526', pictures: 'hue-rotate(55deg)' },
  haldi:       { main: '#a87a05', dark: '#5a3f03', gold: '#d9562a', pictures: 'hue-rotate(75deg) saturate(.9)' },
  peachCoral:  { main: '#d4605a', dark: '#7a2e2a', gold: '#d9a25b', pictures: 'hue-rotate(22deg) saturate(.75) brightness(1.05)' },
  terracotta:  { main: '#a0522d', dark: '#4e2414', gold: '#d4a017', pictures: 'hue-rotate(45deg) saturate(.65)' },

  // greens & blues
  emerald:     { main: '#0f6b4f', dark: '#073b2c', gold: '#d4a017', pictures: 'hue-rotate(160deg) saturate(.8)' },
  mehndiGreen: { main: '#5a7d1a', dark: '#2c3e0b', gold: '#d4a017', pictures: 'hue-rotate(120deg) saturate(.7)' },
  sage:        { main: '#4f7d5c', dark: '#26402e', gold: '#c9a227', pictures: 'hue-rotate(150deg) saturate(.45)' },
  teal:        { main: '#0f7c7a', dark: '#06403f', gold: '#d4a017', pictures: 'hue-rotate(-155deg) saturate(.85)' },
  royalBlue:   { main: '#1f3f8f', dark: '#0d1f4d', gold: '#d4a017', pictures: 'hue-rotate(-128deg) saturate(.9)' },
  navyGold:    { main: '#1c2b4a', dark: '#0b1426', gold: '#c9a227', pictures: 'hue-rotate(-120deg) saturate(.45)' },

  // purples
  royalPurple: { main: '#5b2a86', dark: '#2e1347', gold: '#d4a017', pictures: 'hue-rotate(-72deg)' },
  lavender:    { main: '#7e5aa6', dark: '#3d2a57', gold: '#c9a227', pictures: 'hue-rotate(-68deg) saturate(.6) brightness(1.08)' }
};