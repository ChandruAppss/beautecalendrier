// Generates the illustrated Christmas banner (images/christmas-gifts.webp) for BeautéCalendrier.
// Product images now come from real photos (tools/build-photos.py); the earlier product
// illustrations are kept below for reference but are not rendered.
// Usage: node tools/build-images.mjs   (requires Google Chrome + Python with Pillow)
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TMP = join(ROOT, "tools", ".render");
const OUT = join(ROOT, "images");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
mkdirSync(TMP, { recursive: true });
mkdirSync(OUT, { recursive: true });

/* ---------- shared paint ---------- */
const goldStops = `<stop offset="0" stop-color="#94651b"/><stop offset=".2" stop-color="#e2bb63"/><stop offset=".42" stop-color="#fff1c6"/><stop offset=".62" stop-color="#d9a441"/><stop offset="1" stop-color="#7f5414"/>`;
const goldH = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">${goldStops}</linearGradient>`;
const goldV = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${goldStops}</linearGradient>`;
const goldText = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b98428"/><stop offset=".45" stop-color="#f3d58a"/><stop offset=".7" stop-color="#c8902f"/><stop offset="1" stop-color="#a87422"/></linearGradient>`;
const cyl = (id, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c[0]}"/><stop offset=".32" stop-color="${c[2]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient>`;
const blur = (id, s) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${s}"/></filter>`;
const ground = (p, rx = 90) => `<ellipse cx="300" cy="574" rx="${rx}" ry="12" fill="#6b2a35" opacity=".22" filter="url(#${p}b)"/>`;
const star = (x, y, s, fill, op = 1) =>
  `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${fill}" opacity="${op}"/>`;
const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "Montserrat, Arial, sans-serif";

/* ---------- products (600x600, transparent) ---------- */
function lipstick(p, c = ["#55081f", "#a3163d", "#d8476e"]) {
  return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs>${goldH(p + "g")}${cyl(p + "c", c)}${blur(p + "b", 7)}</defs>
  ${ground(p, 80)}
  <rect x="238" y="335" width="124" height="236" rx="8" fill="url(#${p}g)"/>
  <rect x="238" y="452" width="124" height="3" fill="#fff" opacity=".35"/>
  <rect x="232" y="322" width="136" height="22" rx="4" fill="url(#${p}g)"/>
  <rect x="250" y="216" width="100" height="110" rx="4" fill="url(#${p}g)"/>
  <path d="M260 220L260 122Q260 104 273 95L330 52Q341 44 341 58L341 220Z" fill="url(#${p}c)"/>
  <path d="M271 220L271 116L283 106L283 220Z" fill="#fff" opacity=".2"/></svg>`;
}
function mascara(p) {
  return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs>${goldH(p + "g")}${cyl(p + "c", ["#050505", "#1c1c1c", "#4a4a4a"])}${blur(p + "b", 7)}</defs>
  ${ground(p, 70)}
  <rect x="258" y="96" width="84" height="474" rx="16" fill="url(#${p}c)"/>
  <rect x="258" y="226" width="84" height="13" fill="url(#${p}g)"/>
  <rect x="258" y="239" width="84" height="4" fill="#000" opacity=".5"/>
  <rect x="270" y="110" width="7" height="450" rx="3" fill="#fff" opacity=".14"/>
  <g transform="translate(300 420) rotate(-90)" font-family="${SERIF}" fill="url(#${p}g)" text-anchor="middle">
    <text x="0" y="-2" font-size="26" letter-spacing="8">VOLUME</text>
    <text x="0" y="22" font-size="11" letter-spacing="5" font-family="${SANS}">MASCARA NOIR</text></g></svg>`;
}
function jar(p, lid = ["#d9718f", "#f2b3c5", "#fbd9e2"], name = "Crème Rosée", sub = "SOIN HYDRATANT · 50 ML") {
  return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs>${goldH(p + "g")}${cyl(p + "l", lid)}${cyl(p + "j", ["#ddd3d3", "#fbf8f7", "#ffffff"])}${blur(p + "b", 9)}</defs>
  ${ground(p, 165)}
  <rect x="163" y="360" width="274" height="210" rx="30" fill="url(#${p}j)"/>
  <rect x="182" y="380" width="14" height="170" rx="7" fill="#fff" opacity=".8"/>
  <rect x="148" y="250" width="304" height="118" rx="22" fill="url(#${p}l)"/>
  <rect x="160" y="256" width="280" height="14" rx="7" fill="#fff" opacity=".35"/>
  <rect x="160" y="366" width="280" height="7" fill="url(#${p}g)"/>
  <text x="300" y="462" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="36" fill="#9c1442">${name}</text>
  <text x="300" y="498" text-anchor="middle" font-family="${SANS}" font-size="12" letter-spacing="3" fill="#8b6c62">${sub}</text></svg>`;
}
function tube(p) {
  const ridges = Array.from({ length: 16 }, (_, i) => `<rect x="${216 + i * 10.5}" y="54" width="2" height="26" fill="#c77d93" opacity=".5"/>`).join("");
  return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs>${goldH(p + "g")}${cyl(p + "c", ["#d7849b", "#f2bccb", "#fbe0e7"])}${blur(p + "b", 7)}</defs>
  ${ground(p, 75)}
  <path d="M214 74L386 74L373 458Q300 472 227 458Z" fill="url(#${p}c)"/>
  <rect x="208" y="50" width="184" height="32" rx="5" fill="#eeb3c3"/>${ridges}
  <rect x="246" y="455" width="108" height="116" rx="10" fill="url(#${p}g)"/>
  <rect x="246" y="472" width="108" height="3" fill="#7f5414" opacity=".35"/>
  <text x="300" y="240" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="44" fill="#8c1240">Élixir</text>
  <text x="300" y="276" text-anchor="middle" font-family="${SANS}" font-size="12" letter-spacing="3" fill="#8c4a5c">SOIN CAPILLAIRE</text>
  <path d="M250 304Q275 290 300 304T350 304" stroke="url(#${p}g)" stroke-width="3" fill="none"/>
  <rect x="230" y="90" width="12" height="350" rx="6" fill="#fff" opacity=".35"/></svg>`;
}
function oil(p) {
  return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs>${goldH(p + "g")}${cyl(p + "a", ["#a35d08", "#e39a22", "#ffd98a"])}${blur(p + "b", 7)}</defs>
  ${ground(p, 95)}
  <rect x="218" y="236" width="164" height="335" rx="26" fill="url(#${p}a)"/>
  <rect x="232" y="252" width="13" height="300" rx="6" fill="#fff" opacity=".4"/>
  <rect x="272" y="200" width="56" height="42" fill="url(#${p}g)"/>
  <rect x="262" y="70" width="76" height="138" rx="12" fill="url(#${p}g)"/>
  ${[95, 120, 145, 170].map((y) => `<rect x="262" y="${y}" width="76" height="2" fill="#7f5414" opacity=".3"/>`).join("")}
  <rect x="244" y="330" width="112" height="152" rx="6" fill="#fff7e6" opacity=".92" stroke="#c8902f" stroke-width="2"/>
  <text x="300" y="392" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="27" fill="#7a4a0c">Sérum</text>
  <text x="300" y="424" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="27" fill="#7a4a0c">Éclat</text>
  <text x="300" y="458" text-anchor="middle" font-family="${SANS}" font-size="9" letter-spacing="2.5" fill="#9b6b2a">SOIN DU TEINT</text></svg>`;
}
function nail(p, c = ["#8e0b3f", "#c2185b", "#ef5f97"], name = "Framboise") {
  return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"><defs>${goldH(p + "g")}${cyl(p + "c", c)}${blur(p + "b", 7)}</defs>
  ${ground(p, 105)}
  <rect x="200" y="332" width="200" height="238" rx="46" fill="url(#${p}c)"/>
  <rect x="200" y="332" width="200" height="238" rx="46" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="6"/>
  <rect x="222" y="352" width="17" height="196" rx="8" fill="#fff" opacity=".32"/>
  <rect x="262" y="312" width="76" height="26" fill="${c[0]}"/>
  <rect x="258" y="78" width="84" height="240" rx="12" fill="url(#${p}g)"/>
  <rect x="270" y="90" width="8" height="216" rx="4" fill="#fff" opacity=".35"/>
  <text x="300" y="468" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="32" fill="#fff" opacity=".9">${name}</text></svg>`;
}
function bauble(p, r = 60, hue = "gold") {
  const stops = hue === "gold"
    ? `<stop offset="0" stop-color="#fff4cf"/><stop offset=".35" stop-color="#e6bd68"/><stop offset=".8" stop-color="#a87422"/><stop offset="1" stop-color="#6e4710"/>`
    : `<stop offset="0" stop-color="#ffe1ea"/><stop offset=".35" stop-color="#ef8fae"/><stop offset=".8" stop-color="#b8285c"/><stop offset="1" stop-color="#7d0f39"/>`;
  return `<svg viewBox="0 0 ${r * 2 + 20} ${r * 2 + 40}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="${p}r" cx=".35" cy=".35" r=".75">${stops}</radialGradient>${goldH(p + "g")}</defs>
  <rect x="${r + 10 - 9}" y="8" width="18" height="16" rx="3" fill="url(#${p}g)"/>
  <circle cx="${r + 10}" cy="${r + 26}" r="${r}" fill="url(#${p}r)"/>
  <ellipse cx="${r * 0.7 + 10}" cy="${r * 0.65 + 26}" rx="${r * 0.22}" ry="${r * 0.13}" fill="#fff" opacity=".6" transform="rotate(-35 ${r * 0.7 + 10} ${r * 0.65 + 26})"/></svg>`;
}
function rose(p, s = 1, c = ["#fde3ea", "#f4a8bd", "#e07b98"]) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => `<ellipse cx="0" cy="-34" rx="30" ry="36" transform="rotate(${a})" fill="url(#${p}p)" stroke="${c[2]}" stroke-opacity=".35"/>`).join("");
  const inner = [20, 110, 200, 290]
    .map((a) => `<ellipse cx="0" cy="-16" rx="20" ry="22" transform="rotate(${a})" fill="url(#${p}p)" stroke="${c[2]}" stroke-opacity=".45"/>`).join("");
  return `<g transform="scale(${s})"><defs><radialGradient id="${p}p" cx=".5" cy=".7" r=".8"><stop offset="0" stop-color="${c[0]}"/><stop offset=".6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient></defs>
  ${petals}${inner}<path d="M-8 2Q0 -14 10 -2Q4 10 -6 6Q-10 -4 2 -6" fill="none" stroke="${c[2]}" stroke-width="2.5"/></g>`;
}

/* ---------- advent calendar box (900x780, transparent) ---------- */
function calendarBox(p) {
  const windows = (x, y, w, h) => {
    let s = "";
    for (let yy = y + 14; yy < y + h - 18; yy += 26) for (let xx = x + 10; xx < x + w - 14; xx += 18) s += `<rect x="${xx}" y="${yy}" width="8" height="13" rx="4" fill="none" stroke="url(#${p}g)" stroke-width="1.3"/>`;
    return s;
  };
  const building = (x, y, w, roof = "mansard") => {
    const h = 718 - y;
    const top = roof === "dome"
      ? `<path d="M${x + 6} ${y}Q${x + w / 2} ${y - w * 0.85} ${x + w - 6} ${y}Z" fill="url(#${p}g)" fill-opacity=".22" stroke="url(#${p}g)" stroke-width="2"/><path d="M${x + w / 2} ${y - w * 0.62}V${y - w * 0.95}" stroke="url(#${p}g)" stroke-width="2"/>${star(x + w / 2, y - w * 0.98, 6, `url(#${p}g)`)}`
      : `<path d="M${x} ${y}L${x + 10} ${y - 16}L${x + w - 10} ${y - 16}L${x + w} ${y}Z" fill="url(#${p}g)" fill-opacity=".22" stroke="url(#${p}g)" stroke-width="2"/>`;
    return `${top}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${p}g)" fill-opacity=".14" stroke="url(#${p}g)" stroke-width="2"/>${windows(x, y, w, h)}`;
  };
  const sparkles = [[140, 300, 9], [660, 280, 11], [600, 210, 6], [190, 220, 6], [560, 420, 7], [235, 430, 8], [690, 470, 6], [120, 500, 7]]
    .map(([x, y, s]) => star(x, y, s, `url(#${p}g)`)).join("");
  return `<svg viewBox="0 0 900 780" xmlns="http://www.w3.org/2000/svg"><defs>${goldH(p + "g")}${goldV(p + "gv")}${goldText(p + "t")}${blur(p + "b", 38)}${blur(p + "s", 16)}
    <linearGradient id="${p}f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde6ec"/><stop offset=".5" stop-color="#fbd2dd"/><stop offset="1" stop-color="#f6b5c8"/></linearGradient>
    <linearGradient id="${p}side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e98aa8"/><stop offset="1" stop-color="#cf5e86"/></linearGradient>
    <linearGradient id="${p}top" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fde8ee"/><stop offset="1" stop-color="#f7c3d2"/></linearGradient>
    <clipPath id="${p}fc"><rect x="60" y="140" width="670" height="600"/></clipPath>
    <clipPath id="${p}sc"><path d="M730 140L860 60L860 640L730 740Z"/></clipPath></defs>
  <ellipse cx="460" cy="742" rx="430" ry="26" fill="#7a2b3e" opacity=".3" filter="url(#${p}s)"/>
  <path d="M60 140L190 60L860 60L730 140Z" fill="url(#${p}top)"/>
  <path d="M730 140L860 60L860 640L730 740Z" fill="url(#${p}side)"/>
  <g clip-path="url(#${p}sc)"><circle cx="860" cy="120" r="90" fill="#c2185b" opacity=".55" filter="url(#${p}b)"/><circle cx="740" cy="700" r="90" fill="#b3134f" opacity=".5" filter="url(#${p}b)"/>
    ${[160, 260, 360, 460, 560].map((y) => `<path d="M738 ${y + 20}L852 ${y - 50}" stroke="url(#${p}g)" stroke-opacity=".45" stroke-width="1.5"/>`).join("")}</g>
  <rect x="60" y="140" width="670" height="600" fill="url(#${p}f)"/>
  <g clip-path="url(#${p}fc)">
    <circle cx="70" cy="150" r="130" fill="#e2457c" opacity=".55" filter="url(#${p}b)"/>
    <circle cx="720" cy="170" r="120" fill="#e2457c" opacity=".45" filter="url(#${p}b)"/>
    <circle cx="90" cy="730" r="140" fill="#d8336f" opacity=".55" filter="url(#${p}b)"/>
    <circle cx="720" cy="730" r="150" fill="#d8336f" opacity=".5" filter="url(#${p}b)"/>
    <circle cx="395" cy="320" r="170" fill="#fff6f4" opacity=".7" filter="url(#${p}b)"/>
    <line x1="395" y1="162" x2="395" y2="718" stroke="url(#${p}gv)" stroke-opacity=".35" stroke-width="1.5"/>
    ${building(92, 600, 70)}${building(166, 568, 84, "dome")}${building(254, 620, 74)}
    ${building(462, 618, 72)}${building(538, 566, 90, "dome")}${building(632, 598, 74)}
    <path d="M395 446L398 485L403 545L412 600L430 660L458 718L432 718Q395 670 358 718L332 718L360 660L378 600L387 545L392 485Z" fill="url(#${p}g)" fill-opacity=".22" stroke="url(#${p}g)" stroke-width="2.5"/>
    <path d="M378 545H412M368 600H422M352 660H438M387 545L412 600M403 545L378 600M378 600L438 660M412 600L352 660" stroke="url(#${p}g)" stroke-width="1.4" fill="none"/>
    ${star(395, 438, 10, `url(#${p}g)`)}${sparkles}
  </g>
  <rect x="84" y="164" width="622" height="552" fill="none" stroke="url(#${p}g)" stroke-width="3"/>
  <rect x="96" y="176" width="598" height="528" fill="none" stroke="url(#${p}g)" stroke-width="1" stroke-opacity=".8"/>
  <text x="395" y="232" text-anchor="middle" font-family="${SERIF}" font-size="21" letter-spacing="7" fill="url(#${p}t)">CALENDRIER DE L’AVENT</text>
  <path d="M300 254H370M420 254H490" stroke="url(#${p}g)" stroke-width="1.5"/>${star(395, 254, 7, `url(#${p}g)`)}
  <text x="395" y="384" text-anchor="middle" font-family="${SERIF}" font-weight="500" font-size="150" fill="url(#${p}t)">24</text>
  <text x="395" y="426" text-anchor="middle" font-family="${SERIF}" font-size="25" letter-spacing="6" fill="url(#${p}t)">JOURS DE BEAUTÉ</text>
  <rect x="122" y="140" width="34" height="600" fill="url(#${p}gv)" opacity=".95"/>
  <rect x="122" y="140" width="34" height="600" fill="url(#${p}g)" opacity=".45"/>
  <path d="M122 140L156 140L286 60L252 60Z" fill="url(#${p}g)"/>
  <g transform="translate(206 98)">
    <path d="M0 0C-30 -50 -95 -40 -80 -8C-70 14 -25 10 0 0Z" fill="url(#${p}g)" stroke="#9a6a1c" stroke-width="2"/>
    <path d="M0 0C30 -50 95 -40 80 -8C70 14 25 10 0 0Z" fill="url(#${p}g)" stroke="#9a6a1c" stroke-width="2"/>
    <path d="M-4 4L-40 70L-24 64L-14 80L4 8Z" fill="url(#${p}g)" stroke="#9a6a1c" stroke-width="1.5"/>
    <path d="M4 4L46 62L28 60L22 78L-2 8Z" fill="url(#${p}g)" stroke="#9a6a1c" stroke-width="1.5"/>
    <ellipse cx="0" cy="0" rx="17" ry="14" fill="url(#${p}g)" stroke="#9a6a1c" stroke-width="2"/></g></svg>`;
}

/* ---------- gift box for the CTA banner ---------- */
function gift(p, x, y, w, h, d, face, ribbon = "gold") {
  const r = `url(#${p}${ribbon === "gold" ? "g" : "gp"})`;
  return `<g>
  <path d="M${x} ${y}L${x + d} ${y - d * 0.55}L${x + w + d} ${y - d * 0.55}L${x + w} ${y}Z" fill="${face[0]}"/>
  <path d="M${x + w} ${y}L${x + w + d} ${y - d * 0.55}L${x + w + d} ${y + h - d * 0.55}L${x + w} ${y + h}Z" fill="${face[2]}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${face[1]}"/>
  <rect x="${x - 6}" y="${y}" width="${w + 6}" height="${h * 0.16}" fill="${face[0]}" opacity=".6"/>
  <rect x="${x + w / 2 - w * 0.06}" y="${y}" width="${w * 0.12}" height="${h}" fill="${r}"/>
  <path d="M${x + w / 2 - w * 0.06} ${y}L${x + w / 2 - w * 0.06 + d} ${y - d * 0.55}L${x + w / 2 + w * 0.06 + d} ${y - d * 0.55}L${x + w / 2 + w * 0.06} ${y}Z" fill="${r}"/>
  <path d="M${x + w} ${y + h * 0.45}L${x + w + d} ${y + h * 0.45 - d * 0.55}L${x + w + d} ${y + h * 0.58 - d * 0.55}L${x + w} ${y + h * 0.58}Z" fill="${r}" opacity=".8"/>
  <g transform="translate(${x + w / 2 + d / 2} ${y - d * 0.28}) scale(${w / 260})">
    <path d="M0 0C-40 -70 -130 -55 -110 -10C-96 20 -35 14 0 0Z" fill="${r}" stroke="#9a6a1c" stroke-opacity=".5" stroke-width="2"/>
    <path d="M0 0C40 -70 130 -55 110 -10C96 20 35 14 0 0Z" fill="${r}" stroke="#9a6a1c" stroke-opacity=".5" stroke-width="2"/>
    <ellipse rx="22" ry="18" fill="${r}"/></g></g>`;
}

/* ---------- page wrapper + render ---------- */
const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,500&display=block" rel="stylesheet">`;
const page = (w, h, body, bg = "transparent") =>
  `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${bg}}
  .s{position:absolute}.s svg{width:100%;height:100%;display:block}.sh svg{filter:drop-shadow(0 18px 22px rgba(120,40,60,.22))}</style></head><body><div style="position:relative;width:${w}px;height:${h}px">${body}</div></body></html>`;
const place = (svg, x, y, w, h = w, cls = "s") => `<div class="${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${svg}</div>`;
// place a 600x600 product so its ground line (y=574) lands on `base`
const prod = (svg, cx, base, w) => place(svg, cx - w / 2, base - w * (574 / 600), w);
const bokeh = (items) => items.map(([x, y, r, c, o]) => `<div style="position:absolute;left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,${c} 0%,transparent 70%);opacity:${o}"></div>`).join("");

const RENDER = new Set(["christmas-gifts"]);
function render(name, w, h, html, { alpha = true, quality = 86 } = {}) {
  if (!RENDER.has(name)) return null;
  const file = join(TMP, name + ".html");
  writeFileSync(file, html);
  const png = join(TMP, name + ".png");
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${w},${h}`, "--force-device-scale-factor=1",
    "--virtual-time-budget=8000", ...(alpha ? ["--default-background-color=00000000"] : []), `--screenshot=${png}`, pathToFileURL(file).href], { stdio: "ignore" });
  return { png, out: join(OUT, name + ".webp"), quality };
}

const jobs = [];
const products = {
  "product-lipstick": lipstick("a"),
  "product-lipstick-nude": lipstick("a2", ["#7b3a35", "#b9675d", "#e6a596"]),
  "product-mascara": mascara("b"),
  "product-skincare": jar("c"),
  "product-night-cream": jar("c2", ["#6e0c33", "#a3163d", "#d6517c"], "Nuit Velours", "SOIN DE NUIT · 50 ML"),
  "product-haircare": tube("d"),
  "product-foundation": oil("e"),
  "product-nail-polish": nail("f"),
  "product-nail-polish-rose": nail("f2", ["#c46f86", "#eba6b8", "#fbd3de"], "Poudré"),
};
for (const [n, svg] of Object.entries(products)) jobs.push(render(n, 600, 600, page(600, 600, place(svg, 0, 0, 600))));

// Hero composition: calendar box with products arranged in front (transparent)
{
  const W = 1200, H = 900;
  const body = [
    place(calendarBox("hb"), 250, 20, 900, 780, "s sh"),
    place(bauble("h1", 46), 1076, 600, 112, 152), place(bauble("h2", 30, "pink"), 90, 730, 80, 120),
    prod(lipstick("h3"), 300, 864, 380), prod(mascara("h4"), 402, 852, 420), prod(lipstick("h5", ["#7b3a35", "#b9675d", "#e6a596"]), 486, 880, 310),
    prod(oil("h6"), 612, 854, 360), prod(tube("h7"), 990, 858, 380), prod(jar("h8"), 785, 890, 470),
    prod(nail("h9"), 1095, 892, 300), prod(nail("h10", ["#c46f86", "#eba6b8", "#fbd3de"], "Poudré"), 196, 894, 240),
  ].join("");
  jobs.push(render("hero-calendar", W, H, page(W, H, body)));
}

// Product section image (opaque, soft pink studio scene with roses)
{
  const W = 1100, H = 980;
  const bg = "radial-gradient(ellipse at 55% 40%,#fff5f2 0%,#fbe1e4 55%,#f4c9d1 100%)";
  const roses = `<svg viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0" xmlns="http://www.w3.org/2000/svg"><defs>${blur("rb", 3)}</defs>
    <g transform="translate(70 380)">${rose("r1", 1.35)}</g><g transform="translate(20 520)">${rose("r2", 1.1, ["#fff0f3", "#f8c4d1", "#e996ad"])}</g>
    <g transform="translate(120 640)">${rose("r3", 1.2)}</g><g transform="translate(1060 300)" filter="url(#rb)">${rose("r4", 1.2, ["#fff0f3", "#f8c4d1", "#e996ad"])}</g>
    <g transform="translate(1000 180)" filter="url(#rb)">${rose("r5", .9)}</g></svg>`;
  const body = [
    `<div style="position:absolute;left:0;right:0;bottom:0;height:200px;background:linear-gradient(#f6d3d9,#efc0c9)"></div>`,
    bokeh([[880, 120, 90, "#fff", .7], [960, 420, 60, "#ffe9c9", .8], [180, 130, 70, "#fff", .6], [660, 90, 40, "#fff", .8]]),
    roses,
    place(calendarBox("pb"), 30, 60, 1040, 901, "s sh"),
    place(bauble("p1", 52), 40, 760, 124, 164), place(bauble("p2", 34), 160, 840, 88, 128),
    place(bauble("p3", 40, "pink"), 950, 800, 100, 140), place(bauble("p4", 26), 1040, 860, 72, 112),
  ].join("");
  jobs.push(render("product-calendar", W, H, page(W, H, body, bg), { alpha: false }));
}

// Final CTA banner background (opaque)
{
  const W = 1920, H = 560;
  const bg = "radial-gradient(ellipse at 50% 50%,#fff6f1 0%,#fbe6dc 45%,#f3cfbf 100%)";
  const svg = `<svg viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0" xmlns="http://www.w3.org/2000/svg"><defs>${goldH("xg")}
    <linearGradient id="xgp" x1="0" x2="1"><stop offset="0" stop-color="#d27a92"/><stop offset=".5" stop-color="#f6c3d0"/><stop offset="1" stop-color="#c46582"/></linearGradient></defs>
    ${gift("x", -60, 250, 300, 330, 90, ["#f3dcc8", "#e9c9ae", "#d4ac8c"])}
    ${gift("x", 230, 380, 210, 200, 70, ["#f9e3e6", "#f1cdd4", "#dfaab5"], "pink")}
    ${gift("x", 1560, 230, 320, 350, 90, ["#f3dcc8", "#e9c9ae", "#d4ac8c"])}
    ${gift("x", 1390, 400, 190, 180, 60, ["#f9e3e6", "#f1cdd4", "#dfaab5"])}
    <path d="M0 140Q160 100 300 170T620 120" stroke="url(#xg)" stroke-width="10" fill="none" opacity=".55"/>
    <path d="M1920 120Q1760 80 1640 150T1320 110" stroke="url(#xg)" stroke-width="10" fill="none" opacity=".55"/>
    ${[[480, 80, 10], [560, 470, 8], [1300, 70, 9], [1400, 300, 7], [140, 90, 8], [1780, 70, 9]].map(([x, y, s]) => star(x, y, s, "url(#xg)", .8)).join("")}</svg>`;
  const body = [
    bokeh([[120, 60, 80, "#ffe4b8", .9], [400, 300, 60, "#fff", .8], [520, 120, 50, "#ffd9a0", .7], [1480, 90, 70, "#ffe4b8", .9], [1700, 330, 50, "#fff", .7], [1250, 450, 60, "#ffd9a0", .6], [700, 470, 50, "#fff", .6], [1820, 470, 70, "#ffe4b8", .7]]),
    svg,
    place(bauble("x1", 44), 470, 430, 108, 148), place(bauble("x2", 32, "pink"), 1310, 450, 84, 124),
  ].join("");
  jobs.push(render("christmas-gifts", W, H, page(W, H, body, bg), { alpha: false, quality: 82 }));
}

// Open Graph image (1200x630, opaque) — re-uses the hero scene
{
  const W = 1200, H = 630;
  const bg = "linear-gradient(120deg,#fff6f3 0%,#fbe3e7 60%,#f6cdd7 100%)";
  const body = `<div style="position:absolute;left:60px;top:150px;font-family:'Playfair Display',serif;color:#171717">
      <div style="font:600 18px Montserrat,sans-serif;letter-spacing:4px;color:#C2185B">BEAUTÉCALENDRIER</div>
      <div style="font-size:54px;line-height:1.1;margin-top:18px">Calendrier<br>de l’Avent<br><span style="color:#C2185B">beauté 2026</span></div>
      <div style="font:500 20px Montserrat,sans-serif;margin-top:22px;color:#444">24 surprises, jour après jour</div></div>
    <div class="s" style="left:430px;top:-10px;width:860px;height:645px"><img src="hero-calendar.png" style="width:100%"></div>`;
  jobs.push(render("og-image", W, H, page(W, H, body, bg), { alpha: false }));
}

// convert PNG -> WebP
const todo = jobs.filter(Boolean);
const py = todo.map((j) => `Image.open(r"${j.png}").save(r"${j.out}", "WEBP", quality=${j.quality}, method=6)`).join("\n");
writeFileSync(join(TMP, "convert.py"), `from PIL import Image\n${py}\n`);
execFileSync("python", [join(TMP, "convert.py")], { stdio: "inherit" });
if (!process.argv.includes("--keep")) rmSync(TMP, { recursive: true, force: true });
console.log("Generated:", todo.map((j) => j.out.split(/[\\/]/).pop()).join(", "));
