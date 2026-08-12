// THE FORECAST WORKS — the drafting instrument
//
// Everything on a plate is specified in MILLIMETRES on the sheet, never pixels: a drawing whose
// line weights are in pixels changes character when you zoom, and a 0.25 pen has to stay a 0.25
// pen or the sheet stops being a document.
//
// The ink canvas composites over the paper with `mix-blend-mode: multiply`, so ink darkens the
// paper it lies on and the paper's tooth shows through. Every ink colour here is therefore a
// DENSITY, never a lightness — ink cannot make paper brighter.
//
// The drafting conventions (ISO pen weights, zone references, title block, revision clouds) and
// the mm-space discipline follow The Systems Works, which established this register in the
// house. The instruments below are this project's own: a forecast wants gauges, engraved scales
// and strip charts, not valves and sight glasses.

// ── ISO pen weights, mm. A drawing reads because its weights are a hierarchy.
export const PEN = {
  hairline: 0.13, thin: 0.18, detail: 0.25, medium: 0.35,
  outline: 0.50, heavy: 0.70, border: 1.00,
};

// Ink densities, and what each colour MEANS. A drawing office had a limited palette and used it
// meaningfully; the code is declared here and never broken, so a reader learns it once.
export const INK = {
  ink: 'rgba(24,28,38,0.92)',          // structure: the sheet itself, observed record
  inkLight: 'rgba(24,28,38,0.62)',
  pencil: 'rgba(52,50,48,0.72)',       // construction lines, secondary annotation
  pencilLight: 'rgba(52,50,48,0.42)',
  red: 'rgba(150,44,38,0.88)',         // revision — what the evidence moved THIS MORNING
  redLight: 'rgba(150,44,38,0.55)',
  blue: 'rgba(21,84,166,0.92)',        // probability in motion: bands, the forecast itself
  blueLight: 'rgba(21,84,166,0.52)',
  blueWash: 'rgba(58,132,214,0.26)',   // the body of a distribution, laid in as a wash
  green: 'rgba(24,96,78,0.86)',        // goals and desired states: claims, the deal, targets
  greenWash: 'rgba(40,120,96,0.20)',
  warm: 'rgba(178,86,24,0.88)',        // energy — compute, power, emissions
  warmWash: 'rgba(206,120,52,0.24)',
  ochre: 'rgba(150,110,26,0.85)',      // delays and time constants: pauses, shelves, lags
  erase: 'rgba(120,116,110,0.20)',     // a ghost where something was rubbed out
};

const DRAFT_FACE = '"Avenir Next Condensed","Roboto Condensed","Arial Narrow",' +
                   '"Helvetica Neue",sans-serif';
const FIGURE_FACE = 'ui-monospace,"SF Mono",Menlo,monospace';

// Canvas letter-spacing lets a whole string be drawn in one fillText with tracking applied.
// Without it we fall back to a per-glyph loop, which is correct and slow.
const HAS_SPACING = (() => {
  try {
    const c = document.createElement('canvas').getContext('2d');
    return c && 'letterSpacing' in c;
  } catch (e) { return false; }
})();

export class Draft {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mmPerPx = 1;
    this.centre = [0, 0];
    this.wcache = new Map();      // string → width per mm of cap height
    this.lcache = new Map();      // paragraph → wrapped lines
    this.font = null; this.tracking = null;
    this.dpr = 1;
    this.ink = INK;
    this.regions = [];
    this.prevRegions = [];
    this.marks = null;            // lettering boxes, when auditing
    this.obstacles = null;        // solid marks that lettering must not cross
  }

  // ── the collision audit ────────────────────────────────────────────────────
  // Overlapping labels are the commonest defect on a dense sheet and the hardest to catch by
  // looking, because the eye reads through them. A machine that lists them does not.
  obstacle(x, y, w, h, label = '') {
    if (this.obstacles) this.obstacles.push({ x, y, w, h, label });
  }

  collisions(tol = 0.6) {
    const out = [];
    const marks = this.marks || [];
    const over = (a, b) => {
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      return ox > tol && oy > tol ? ox * oy : 0;
    };
    for (let i = 0; i < marks.length; i++) {
      if (marks[i].angle) continue;                  // rotated lettering is not boxed
      for (let j = i + 1; j < marks.length; j++) {
        if (marks[j].angle) continue;
        const a = over(marks[i], marks[j]);
        if (a > 0) out.push({ kind: 'text/text', area: a,
                              a: marks[i].str, b: marks[j].str,
                              x: marks[i].x, y: marks[i].y });
      }
      if (marks[i].pocket) continue;                 // a label that owns its ground
      for (const ob of (this.obstacles || [])) {
        const a = over(marks[i], ob);
        if (a > 0) out.push({ kind: 'text/solid', area: a,
                              a: marks[i].str, b: ob.label || 'solid',
                              x: marks[i].x, y: marks[i].y });
      }
    }
    return out.sort((p, q) => q.area - p.area);
  }

  // Anything drawn outside the frame line is a defect, except the zone references, which
  // belong in the margin and say so.
  offSheet(sheet, margin = 10) {
    const BX = sheet[0] / 2 - margin, BY = sheet[1] / 2 - margin;
    const bad = [];
    for (const m of (this.marks || [])) {
      if (m.margin) continue;
      if (m.x < -BX - 0.5 || m.x + m.w > BX + 0.5 ||
          m.y < -BY - 0.5 || m.y + m.h > BY + 0.5) {
        bad.push({ str: m.str, x: +m.x.toFixed(1), y: +m.y.toFixed(1),
                   right: +(m.x + m.w).toFixed(1), top: +(m.y + m.h).toFixed(1) });
      }
    }
    return bad;
  }

  // ── regions ────────────────────────────────────────────────────────────────
  // A plate registers a named rectangle for anything a viewer might point at, in sheet mm, AS IT
  // DRAWS IT. Registration at draw time is why a hit-zone can never drift away from the mark it
  // belongs to — the commonest way an annotation layer goes quietly wrong.
  region(id, x, y, w, h, payload = null) {
    const r = { id, x, y, w, h, payload, area: w * h };
    this.regions.push(r);
    return r;
  }

  hitTest(mmX, mmY) {
    let best = null;
    for (const r of this.prevRegions) {
      if (mmX >= r.x && mmX <= r.x + r.w && mmY >= r.y && mmY <= r.y + r.h) {
        if (!best || r.area < best.area) best = r;   // smallest wins: the specific mark
      }
    }
    return best;
  }

  begin({ centre, mmPerPx, audit = false }) {
    const cv = this.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== W * dpr || cv.height !== H * dpr) {
      cv.width = W * dpr; cv.height = H * dpr;
    }
    this.dpr = dpr; this.w = W; this.h = H;
    this.centre = centre; this.mmPerPx = mmPerPx;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.clearRect(0, 0, W, H);
    this.ctx.lineCap = 'butt'; this.ctx.lineJoin = 'round';
    this.prevRegions = this.regions;
    this.regions = [];
    this.marks = audit ? [] : null;
    this.obstacles = audit ? [] : null;
    this.overflows = audit ? [] : null;
    if (audit) this.lcache.clear();   // re-wrap, so overflows are recounted honestly
    this.font = null; this.tracking = null;
  }

  // sheet mm → device-independent px
  x(mm) { return this.w * 0.5 + (mm - this.centre[0]) / this.mmPerPx; }
  y(mm) { return this.h * 0.5 - (mm - this.centre[1]) / this.mmPerPx; }
  p(pt) { return [this.x(pt[0]), this.y(pt[1])]; }
  s(mm) { return mm / this.mmPerPx; }
  // px → sheet mm (for pointer events)
  invX(px) { return this.centre[0] + (px - this.w * 0.5) * this.mmPerPx; }
  invY(px) { return this.centre[1] - (px - this.h * 0.5) * this.mmPerPx; }

  // Minimums are in DEVICE pixels — a hairline must stay a hairline on a retina panel, and
  // the floor is what a 0.13 pen becomes when the sheet is fitted to the board.
  lw(mm) { return Math.max(0.65 / this.dpr, this.s(mm)); }

  stroke({ weight = PEN.detail, colour = null, dash = null, alpha = 1 } = {}) {
    const ctx = this.ctx;
    ctx.lineWidth = this.lw(weight);
    ctx.strokeStyle = colour ?? this.ink.ink;
    ctx.globalAlpha = alpha;
    ctx.setLineDash(dash ? dash.map((d) => this.s(d)) : []);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  line(a, b, opts = {}) {
    const ctx = this.ctx;
    ctx.beginPath();
    const [ax, ay] = this.p(a), [bx, by] = this.p(b);
    ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
    this.stroke(opts);
  }

  polyline(pts, { close = false, fill = null, ...opts } = {}) {
    if (!pts.length) return;
    const ctx = this.ctx;
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const [px, py] = this.p(pt);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    if (close) ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (opts.weight !== 0) this.stroke(opts);
  }

  rect(x, y, w, h, opts = {}) {
    this.polyline([[x, y], [x + w, y], [x + w, y + h], [x, y + h]],
                  { close: true, ...opts });
    // Only ground declared SOLID is ground lettering may not cross. A panel's pale backing
    // fill is not solid — the sheet is meant to be written on it — so the caller says which
    // it is, and a label that legitimately sits on solid ground marks itself `pocket`.
    if (opts.solid) this.obstacle(x, y, w, h, opts.label || 'solid');
  }

  dot(c, r, { colour = null, hollow = false } = {}) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.x(c[0]), this.y(c[1]), this.s(r), 0, Math.PI * 2);
    if (hollow) {
      ctx.fillStyle = '#efece4'; ctx.fill();
      this.stroke({ weight: PEN.thin, colour });
    } else {
      ctx.fillStyle = colour ?? this.ink.ink; ctx.fill();
    }
  }

  arc(c, r, a0, a1, opts = {}) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.x(c[0]), this.y(c[1]), this.s(r), -a1, -a0);
    this.stroke(opts);
  }

  // A filled sector — used for the compute pie and gauge faces.
  sector(c, r0, r1, a0, a1, colour) {
    const ctx = this.ctx;
    const [cx, cy] = this.p(c);
    ctx.beginPath();
    ctx.arc(cx, cy, this.s(r1), -a1, -a0);
    ctx.arc(cx, cy, this.s(r0), -a0, -a1, true);
    ctx.closePath();
    ctx.fillStyle = colour; ctx.fill();
  }

  arrowHead(at, angle, { size = 2.4, colour = null } = {}) {
    const ctx = this.ctx;
    const [px, py] = this.p(at);
    const s = this.s(size);
    ctx.save(); ctx.translate(px, py); ctx.rotate(-angle);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-s, s * 0.30); ctx.lineTo(-s, -s * 0.30);
    ctx.closePath();
    ctx.fillStyle = colour ?? this.ink.ink; ctx.fill();
    ctx.restore();
  }

  arrow(a, b, opts = {}) {
    this.line(a, b, opts);
    this.arrowHead(b, Math.atan2(b[1] - a[1], b[0] - a[0]), opts);
  }

  // ── hatching. A clipped fill of parallel lines: the drafting way to say "this is material",
  // and the only honest way to shade a band on a document that has no greys of its own.
  hatch(box, { spacing = 1.6, angle = Math.PI / 4, weight = PEN.hairline,
               colour = null, path = null } = {}) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    if (path) { path(this); } else {
      const [x0, y0, w, h] = box;
      const [px, py] = this.p([x0, y0 + h]);
      ctx.rect(px, py, this.s(w), this.s(h));
    }
    ctx.clip();
    const [bx, by, bw, bh] = box;
    const diag = Math.hypot(bw, bh);
    const dx = Math.cos(angle), dy = Math.sin(angle);
    const n = Math.ceil((diag * 2) / spacing);
    const cx = bx + bw / 2, cy = by + bh / 2;
    ctx.beginPath();
    for (let i = -n; i <= n; i++) {
      const ox = cx + (-dy) * i * spacing, oy = cy + dx * i * spacing;
      const a = this.p([ox - dx * diag, oy - dy * diag]);
      const b = this.p([ox + dx * diag, oy + dy * diag]);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    this.stroke({ weight, colour: colour ?? this.ink.inkLight });
    ctx.restore();
  }

  clip(box, fn) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    const [x0, y0, w, h] = box;
    const [px, py] = this.p([x0, y0 + h]);
    ctx.rect(px, py, this.s(w), this.s(h));
    ctx.clip();
    fn(this);
    ctx.restore();
  }

  fillPoly(pts, colour) {
    if (pts.length < 3) return;
    const ctx = this.ctx;
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const [px, py] = this.p(pt);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = colour; ctx.fill();
  }

  // ── lettering ──────────────────────────────────────────────────────────────
  // Sized by CAP HEIGHT in mm, as a stencil is. Below legibility we do not draw mush.
  text(pos, str, {
    size = 2.5, colour = null, align = 'left', track = 0.10,
    face = 'draft', weight = 500, angle = 0, alpha = 1, pocket = false,
  } = {}) {
    const ctx = this.ctx;
    const px = this.s(size) * 1.34;
    const wMM = this.textWidth(str, { size, track, face, weight });
    // Recorded BEFORE the legibility cull: a label too small to draw at this zoom is still a
    // label that will overprint at another, and an audit that could not see it would report a
    // dense sheet clean.
    if (this.marks) {
      this.marks.push({
        str: String(str), size, angle, margin: !!this.inMargin, pocket,
        x: align === 'center' ? pos[0] - wMM / 2 : align === 'right' ? pos[0] - wMM : pos[0],
        y: pos[1] - size * 0.24, w: wMM, h: size * 1.28,
      });
    }
    // Below legibility we do not draw mush. The threshold is in DEVICE pixels, so a fitted
    // sheet on a retina panel keeps its small print — measuring it in CSS pixels culled
    // every label under 2.5 mm and emptied the sheet.
    if (px * this.dpr < 4.2) return wMM;
    const f = `${weight} ${px.toFixed(2)}px ${face === 'figure' ? FIGURE_FACE : DRAFT_FACE}`;
    if (this.font !== f) { ctx.font = f; this.font = f; }
    ctx.fillStyle = colour ?? this.ink.ink;
    ctx.globalAlpha = alpha;
    ctx.textBaseline = 'alphabetic';
    const s = String(str);
    const tr = px * track;
    // Tracking through ctx.letterSpacing and ONE fillText. Setting it per glyph — a loop of
    // fillText+measureText per character — cost 22,568 measureText and 11,284 fillText calls
    // in a single frame of this sheet, which is what made it lag.
    const spaced = HAS_SPACING;
    if (spaced) {
      const ls = `${tr.toFixed(3)}px`;
      if (this.tracking !== ls) { ctx.letterSpacing = ls; this.tracking = ls; }
    }
    const w = wMM / this.mmPerPx;
    let [X, Y] = this.p(pos);
    if (align === 'center') X -= w / 2; else if (align === 'right') X -= w;
    if (angle) { ctx.save(); ctx.translate(X, Y); ctx.rotate(-angle); X = 0; Y = 0; }
    if (spaced) {
      ctx.fillText(s, X, Y);
    } else {
      let cx = X;
      for (const ch of s) { ctx.fillText(ch, cx, Y); cx += ctx.measureText(ch).width + tr; }
    }
    if (angle) ctx.restore();
    ctx.globalAlpha = 1;
    return wMM;                   // width in mm, for callers that must not collide
  }

  // Measured ONCE per string at a fixed 100 px reference and cached forever, returned in mm
  // of sheet per mm of cap height — so it is zoom-independent, and wrap() can cache too.
  textWidth(str, { size = 2.5, track = 0.10, face = 'draft', weight = 500 } = {}) {
    const key = `${face}|${weight}|${track}|${str}`;
    let per = this.wcache.get(key);
    if (per === undefined) {
      const ctx = this.ctx;
      const REF = 100;
      ctx.font = `${weight} ${REF}px ${face === 'figure' ? FIGURE_FACE : DRAFT_FACE}`;
      if (HAS_SPACING) ctx.letterSpacing = `${REF * track}px`;
      per = (ctx.measureText(String(str)).width / REF) * 1.34;
      if (HAS_SPACING) ctx.letterSpacing = '0px';
      this.font = null; this.tracking = null;
      this.wcache.set(key, per);
    }
    return per * size;
  }

  // Cached, because the notes column fits itself by re-wrapping the whole column up to ten
  // times per frame at descending sizes. Zoom-independent, so the cache never needs clearing.
  wrap(str, widthMM, opts = {}) {
    const key = `${opts.face || 'draft'}|${opts.weight || 500}|${opts.track ?? 0.1}|` +
                `${opts.size ?? 2.5}|${widthMM.toFixed(2)}|${str}`;
    let lines = this.lcache.get(key);
    if (lines) return lines;
    // A token wider than the column — a citation slug like
    // `analysis/coordinated-slowdown-proposals` — cannot be pushed to the next line, so an
    // unbroken wrap simply runs it off the column. Break it, preferring the separators the
    // slug already has, and only then by character.
    const words = [];
    for (const raw of String(str).split(/\s+/)) {
      if (this.textWidth(raw, opts) <= widthMM) { words.push(raw); continue; }
      let piece = '';
      for (const part of raw.split(/(?<=[/·—-])/)) {
        if (this.textWidth(piece + part, opts) <= widthMM) { piece += part; continue; }
        if (piece) { words.push(piece); piece = ''; }
        if (this.textWidth(part, opts) <= widthMM) { piece = part; continue; }
        for (const ch of part) {                       // last resort: by character
          if (this.textWidth(piece + ch, opts) > widthMM && piece) { words.push(piece); piece = ''; }
          piece += ch;
        }
      }
      if (piece) words.push(piece);
    }
    lines = []; let cur = '';
    for (const word of words) {
      const trial = cur ? cur + ' ' + word : word;
      if (this.textWidth(trial, opts) > widthMM && cur) { lines.push(cur); cur = word; }
      else cur = trial;
    }
    if (cur) lines.push(cur);
    if (this.marks) {
      for (const ln of lines) {
        if (this.textWidth(ln, opts) > widthMM + 0.4) {
          (this.overflows = this.overflows || []).push({ str: ln, widthMM });
        }
      }
    }
    this.lcache.set(key, lines);
    return lines;
  }

  // Justified small print, as a notes column is set.
  textBlock(pos, str, widthMM, { size = 2.0, lead = 1.42, colour = null,
                                 track = 0.06, weight = 400, max = 999 } = {}) {
    const lines = this.wrap(str, widthMM, { size, track, weight });
    let y = pos[1];
    let n = 0;
    for (const ln of lines) {
      if (n >= max) break;
      this.text([pos[0], y], ln, { size, colour, track, weight });
      y -= size * lead; n++;
    }
    return pos[1] - y;            // height consumed, mm
  }

  // ── dimensions, leaders, callouts ──────────────────────────────────────────
  dimH(x0, x1, y, label, { colour = null, ext = 1.6, size = 1.9 } = {}) {
    const c = colour ?? this.ink.inkLight;
    this.line([x0, y - ext], [x0, y + ext], { weight: PEN.hairline, colour: c });
    this.line([x1, y - ext], [x1, y + ext], { weight: PEN.hairline, colour: c });
    this.line([x0, y], [x1, y], { weight: PEN.hairline, colour: c });
    this.arrowHead([x0, y], Math.PI, { size: 1.6, colour: c });
    this.arrowHead([x1, y], 0, { size: 1.6, colour: c });
    if (label) {
      const w = this.textWidth(label, { size });
      const mid = (x0 + x1) / 2;
      this.text([mid, y + 0.9], label, { size, align: 'center', colour: c, face: 'figure' });
    }
  }

  leader(from, to, str, { colour = null, size = 2.0, align = 'left', gap = 0.9 } = {}) {
    const c = colour ?? this.ink.inkLight;
    this.line(from, to, { weight: PEN.hairline, colour: c });
    this.dot(from, 0.35, { colour: c });
    const tx = align === 'right' ? to[0] - gap : to[0] + gap;
    this.text([tx, to[1] - size * 0.35], str, { size, colour: c, align });
  }

  // A note card printed on the sheet — the drafting equivalent of a callout box.
  noteCard(at, title, lines, { width = 60, colour = null } = {}) {
    const c = colour ?? this.ink.ink;
    const size = 1.9;
    const wrapped = [];
    for (const ln of lines) wrapped.push(...this.wrap(ln, width - 5, { size }));
    const h = 6.5 + wrapped.length * size * 1.5;
    const [x, y] = at;
    this.rect(x, y - h, width, h, { weight: PEN.thin, colour: c,
                                    fill: 'rgba(255,253,246,0.72)' });
    this.line([x, y - 5.2], [x + width, y - 5.2], { weight: PEN.hairline, colour: this.ink.inkLight });
    this.text([x + 2.4, y - 3.6], title, { size: 1.9, colour: c, weight: 700, track: 0.16 });
    let yy = y - 8.2;
    for (const ln of wrapped) {
      this.text([x + 2.4, yy], ln, { size, colour: this.ink.pencil, track: 0.04 });
      yy -= size * 1.5;
    }
    return h;
  }

  // ── the sheet ──────────────────────────────────────────────────────────────
  border(sheet, margin = 10) {
    // The zone references belong OUTSIDE the frame line — that is what a margin is for — so
    // they are flagged and the off-sheet check ignores them. Nothing else may be.
    this.inMargin = true;
    try { this.#border(sheet, margin); } finally { this.inMargin = false; }
  }

  #border(sheet, margin = 10) {
    const [W, H] = sheet;
    const x0 = -W / 2 + margin, x1 = W / 2 - margin;
    const y0 = -H / 2 + margin, y1 = H / 2 - margin;
    this.polyline([[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
                  { close: true, weight: PEN.border, colour: this.ink.ink });
    this.polyline([[x0 + 2, y0 + 2], [x1 - 2, y0 + 2], [x1 - 2, y1 - 2], [x0 + 2, y1 - 2]],
                  { close: true, weight: PEN.hairline, colour: this.ink.inkLight });
    const cols = 8, rows = 6;
    for (let i = 0; i < cols; i++) {
      const cx = x0 + (i + 0.5) * (x1 - x0) / cols;
      const tick = x0 + (i + 1) * (x1 - x0) / cols;
      if (i < cols - 1) {
        this.line([tick, y0], [tick, y0 + 2], { weight: PEN.hairline, colour: this.ink.inkLight });
        this.line([tick, y1 - 2], [tick, y1], { weight: PEN.hairline, colour: this.ink.inkLight });
      }
      this.text([cx, y0 - 3.4], String(cols - i),
                { size: 2.0, align: 'center', colour: this.ink.inkLight, face: 'figure' });
      this.text([cx, y1 + 1.6], String(cols - i),
                { size: 2.0, align: 'center', colour: this.ink.inkLight, face: 'figure' });
    }
    for (let i = 0; i < rows; i++) {
      const cy = y0 + (i + 0.5) * (y1 - y0) / rows;
      const tick = y0 + (i + 1) * (y1 - y0) / rows;
      if (i < rows - 1) {
        this.line([x0, tick], [x0 + 2, tick], { weight: PEN.hairline, colour: this.ink.inkLight });
        this.line([x1 - 2, tick], [x1, tick], { weight: PEN.hairline, colour: this.ink.inkLight });
      }
      const letter = String.fromCharCode(65 + i);
      this.text([x0 - 2.2, cy - 0.7], letter, { size: 2.0, align: 'center', colour: this.ink.inkLight });
      this.text([x1 + 2.2, cy - 0.7], letter, { size: 2.0, align: 'center', colour: this.ink.inkLight });
    }
    for (const [a, b] of [[[0, y0 - 1], [0, y0 + 4]], [[0, y1 - 4], [0, y1 + 1]],
                          [[x0 - 1, 0], [x0 + 4, 0]], [[x1 - 4, 0], [x1 + 1, 0]]]) {
      this.line(a, b, { weight: PEN.medium, colour: this.ink.inkLight });
    }
  }

  titleBlock(sheet, rows, { margin = 10, w = 132, h = 40 } = {}) {
    const [W, H] = sheet;
    const x1 = W / 2 - margin - 2, y0 = -H / 2 + margin + 2;
    const x0 = x1 - w, y1 = y0 + h;
    this.rect(x0, y0, w, h, { weight: PEN.medium, colour: this.ink.ink,
                              fill: 'rgba(255,253,246,0.55)' });
    const n = rows.length, rh = h / n;
    rows.forEach((r, i) => {
      const ry = y1 - (i + 1) * rh;
      if (i) this.line([x0, ry + rh], [x1, ry + rh],
                       { weight: PEN.hairline, colour: this.ink.inkLight });
      this.text([x0 + 2.5, ry + rh * 0.60], r[0],
                { size: 1.6, colour: this.ink.inkLight, track: 0.18 });
      this.text([x0 + 2.5, ry + rh * 0.17], r[1],
                { size: r[2] ?? 2.6, colour: this.ink.ink, weight: 600, track: 0.06 });
    });
  }

  // A section header, as this house sets them: rule, name, and a line of small print under it
  // saying what the reader is looking at.
  header(x, y, title, sub, { width = 0, colour = null } = {}) {
    const c = colour ?? this.ink.ink;
    this.text([x, y], title, { size: 3.0, colour: c, weight: 700, track: 0.20 });
    if (width) this.line([x, y - 1.6], [x + width, y - 1.6],
                         { weight: PEN.thin, colour: this.ink.inkLight });
    if (sub) this.text([x, y - 4.2], sub,
                       { size: 1.7, colour: this.ink.pencilLight, track: 0.14 });
    return y - (sub ? 7.4 : 4.2);
  }

  // The scalloped outline a draughtsman rings a change with. Here it rings whatever the
  // evidence moved this morning — a real convention doing real work.
  revisionCloud(x, y, w, h, { colour = null, bump = 2.4 } = {}) {
    const c = colour ?? this.ink.red;
    const ctx = this.ctx;
    ctx.beginPath();
    const per = Math.max(8, Math.round((2 * (w + h)) / bump));
    for (let i = 0; i <= per; i++) {
      const u = (i / per) * 2 * (w + h);
      let pt;
      if (u < w) pt = [x + u, y];
      else if (u < w + h) pt = [x + w, y + (u - w)];
      else if (u < 2 * w + h) pt = [x + w - (u - w - h), y + h];
      else pt = [x, y + h - (u - 2 * w - h)];
      const [sx, sy] = this.p(pt);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.arcTo(sx, sy, sx, sy, this.s(bump * 0.5));
    }
    ctx.closePath();
    this.stroke({ weight: PEN.thin, colour: c });
  }
}

// ── the paper ────────────────────────────────────────────────────────────────
// Drawn once to its own canvas at 1×: tooth, a faint fibre grain, foxing, and the shadow the
// sheet casts on the board. The ink layer multiplies into this, so the paper is never covered.
// The sheet's material is generated ONCE, at a fixed resolution, into its own canvas: tooth,
// foxing and the tonal drift of a long roll. Panning and zooming then blit it. Regenerating a
// per-pixel noise field on every pointer move — which is what this did first — costs tens of
// milliseconds a frame and is the whole reason the board felt heavy.
const PAPER_PX = 1500;                      // texture resolution across the sheet's long edge
let paperTile = null;

function makePaperTile(aspect) {
  const w = PAPER_PX, h = Math.round(PAPER_PX / aspect);
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  let seed = 20260811;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 7.5;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n * 0.96));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * 0.86));
  }
  ctx.putImageData(img, 0, 0);
  for (let i = 0; i < 26; i++) {
    const fx = rnd() * w, fy = rnd() * h, fr = (8 + rnd() * 46) * (w / 900);
    const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
    g.addColorStop(0, 'rgba(176,146,96,0.055)');
    g.addColorStop(1, 'rgba(176,146,96,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fill();
  }
  return cv;
}

export function drawPaper(cv, sheetRect) {
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = cv.clientWidth, H = cv.clientHeight;
  if (cv.width !== W * dpr || cv.height !== H * dpr) {
    cv.width = W * dpr; cv.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#e6e2d8';
  ctx.fillRect(0, 0, W, H);
  const [sx, sy, sw, sh] = sheetRect;
  if (!(sw > 0 && sh > 0)) return;
  if (!paperTile) paperTile = makePaperTile(sw / sh);
  ctx.save();
  ctx.shadowColor = 'rgba(40,34,24,0.34)';
  ctx.shadowBlur = 26; ctx.shadowOffsetY = 7;
  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(sx, sy, sw, sh);
  ctx.restore();
  ctx.drawImage(paperTile, sx, sy, sw, sh);
}
