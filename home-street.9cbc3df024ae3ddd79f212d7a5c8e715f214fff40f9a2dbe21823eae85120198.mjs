// Standing Julia: a neutral body with registered, local head/eyelid drawings.
// Source PNGs are never rewritten. Rectangles below are supplied by the art
// registration, in one tile's source pixels, as [x, y, width, height].
const MOODS = { idle: 0, profile: 0, ready: 2, thinking: 3, surprised: 3 };
const BLINK_DELAYS = [4100, 4700, 3900, 5200];

function smooth(low, high, value) {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return t * t * (3 - 2 * t);
}
function rect(value, width, height) {
  if (!Array.isArray(value) || value.length !== 4 || !value.every(Number.isFinite)) return null;
  const [x, y, w, h] = value;
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > width || y + h > height) return null;
  if (![x, y, w, h].every(Number.isInteger)) return null;
  return { x, y, width: w, height: h };
}
function surface(document, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Standing Julia needs Canvas 2D.');
  return { canvas, context };
}
function loadImage(document, url) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error('The standing Julia atlas URL is missing.'));
    const image = document.createElement('img');
    image.decoding = 'async'; image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The standing Julia atlas could not load.'));
    image.src = url;
  });
}
function sample(data, width, height, x, y, out) {
  out.fill(0);
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
    const px = Math.min(width - 1, ix + dx), py = Math.min(height - 1, iy + dy);
    const offset = (py * width + px) * 4;
    const weight = (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy);
    for (let channel = 0; channel < 4; channel++) out[channel] += data[offset + channel] * weight;
  }
}
function prepare(document, image, registration = {}) {
  if (image.naturalWidth % 2 || image.naturalHeight % 2 || image.naturalWidth < 128 || image.naturalHeight < 128) {
    throw new Error('The standing Julia atlas must be a regular 2×2 sheet.');
  }
  const width = image.naturalWidth / 2, height = image.naturalHeight / 2;
  const tilePixels = [];
  for (let frame = 0; frame < 4; frame++) {
    const tile = surface(document, width, height);
    tile.context.drawImage(image, (frame % 2) * width, Math.floor(frame / 2) * height, width, height, 0, 0, width, height);
    tilePixels.push(tile.context.getImageData(0, 0, width, height));
    tile.canvas.width = tile.canvas.height = 1;
  }
  const neutral = tilePixels[0].data;
  let left = width, top = height, right = 0, bottom = 0, transparent = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const alpha = neutral[(y * width + x) * 4 + 3];
    if (!alpha) transparent++;
    if (alpha > 183) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x + 1); bottom = Math.max(bottom, y + 1); }
  }
  if (right <= left || transparent < width * height * 0.05) throw new Error('Standing Julia needs a genuine transparent cutout.');
  const clean = registration.alphaCleanup !== false;
  const cleanAlpha = alpha => clean ? alpha * smooth(0.18, 0.72, alpha / 255) : alpha;
  const body = surface(document, width, height);
  const bodyPixels = body.context.createImageData(width, height);
  bodyPixels.data.set(neutral);
  for (let offset = 3; offset < bodyPixels.data.length; offset += 4) bodyPixels.data[offset] = cleanAlpha(bodyPixels.data[offset]);
  body.context.putImageData(bodyPixels, 0, 0);
  const head = rect(registration.head, width, height), eyes = rect(registration.eyes, width, height);
  const feather = Number.isFinite(registration.feather) ? Math.max(0, registration.feather) : 2;
  const patches = new Map();
  const sampled = new Float64Array(4);
  for (const frame of [1, 2, 3]) {
    const bounds = frame === 1 ? eyes : head;
    if (!bounds) continue;
    const offset = registration.offsets?.[frame] || [0, 0];
    if (!Array.isArray(offset) || !offset.every(Number.isFinite) || offset.length !== 2) throw new Error('Invalid standing Julia registration offset.');
    const patch = surface(document, bounds.width, bounds.height);
    const output = patch.context.createImageData(bounds.width, bounds.height);
    for (let y = 0; y < bounds.height; y++) for (let x = 0; x < bounds.width; x++) {
      const px = bounds.x + x, py = bounds.y + y;
      // offsets translate the source pose INTO neutral registration:
      // e.g. pose 1 is 30px left, so offsets[1]=[30,0].
      sample(tilePixels[frame].data, width, height, px - offset[0], py - offset[1], sampled);
      const baseOffset = (py * width + px) * 4, out = (y * bounds.width + x) * 4;
      const edge = Math.min(x + 0.5, y + 0.5, bounds.width - x - 0.5, bounds.height - y - 0.5);
      let mix = feather ? smooth(0, feather, edge) : 1;
      if (frame === 1) mix *= smooth(0.90, 0.99, sampled[3] / 255);
      if (frame !== 1 && Array.isArray(registration.neckFade) && registration.neckFade.length === 2) {
        mix *= 1 - smooth(registration.neckFade[0], registration.neckFade[1], py + 0.5);
      }
      for (let channel = 0; channel < 4; channel++) {
        output.data[out + channel] = frame === 1 && channel === 3 ? neutral[baseOffset + 3] :
          neutral[baseOffset + channel] + (sampled[channel] - neutral[baseOffset + channel]) * mix;
      }
      output.data[out + 3] = cleanAlpha(output.data[out + 3]);
    }
    patch.context.putImageData(output, 0, 0);
    patches.set(frame, { canvas: patch.canvas, bounds });
  }
  return { body: body.canvas, patches, width, height, contentBounds: [left, top, right - left, bottom - top], head, eyes };
}

/**
 * registration: {head:[x,y,w,h], eyes:[x,y,w,h],
 * offsets:{1:[30,0],2:[0,0],3:[30,0]}, feather:2,
 * neckFade?:[startY,endY], alphaCleanup?:false}.
 * Without valid head/eye rectangles only the genuine neutral pose is shown.
 */
export function createStreetActor(canvas, { assets = {}, reducedMotion = false, registration = {}, onDraw } = {}) {
  const document = canvas?.ownerDocument || globalThis.document;
  let context = null;
  try { context = canvas?.getContext?.('2d', { alpha: true }); } catch {}
  let disposed = false, loaded = false, requestedVisible = true, reduced = Boolean(reducedMotion);
  let mood = 'idle', targetFrame = 0, headFrame = 0, renderedBlink = false, blink = false;
  let prepared = null, framesDrawn = 0, blinkTimer = null, blinkEnd = null, cadence = 0;
  let error = !context || !document ? 'Canvas 2D is unavailable.' : '';
  let callbackError = '';
  const active = () => !disposed && loaded && requestedVisible && !document?.hidden;
  function stop() {
    if (blinkTimer !== null) clearTimeout(blinkTimer);
    if (blinkEnd !== null) clearTimeout(blinkEnd);
    blinkTimer = blinkEnd = null; blink = false;
  }
  function actualFrame() { return prepared?.patches.has(targetFrame) && targetFrame !== 1 ? targetFrame : 0; }
  function draw(force = false) {
    if (!active() || !prepared) return;
    const frame = actualFrame(), closed = blink && frame === 0 && prepared.patches.has(1);
    if (!force && framesDrawn && frame === headFrame && closed === renderedBlink) return;
    context.clearRect(0, 0, prepared.width, prepared.height);
    context.drawImage(prepared.body, 0, 0);
    const patch = prepared.patches.get(closed ? 1 : frame);
    if (patch) {
      context.clearRect(patch.bounds.x, patch.bounds.y, patch.bounds.width, patch.bounds.height);
      context.drawImage(patch.canvas, patch.bounds.x, patch.bounds.y);
    }
    headFrame = frame; renderedBlink = closed; framesDrawn++;
    if (typeof onDraw === 'function') {
      try { onDraw(); } catch (reason) { callbackError = reason?.message || String(reason); }
    }
  }
  function scheduleBlink() {
    // Frame 1 is the authored neutral-angle blink. Never paste those eyelids
    // onto a differently angled head; gesture poses return to idle via the UI.
    if (!active() || reduced || actualFrame() !== 0 || !prepared.patches.has(1) || blinkTimer !== null || blinkEnd !== null) return;
    blinkTimer = setTimeout(() => {
      blinkTimer = null;
      if (!active() || reduced || actualFrame() !== 0) return;
      blink = true; draw();
      blinkEnd = setTimeout(() => {
        blinkEnd = null;
        if (!active() || reduced) return;
        blink = false; draw(); scheduleBlink();
      }, 125);
    }, BLINK_DELAYS[cadence++ % BLINK_DELAYS.length]);
  }
  function sync() { stop(); if (active()) { draw(); scheduleBlink(); } }
  const api = {
    setMood(name) {
      if (disposed) return;
      const next = Object.hasOwn(MOODS, name) ? name : 'idle';
      if (next === mood) return;
      mood = next; targetFrame = MOODS[mood]; sync();
    },
    setReducedMotion(value) {
      if (disposed || Boolean(value) === reduced) return;
      reduced = Boolean(value); sync();
    },
    setVisible(value) {
      if (disposed || Boolean(value) === requestedVisible) return;
      requestedVisible = Boolean(value); sync();
    },
    destroy() {
      if (disposed) return;
      stop(); disposed = true;
      document?.removeEventListener?.('visibilitychange', sync);
      if (prepared) for (const item of [prepared.body, ...[...prepared.patches.values()].map(patch => patch.canvas)]) item.width = item.height = 1;
      prepared = null;
    },
    snapshot() {
      return { ready: loaded, fallback: Boolean(error), error, callbackError, mood, frame: renderedBlink ? 1 : headFrame, headFrame,
        blink: renderedBlink, targetFrame, framesDrawn, reduced, visible: !disposed && requestedVisible && !document?.hidden,
        animating: false, blinkScheduled: blinkTimer !== null || blinkEnd !== null, destroyed: disposed,
        registered: Boolean(prepared?.head), blinkRegistered: Boolean(prepared?.eyes),
        sourceSize: prepared ? [prepared.width, prepared.height] : null,
        contentBounds: prepared ? [...prepared.contentBounds] : null,
        headBounds: prepared?.head ? [prepared.head.x, prepared.head.y, prepared.head.width, prepared.head.height] : null,
        eyeBounds: prepared?.eyes ? [prepared.eyes.x, prepared.eyes.y, prepared.eyes.width, prepared.eyes.height] : null };
    },
    ready: null,
  };
  if (error) { api.ready = Promise.resolve(false); return api; }
  document.addEventListener('visibilitychange', sync);
  api.ready = loadImage(document, assets.standingAtlas).then(image => {
    if (disposed) return false;
    prepared = prepare(document, image, registration || {});
    canvas.width = prepared.width; canvas.height = prepared.height;
    loaded = true; draw(true); scheduleBlink(); return true;
  }).catch(reason => { if (!disposed) { error = reason?.message || String(reason); stop(); } return false; });
  return api;
}
