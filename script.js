/* ============================================================
   EDIT EVERYTHING HERE — date/time, venue, program, phone
   ============================================================ */
const CONFIG = {
  title: "Bhandara (Maha Prasad)",
  // India time (+05:30). Format: YYYY-MM-DDTHH:MM:SS+05:30   (SAMPLE time — change to the real one)
  start: "2026-11-29T12:00:00+05:30",
  end:   "2026-11-29T17:00:00+05:30",

  mapQuery: "Saiganj, Bharwari, Kaushambi, Uttar Pradesh 212201",
  mapLink:  "https://maps.app.goo.gl/A7dbLdtiYjcigoPo9",

  phone: "919769911052",          // used for Call + WhatsApp buttons
  phone2: "919793181562",         // second Call button
  whatsapp: true,                  // false hides the WhatsApp button

  // SAMPLE program — change to the real schedule
  icons: ["🙏", "🪔", "🍛", "🤝"],
  timeline: [
    { t: "29 Nov · 11:00 AM", th: "29 नवं · प्रातः 11:00 बजे",  h: "Pooja & Aarti", hh: "पूजा एवं आरती",   d: "Begins with prayers and aarti",         dh: "प्रार्थना और आरती से शुभारंभ" },
    { t: "29 Nov · 12:00 PM", th: "29 नवं · दोपहर 12:00 बजे", h: "Maha Prasad",   hh: "महाप्रसाद",       d: "Bhandara prasad is served to all",      dh: "सभी के लिए भंडारा प्रसाद" },
    { t: "29 Nov · 3:00 PM",  th: "29 नवं · दोपहर 3:00 बजे",  h: "Closing Aarti", hh: "समापन आरती",      d: "Blessings and thanks to all devotees",  dh: "सभी श्रद्धालुओं को आशीर्वाद एवं धन्यवाद" }
  ]
};

/* ============================================================ */
const $ = s => document.querySelector(s);
const enc = encodeURIComponent;
var LANG = "en";

/* ---------- map + links ---------- */
$("#mapFrame").src = `https://www.google.com/maps?q=${enc(CONFIG.mapQuery)}&z=15&output=embed`;
$("#dirBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${enc(CONFIG.mapQuery)}&travelmode=driving`;
$("#mapBtn").href = CONFIG.mapLink;
$("#call").href = "tel:+" + CONFIG.phone;
$("#call2").href = "tel:+" + CONFIG.phone2;
if (CONFIG.whatsapp) {
  const w = $("#wa"); w.hidden = false;
  w.href = `https://wa.me/${CONFIG.phone}?text=${enc("Jai Siya Ram! We will attend the Bhandara on 29th November 2026. 🙏")}`;
}

/* ---------- program ---------- */
function renderTL(lang, instant) {
  const hi = lang === "hi";
  $("#timeline").innerHTML = CONFIG.timeline.map((e, i) =>
    `<div class="pcard rv${instant ? " in" : ""}"><span class="ic">${CONFIG.icons[i] || "✦"}</span>
      <div><span class="when">${hi ? e.th : e.t}</span><h4>${hi ? e.hh : e.h}</h4><p>${hi ? e.dh : e.d}</p></div></div>`).join("");
}
renderTL("en", false);

/* ---------- calendar ---------- */
const fmt = d => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, "");
const details = `Bhandara (Maha Prasad) organised by Siyaram Chaurasiya, Sachin Chaurasiya & Guru Prasad Chaurasiya. Call 9769911052 / 9793181562.\nVenue: ${CONFIG.mapQuery}`;
$("#gcal").href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${enc(CONFIG.title)}&dates=${fmt(CONFIG.start)}/${fmt(CONFIG.end)}&details=${enc(details)}&location=${enc(CONFIG.mapQuery)}`;
const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bhandara//EN", "BEGIN:VEVENT",
  `UID:bhandara-${fmt(CONFIG.start)}@invite`, `DTSTAMP:${fmt(new Date())}`,
  `DTSTART:${fmt(CONFIG.start)}`, `DTEND:${fmt(CONFIG.end)}`,
  `SUMMARY:${CONFIG.title}`, `LOCATION:${CONFIG.mapQuery}`,
  "DESCRIPTION:Bhandara - organised by Chaurasiya family. Call 9769911052 / 9793181562", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
$("#ics").href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));

/* ---------- share ---------- */
$("#share").addEventListener("click", async () => {
  const data = { title: "Bhandara Invitation", text: "You're invited to the Bhandara on 29th Nov 2026 🪔", url: location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(location.href); $("#share").textContent = LANG === "hi" ? "लिंक कॉपी हुआ ✓" : "Link copied ✓"; }
  } catch (e) {}
});

/* ---------- countdown rings ---------- */
const target = new Date(CONFIG.start).getTime(), C = 2 * Math.PI * 34;
const pad = n => String(n).padStart(2, "0");
function setRing(ringId, numId, val, max) {
  const n = $(numId), t = pad(val);
  if (n.textContent !== t) n.textContent = t;
  $(ringId).style.strokeDashoffset = C * (1 - Math.min(val, max) / max);
}
function tick() {
  const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  setRing("#rd", "#cd", Math.floor(s / 86400), 30);
  setRing("#rh", "#ch", Math.floor(s % 86400 / 3600), 24);
  setRing("#rm", "#cm", Math.floor(s % 3600 / 60), 60);
  setRing("#rs", "#cs", s % 60, 60);
}
tick(); setInterval(tick, 1000);

/* ---------- string lights ---------- */
(function () {
  const box = $("#lights"), cols = ["#ffb347", "#ff6a3d", "#ffe08a", "#ff9a2e"], n = 16;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span"), p = i / (n - 1);
    const sag = Math.sin(p * Math.PI * 3) * 9;
    s.style.cssText = `left:${p * 96 + 2}%;top:${14 + sag + 10}px;--c:${cols[i % 4]};--h:${14 + sag}px;animation-delay:${(i % 5) * .45}s`;
    box.appendChild(s);
  }
})();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll(".rv").forEach(el => { if (!el.closest(".hero")) io.observe(el); });
function revealHero() {
  document.querySelectorAll(".hero .rv").forEach((el, i) => setTimeout(() => el.classList.add("in"), 150 + i * 220));
}

/* ---------- intro: light the diya ---------- */
for (let i = 0; i < 28; i++) {
  const s = document.createElement("i"); s.className = "tw";
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 2.6}s`;
  $("#intro").appendChild(s);
}
let lit = false;
function lightDiya() {
  if (lit) return; lit = true;
  const intro = $("#intro");
  intro.classList.add("lit");
  setTimeout(() => { intro.classList.add("exit"); boost(); }, 1500);
  setTimeout(() => { document.body.classList.remove("locked"); revealHero(); }, 2500);
  setTimeout(() => intro.classList.add("done"), 3800);
}
$("#diyaBtn").addEventListener("click", lightDiya);
$("#intro").addEventListener("click", lightDiya);

/* ---------- embers ---------- */
const ec = $("#embers"), ex = ec.getContext("2d");
let E = [], W, H, extra = 0;
function size() { W = ec.width = innerWidth; H = ec.height = innerHeight; }
addEventListener("resize", size); size();
function ember(burst) {
  return { x: Math.random() * W, y: burst ? H * (.4 + Math.random() * .6) : H + 10, r: 1 + Math.random() * 2.6,
    vy: .5 + Math.random() * 1.5, vx: (Math.random() - .5) * .5, ph: Math.random() * 6, life: 1,
    c: Math.random() < .5 ? "255,170,60" : (Math.random() < .5 ? "255,120,40" : "255,214,130") };
}
function boost() { extra = 60; }
function loop() {
  ex.clearRect(0, 0, W, H);
  ex.globalCompositeOperation = "lighter";
  if (E.length < 38 && Math.random() < .25) E.push(ember(false));
  if (extra > 0) { E.push(ember(true), ember(true)); extra--; }
  E = E.filter(p => p.y > -10 && p.life > 0);
  for (const p of E) {
    p.y -= p.vy; p.ph += .05; p.x += p.vx + Math.sin(p.ph) * .4; p.life -= .0022;
    const a = Math.max(0, p.life) * (.55 + .45 * Math.sin(p.ph * 3));
    const g = ex.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
    g.addColorStop(0, `rgba(${p.c},${a})`); g.addColorStop(1, `rgba(${p.c},0)`);
    ex.fillStyle = g; ex.beginPath(); ex.arc(p.x, p.y, p.r * 4, 0, 7); ex.fill();
  }
  requestAnimationFrame(loop);
}
loop();

/* ---------- scroll progress ---------- */
const bar = $("#progress");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
}, { passive: true });

/* ---------- language (English / हिन्दी) ---------- */
const HI = {
  tap: "दीपक जलाने के लिए छुएँ",
  jai: "॥ जय सियाराम ॥", jai2: "॥ सादर आमंत्रण ॥",
  bhsub: "महाप्रसाद", inv: "आप सादर आमंत्रित हैं",
  day: "रविवार", my: "नवंबर · 2026",
  where: "सैगंज, भरवारी, कौशाम्बी",
  gcal: "📅&nbsp; तारीख सहेजें", ics: "कैलेंडर में जोड़ें (.ics)",
  mt: "निमंत्रण",
  m1: "परमात्मा के आशीर्वाद से, हम आपको एवं आपके परिवार को पावन <em>भंडारा</em> (महाप्रसाद) में सादर आमंत्रित करते हैं।",
  m2: "पधारिए, प्रसाद ग्रहण कीजिए और हमारे साथ आशीर्वाद लीजिए। आपकी उपस्थिति से यह पावन सेवा पूर्ण होगी।",
  cdt: "भंडारे की उल्टी गिनती", days: "दिन", hours: "घंटे", mins: "मिनट", secs: "सेकंड",
  prog: "कार्यक्रम", venue: "स्थान",
  vname: "सैगंज, भरवारी", vaddr: "कौशाम्बी<br>उत्तर प्रदेश – 212201, भारत",
  vdate: "रविवार, 29 नवंबर 2026",
  dir: "➤&nbsp; रास्ता देखें", mapb: "गूगल मैप में खोलें",
  tip: "सुझाव: “रास्ता देखें” दबाएँ, गूगल मैप आपकी वर्तमान जगह से मार्ग बताएगा।",
  orgT: "आयोजक", o1: "सियाराम चौरसिया", o2: "सचिन चौरसिया", o3: "गुरु प्रसाद चौरसिया",
  orgNote: "अधिक जानकारी के लिए कॉल करें",
  call: "📞&nbsp; कॉल करें 97699 11052", call2: "📞&nbsp; कॉल करें 97931 81562", wa: "💬&nbsp; व्हाट्सऐप पर पुष्टि करें", share: "निमंत्रण साझा करें",
  foot: "भंडारा · 29.11.2026",
  credit: "विकसित एवं संचालित: <b>विपिन सी</b>"
};
function applyLang(l) {
  LANG = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    const k = el.dataset.i18n;
    el.innerHTML = l === "hi" && HI[k] !== undefined ? HI[k] : el.dataset.en;
  });
  renderTL(l, true);
  document.querySelectorAll(".lang button").forEach(b => b.classList.toggle("on", b.dataset.l === l));
  document.title = l === "hi" ? "भंडारा निमंत्रण · 29 नवंबर 2026" : "Bhandara Invitation · 29 November 2026";
  try { localStorage.setItem("lang", l); } catch (e) {}
}
document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.l)));
try { if (localStorage.getItem("lang") === "hi") applyLang("hi"); } catch (e) {}
