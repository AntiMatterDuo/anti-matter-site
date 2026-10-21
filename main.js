/* ============================================================
   ANTI MATTER — main.js
   All interactive behaviour for the single-page portfolio site.

   Sections
   ─────────
   1. Helpers & feature detection
   2. WebGL-like canvas particle system
      • Particle arrays (position, velocity, target, jitter…)
      • Shape presets: void | rings | lattice | wave | knot
      • Camera (yaw / pitch), auto-spin, mouse parallax
      • Repulsion force on pointer/click
      • Spark trail particles
   3. Cursor chrome (dot + ring)
   4. Scroll FX (parallax data-hs / data-sx, process line, step reveal)
   5. Intersection observers
      • Section shape switch (io1)
      • Reveal animation (io2)
   6. Hover overrides: services list, mag-links, tilt cards
   7. Init
   ============================================================ */

(() => {

/* ── 1. Helpers ─────────────────────────────────────────────── */
const $  = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const RM   = matchMedia('(prefers-reduced-motion:reduce)').matches;
const FINE = matchMedia('(pointer:fine)').matches;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;

// Reduced-motion class on <html>
if (RM) document.documentElement.classList.add('rm');

// Custom-cursor mode (fine pointer + no reduced motion)
if (FINE && !RM) document.body.classList.add('hc');

/* ── 2. Canvas / Particle System ────────────────────────────── */
const cv  = $('#gl');
const ctx = cv ? cv.getContext('2d') : null;
const cd  = $('.cd');   // cursor dot
const cr  = $('.cr');   // cursor ring

// Particle count — fewer on mobile / reduced-motion
const N = RM ? 600 : (innerWidth < 800 || !FINE ? 700 : 1500);

// Typed arrays for every particle property
const F   = () => new Float32Array(N);
const X   = F(), Y   = F(), Z   = F();   // current 3-D position
const vx  = F(), vy  = F(), vz  = F();   // velocity
const tx  = F(), ty  = F(), tz  = F();   // target position
const ox  = F(), oy  = F();              // orbit offset (position)
const ovx = F(), ovy = F();              // orbit offset velocity
const jx  = F(), jy  = F(), jz  = F();  // jitter seeds (random, fixed)
const SX  = F(), SY  = F();             // screen-space X/Y
const ex  = F(), ey  = F(), ez  = F();  // tail end 3-D
const rex = F(), rey = F(), rez = F();  // tail end target
const tox = F(), toy = F();             // tail-end screen offset
const tvx = F(), tvy = F();             // tail-end offset velocity
const wh  = new Uint8Array(N);          // 1 → white accent particle

// Initialise random sphere positions + jitter seeds
for (let i = 0; i < N; i++) {
  const a = Math.random() * 6.283;
  const b = Math.acos(2 * Math.random() - 1);
  const r = 2 + Math.random() * 2;
  X[i]  = Math.sin(b) * Math.cos(a) * r;
  Y[i]  = Math.cos(b) * r;
  Z[i]  = Math.sin(b) * Math.sin(a) * r;
  jx[i] = Math.random() - .5;
  jy[i] = Math.random() - .5;
  jz[i] = Math.random() - .5;
  wh[i] = Math.random() < .14 ? 1 : 0;
}

// Stroke colours — 3 depth levels × 2 colours (magenta / white)
const SCOL = [.3, .6, .95].map(a => `rgba(237,27,102,${a})`)
  .concat([.3, .6, .95].map(a => `rgba(245,245,245,${a * .8})`));

// Star / logo image (data-URI set in HTML; reused here for canvas)
const SYM  = document.getElementById('navmark').src;
const star = new Image();
star.onload = () => { dirty = 1; };
star.src    = SYM;
let starA = 0; // blend amount for star overlay (1 = visible, shape "void")

// Runtime state
let W, H, DPR, narrow, dirty = 1;
let S = Math.random() * 9; // shape phase seed

let shape   = 'void';  // current particle shape
let base    = 'void';  // shape set by scroll position
let pos     = 'hero';  // camera position preset key
let hovering = 0;
let raf;

// Camera / focal position presets  [cx%, cy%, scale, globalAlpha]
const POS = {
  hero:   [.66, .5,  1,   1],
  side:   [.8,  .55, .75, .4],
  center: [.5,  .5,  1.2, .5],
};
// Narrow-viewport variants
const NP = {
  hero:   [.5,  .34, .85, 1],
  side:   [.5,  .5,  .9,  .22],
  center: [.5,  .5,  1.1, .35],
};

// Animated camera values
let cx = 0, cy = 0, sc = 1, ga = 1;

/* Resize handler – updates canvas size and DPR */
function size() {
  DPR    = Math.min(devicePixelRatio || 1, 2);
  W      = innerWidth;
  H      = innerHeight;
  narrow = W < 800;
  if (cv && ctx) {
    cv.width  = W * DPR;
    cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  dirty = 1;
  sf    = 1;
}

/* ── Shape presets ──────────────────────────────────────────── */
function setShape(n) {
  shape = n;
  S     = Math.random() * 9;

  const k  = Math.ceil(Math.cbrt(N));   // cube root for lattice
  const g  = Math.ceil(Math.sqrt(N));   // square root for wave grid
  const GA = 2.39996;                    // golden angle (radians)

  for (let i = 0; i < N; i++) {
    let a, b, c, da = 0, db = 0, dc = 0;
    const rl = jz[i] + .5;
    const t  = i * GA;
    let l = .1 + rl * .35;

    if (n === 'void') {
      // Fibonacci disc
      const r = Math.sqrt(.3 + .7 * (i + .5) / N);
      a  = Math.cos(t) * r;
      b  = Math.sin(t) * r;
      c  = jx[i] * .12;
      da = Math.cos(t);
      db = Math.sin(t);
      l  = .12 + rl * .4 * (1 + .3 * Math.sin(t * 3 + S));
    } else if (n === 'rings') {
      // Uniform sphere
      const yy = 1 - 2 * (i + .5) / N;
      const r  = Math.sqrt(1 - yy * yy);
      a = Math.cos(t) * r * .7;
      b = yy * .7;
      c = Math.sin(t) * r * .7;
      da = a; db = b; dc = c;
      l  = .2 + rl * .45;
    } else if (n === 'lattice') {
      // 3-D grid
      const ix = i % k;
      const iy = (i / k | 0) % k;
      const iz = i / (k * k) | 0;
      const f  = (ix * 3 + iy * 5 + iz * 7) % 4 ? 1 : 1.3;
      a  = (ix / (k - 1) * 2 - 1) * 1.1 * f;
      b  = (iy / (k - 1) * 2 - 1) * 1.1 * f;
      c  = (iz / (k - 1) * 2 - 1) * 1.1 * f;
      da = a; db = b; dc = c;
      l  = .1 + rl * .3;
    } else if (n === 'wave') {
      // Undulating 2-D grid
      const ix = i % g;
      const iy = i / g | 0;
      a  = (ix / g * 2 - 1) * 1.7;
      c  = (iy / g * 2 - 1) * 1.7;
      b  = Math.sin(a * 2.2 + S) * .3 + Math.cos(c * 2.4 + S) * .3;
      db = 1;
      da = .3 * Math.sin(S + a);
      l  = .15 + rl * .4;
    } else {
      // 'knot' – noisy cloud
      const y = jy[i] * 2.4;
      a  = jx[i] * .6;
      b  = y;
      c  = jz[i] * .6;
      da = Math.sin(y * 2 + S) * .4;
      db = -1;
      dc = Math.cos(y * 2) * .3;
      l  = .3 + rl * .9;
    }

    const m    = Math.hypot(da, db, dc) || 1;
    tx[i]  = a; ty[i]  = b; tz[i]  = c;
    rex[i] = da / m * l;
    rey[i] = db / m * l;
    rez[i] = dc / m * l;

    // Tiny velocity kick for fluid transition
    vx[i] += (Math.random() - .5) * .05;
    vy[i] += (Math.random() - .5) * .05;
  }

  dirty = 1;
}

/* ── Pointer / mouse state ──────────────────────────────────── */
let mx = -9999, my = -9999;  // current pointer position
let rx = 0,     ry = 0;      // lagged cursor ring position
let inside  = 0;             // pointer inside viewport
let spd     = 0;             // pointer speed (for spark rate + repulsion)
let rY = 0, rX = 0;          // camera yaw / pitch
let vY = 0, vX = 0;          // camera rotation velocities
let auto    = 0;             // auto-rotation phase
let hot     = 0;             // hover amount (for scale pulse)
let hotT    = 0;             // hover target
let prox    = 0;             // proximity to cluster centre
let sf      = 1;             // scroll FX dirty flag

// Spark trail
const sparks = [];

addEventListener('pointermove', e => {
  const dx = inside ? e.clientX - mx : 0;
  const dy = inside ? e.clientY - my : 0;

  if (!inside) {
    rx = e.clientX;
    ry = e.clientY;
    document.body.classList.add('in');
  }

  spd = Math.min(40, spd + Math.hypot(dx, dy) * .4);
  mx  = e.clientX;
  my  = e.clientY;
  inside = 1;

  // Emit spark
  if (!RM && spd > 2 && sparks.length < 48) {
    sparks.push({
      x:  mx,
      y:  my,
      vx: Math.random() - .5 - dx * .04,
      vy: Math.random() - .5 - dy * .04,
      l:  1,
      w:  Math.random() < .3,  // white vs magenta
    });
  }
}, { passive: true });

function leave() {
  inside = 0;
  document.body.classList.remove('in');
}

document.documentElement.addEventListener('mouseleave', leave);
addEventListener('pointerup', e => { if (e.pointerType === 'touch') setTimeout(leave, 500); });

// Click / tap – radial burst of repulsion
addEventListener('pointerdown', e => {
  mx = e.clientX; my = e.clientY; inside = 1; rx = mx; ry = my;
  document.body.classList.add('in');
  if (RM) return;

  for (let i = 0; i < N; i++) {
    const dx = SX[i] - mx;
    const dy = SY[i] - my;
    const d  = Math.hypot(dx, dy) || 1;
    if (d < 300) {
      const f   = (1 - d / 300) * 14;
      ovx[i]  += dx / d * f * .3;
      ovy[i]  += dy / d * f * .3;
      tvx[i]  += dx / d * f * 1.4;
      tvy[i]  += dy / d * f * 1.4;
    }
  }
});

// Cursor ring states
document.addEventListener('pointerover', e => {
  const t = e.target.closest('a,button,[data-cur],.svc li');
  const b = document.body.classList;
  b.toggle('ch', !!t && !t.dataset.cur);
  b.toggle('cv', !!t && t.dataset.cur === 'view');
  hotT = t ? 1 : 0;
});

/* ── Main animation loop ──────────────────────────────────────── */
let last = performance.now();

function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = Math.min(2, (now - last) / 16.667);
  last = now;

  // Camera target lookup
  const p = (narrow ? NP : POS)[pos];
  const px0 = document.documentElement.dir === 'rtl' ? 1 - p[0] : p[0]; // mirror the object for right-to-left languages

  if (RM) {
    cx = px0 * W; cy = p[1] * H; sc = p[2]; ga = p[3];
    starA = shape === 'void' ? 1 : 0;
  } else {
    const t = .05 * dt;
    cx    = lerp(cx,    px0 * W, t);
    cy    = lerp(cy,    p[1] * H, t);
    sc    = lerp(sc,    p[2],     t);
    ga    = lerp(ga,    p[3],     t);
    hot   = lerp(hot,   hotT,     .08 * dt);
    starA = lerp(starA, shape === 'void' ? 1 : 0, .06 * dt);
  }

  scrollFx();

  // If canvas context is unavailable, update cursor and skip rendering
  if (!ctx) {
    if (FINE && !RM) {
      rx = lerp(rx, mx, .2 * dt);
      ry = lerp(ry, my, .2 * dt);
      cd.style.transform = `translate3d(${mx}px,${my}px,0)`;
      cr.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    }
    return;
  }

  // Skip draw on reduced-motion when nothing changed
  if (RM && !dirty) return;
  dirty = 0;

  const R    = Math.min(W, H) * (narrow ? .3 : .27) * sc * (1 + hot * .05 + spd * .004);
  prox       = inside ? clamp(1 - Math.hypot(mx - cx, my - cy) / (R * 1.7), 0, 1) : 0;

  if (!RM) {
    auto += dt * .0016 * (1 + hot * 2);

    const tyaw = (inside ? (mx / W - .5) * 1.1 : 0) + scrollY * .0012;
    const tp   = inside ? (my / H - .5) * .7 : 0;

    vY += (tyaw - rY) * .02 * dt;  vY *= Math.pow(.88, dt);  rY += vY * dt;
    vX += (tp   - rX) * .02 * dt;  vX *= Math.pow(.88, dt);  rX += vX * dt;
    spd *= Math.pow(.92, dt);
  }

  // Rotation matrix (yaw around Y, pitch around X)
  const yaw = rY + (RM ? 0 : Math.sin(auto * .6) * .3);
  const cyw = Math.cos(yaw), syw = Math.sin(yaw);
  const cp  = Math.cos(rX),  sp  = Math.sin(rX);

  const rad = narrow ? 130 : 200;
  const act = inside && !RM;

  const k  = .028 * dt;
  const d1 = Math.pow(.86, dt);
  const d2 = Math.pow(.9,  dt);
  const d3 = Math.pow(.93, dt);
  const e  = .06 * dt;

  // Repulsion helper (applied to orbit offsets)
  const rep = (px, py, A, B, i, m) => {
    const dx = px - mx, dy = py - my;
    const d  = dx * dx + dy * dy;
    if (d < rad * rad && d > 1) {
      const dd = Math.sqrt(d);
      const t  = 1 - dd / rad;
      const fo = t * t * (.25 + prox * .9 + spd * .03) * m * dt;
      const nx = dx / dd, ny = dy / dd;
      A[i] += nx * fo - ny * fo * .5;
      B[i] += ny * fo + nx * fo * .5;
    }
  };

  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = ga;
  ctx.lineWidth   = narrow ? .8 : 1;

  let cur = -1; // track current stroke style to minimise state changes

  for (let i = 0; i < N; i++) {
    if (RM) {
      X[i]  = tx[i];  Y[i]  = ty[i];  Z[i]  = tz[i];
      ex[i] = rex[i]; ey[i] = rey[i]; ez[i] = rez[i];
    } else {
      // Spring physics toward target
      vx[i] = (vx[i] + (tx[i] - X[i]) * k) * d1;
      vy[i] = (vy[i] + (ty[i] - Y[i]) * k) * d1;
      vz[i] = (vz[i] + (tz[i] - Z[i]) * k) * d1;
      X[i] += vx[i] * dt; Y[i] += vy[i] * dt; Z[i] += vz[i] * dt;
      // Spring tail end toward target
      ex[i] += (rex[i] - ex[i]) * e;
      ey[i] += (rey[i] - ey[i]) * e;
      ez[i] += (rez[i] - ez[i]) * e;
    }

    // Project head position to screen
    const x1  = X[i] * cyw + Z[i] * syw;
    const z1  = -X[i] * syw + Z[i] * cyw;
    const y1  = Y[i] * cp - z1 * sp;
    const z2  = Y[i] * sp + z1 * cp;
    const f   = 3.4 / (3.4 - z2);
    const px  = cx + x1 * f * R + ox[i];
    const py  = cy + y1 * f * R + oy[i];

    // Project tail end
    const X2  = X[i] + ex[i], Y2 = Y[i] + ey[i], Z2 = Z[i] + ez[i];
    const q1  = X2 * cyw + Z2 * syw;
    const qz  = -X2 * syw + Z2 * cyw;
    const q2  = Y2 * cp - qz * sp;
    const qz2 = Y2 * sp + qz * cp;
    const f2  = 3.4 / (3.4 - qz2);
    const qx  = cx + q1 * f2 * R + tox[i];
    const qy  = cy + q2 * f2 * R + toy[i];

    if (!RM) {
      // Repulsion on head and tail offsets
      if (act) { rep(px, py, ovx, ovy, i, .25); rep(qx, qy, tvx, tvy, i, 1); }
      // Damped spring for orbit offsets
      ovx[i] = (ovx[i] - ox[i]  * .03 * dt) * d2; ovy[i] = (ovy[i] - oy[i]  * .03 * dt) * d2;
      ox[i]  += ovx[i] * dt; oy[i] += ovy[i] * dt;
      tvx[i] = (tvx[i] - tox[i] * .02 * dt) * d3; tvy[i] = (tvy[i] - toy[i] * .02 * dt) * d3;
      tox[i] += tvx[i] * dt; toy[i] += tvy[i] * dt;
    }

    SX[i] = px; SY[i] = py;

    // Depth-based colour index
    const lv = clamp((z2 + 1.8) / 3.6 * 3 | 0, 0, 2);
    const c  = wh[i] ? 3 + lv : lv;
    if (c !== cur) { ctx.strokeStyle = SCOL[c]; cur = c; }

    // Draw stroke (head → tail)
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(qx, qy);
    ctx.stroke();

    // White accent square at tail
    if (wh[i]) { ctx.fillStyle = '#f5f5f5'; ctx.fillRect(qx - 1, qy - 1, 2, 2); }
  }

  // Star overlay (visible only in "void" shape)
  if (starA > .02 && star.complete && star.naturalWidth) {
    const w = R * .9;
    const h = w * star.naturalHeight / star.naturalWidth;
    ctx.globalAlpha = ga * starA;
    ctx.drawImage(star, cx - w / 2 + rY * R * .2, cy - h / 2 + rX * R * .2, w, h);
  }

  ctx.globalAlpha = 1;

  // Spark trail
  for (let j = sparks.length - 1; j >= 0; j--) {
    const s = sparks[j];
    s.x += s.vx * dt; s.y += s.vy * dt; s.l -= .03 * dt;
    if (s.l <= 0) { sparks.splice(j, 1); continue; }
    ctx.fillStyle = s.w
      ? `rgba(245,245,245,${s.l * .8})`
      : `rgba(237,27,102,${s.l})`;
    ctx.fillRect(s.x - 1, s.y - 1, 2, 2);
  }

  // ── 3. Cursor chrome ─────────────────────────────────────────
  if (FINE && !RM) {
    rx = lerp(rx, mx, .2 * dt);
    ry = lerp(ry, my, .2 * dt);
    cd.style.transform = `translate3d(${mx}px,${my}px,0)`;
    cr.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    document.body.classList.toggle('co', prox > .55);
  }
}

/* ── 4. Scroll FX ───────────────────────────────────────────── */
const line  = $('.line i');
const steps = $$('.step');
const proc  = $('#process');

function scrollFx() {
  if (!sf) return;
  sf = 0;

  if (!RM) {
    // Horizontal parallax (data-hs = speed multiplier)
    $$('[data-hs]').forEach(el =>
      el.style.transform = `translate3d(${scrollY * el.dataset.hs}px,0,0)`
    );

    // Skewed headline letters (data-sx = parallax factor)
    $$('[data-sx]').forEach(el => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate3d(${(r.top + r.height / 2 - H / 2) * el.dataset.sx}px,0,0)`;
    });
  }

  // Process progress line + step reveal
  const r = proc.getBoundingClientRect();
  const p = clamp((H * .8 - r.top) / (r.height * .85), 0, 1);
  line.style.transform = `scaleX(${p})`;
  steps.forEach((s, i) => s.classList.toggle('on', p > (i + .35) / 5 || RM));
}

addEventListener('scroll', () => { sf = 1; }, { passive: true });
addEventListener('resize', size);

/* ── 5. Intersection Observers ──────────────────────────────── */

// Shape-switch as sections scroll into view
const io1 = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  base = e.target.dataset.shape;
  pos  = e.target.dataset.pos || 'side';
  dirty = 1;
  if (!hovering && shape !== base) setShape(base);
}), { rootMargin: '-50% 0px -50% 0px' });

$$('[data-shape]').forEach(s => io1.observe(s));

// Reveal animation
const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); }
}), { threshold: .2 });

$$('.rv').forEach(el => io2.observe(el));

/* ── 6. Hover overrides ─────────────────────────────────────── */

// Services list – shape override while hovering
$$('.svc li').forEach(li => {
  const on  = () => { hovering = 1; setShape(li.dataset.s); };
  const off = () => { hovering = 0; setShape(base); };
  li.addEventListener('pointerenter', on);
  li.addEventListener('pointerleave', off);
  li.addEventListener('focus', on);
  li.addEventListener('blur',  off);
});

// Magnetic buttons (data-mag) – subtle follow effect
$$('[data-mag]').forEach(el => {
  el.addEventListener('pointermove', e => {
    if (RM) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate3d(${(e.clientX - r.left - r.width  / 2) * .3}px,${(e.clientY - r.top  - r.height / 2) * .3}px,0)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});

// Work cards – rendered from data/projects.js
// Hides the Work section + nav link when no projects are visible.
function renderProjects() {
  const projects = (window.PROJECTS || []).filter(p => p.visible);
  const section  = $('#work');
  const navItem  = $('.nav a[href="#work"]');
  const grid     = section && section.querySelector('.grid');

  if (!section || !grid) return;

  if (projects.length === 0) {
    section.style.display = 'none';
    if (navItem) navItem.closest('li').style.display = 'none';
    return;
  }

  projects.forEach(p => {
    const card = document.createElement('a');
    card.className   = 'card rv';
    card.href        = p.link || '#contact';
    if (p.link && p.link !== '#contact') {
      card.dataset.cur = 'view';
      if (!p.link.startsWith('#')) {
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      }
    }
    card.innerHTML   =
      `<div class="viz ${p.visual}"></div>` +
      `<div class="meta"><h3 data-i18n="projects.${p.id}.title">${p.title}</h3><p data-i18n="projects.${p.id}.description">${p.description}</p></div>`;

    // 3-D tilt + dot-grid pointer tracking
    card.addEventListener('pointermove', e => {
      if (RM) return;
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - .5;
      const ny = (e.clientY - r.top)  / r.height - .5;
      const s  = card.style;
      s.setProperty('--rx',  nx * 8  + 'deg');
      s.setProperty('--ry', -ny * 8  + 'deg');
      s.setProperty('--nx',  nx * 2);
      s.setProperty('--ny',  ny * 2);
      s.setProperty('--px', (nx + .5) * 100 + '%');
      s.setProperty('--py', (ny + .5) * 100 + '%');
    });
    card.addEventListener('pointerleave', () =>
      ['--rx', '--ry', '--nx', '--ny'].forEach(prop => card.style.removeProperty(prop))
    );

    grid.appendChild(card);
    io2.observe(card); // wire up the reveal animation
  });
}

/* ── 7. Init ────────────────────────────────────────────────── */
size();
// Seed camera at hero position without lerp lag
cx = ((narrow ? NP : POS).hero[0]) * W; // (first frame; the loop then mirrors it for RTL)
cy = (narrow ? NP : POS).hero[1] * H;

renderProjects();
setShape('void');
raf = requestAnimationFrame(frame);

// Clean up on bfcache restore (Safari)
addEventListener('pagehide', () => cancelAnimationFrame(raf));

})();

