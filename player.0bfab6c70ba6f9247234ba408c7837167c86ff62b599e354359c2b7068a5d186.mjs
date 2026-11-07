import { installChunkFetch } from './chunk-fetch.5db43716d7a11a9b9c2b75a2ec4e8cf37bcd11454bcb1573c860c0b38619e9ca.mjs';
import { installAudioUnlock } from './audio-unlock.dfc0ba3caa3f4dbaca0bc6b570f0b5dd5df98b2b202b9aaf6d593089605f275e.mjs';
import { installLanguagePicker } from './languages.bdc77e3ff797c87d3c9eb9ef28f1e34d03be2a6a4b256fafa1df20897a07ad8b.mjs';

const config = JSON.parse(document.getElementById('game-config').textContent);
const boot = JSON.parse(document.getElementById('web-config').textContent);
const canvas = document.getElementById('canvas');
const stage = document.getElementById('stage');
const loading = document.getElementById('loading');
const loadingJulia = document.getElementById('loading-julia');
const status = document.getElementById('status');
const progress = document.getElementById('progress');
const retry = document.getElementById('retry');
let failed = false;
const language = installLanguagePicker();
installAudioUnlock();
// The animated home is optional presentation. A failed asset/module must never
// prevent the original game's automatic startup or native menu fallback.
const homeConfig = document.getElementById('home-config');
if (homeConfig) {
  void import('./home.3e4f8aa5fd00709badf8856c2e4ba6391363b6bca7e038e5d9001c372630c8d4.mjs').then(({ installHomeMenu }) => {
    const home = installHomeMenu({ canvas, stage, config: JSON.parse(homeConfig.textContent) });
    return home?.ready;
  }).catch(error => console.warn('Animated home unavailable; native menu remains available:', error?.message || String(error)));
}

function layoutLoadingJulia() {
  if (!loadingJulia?.style || loading.hidden || typeof loading.getBoundingClientRect !== 'function') return;
  const rect = loading.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const portrait = rect.height > rect.width;
  const plateWidth = portrait ? 852 : 1672, plateHeight = portrait ? 1846 : 941;
  const coverScale = Math.max(rect.width / plateWidth, rect.height / plateHeight);
  const worldWidth = plateWidth * coverScale, worldHeight = plateHeight * coverScale;
  const worldX = (rect.width - worldWidth) / 2, worldY = (rect.height - worldHeight) / 2;
  const characterScale = portrait ? .94 * coverScale : Math.min(worldWidth * .30 / 264, worldHeight * (.925 - .36) / 706);
  loadingJulia.style.width = `${543 * characterScale}px`;
  loadingJulia.style.height = `${724 * characterScale}px`;
  loadingJulia.style.left = `${portrait ? worldX + 690 * coverScale - 403 * characterScale : worldX + worldWidth * .68 - (156 + 264 / 2) * characterScale}px`;
  loadingJulia.style.top = `${portrait ? worldY + 922 * coverScale - 356 * characterScale : worldY + worldHeight * .36 - 10 * characterScale}px`;
}

function resizeCanvas() {
  const rect = stage.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  layoutLoadingJulia();
}
loadingJulia?.addEventListener?.('load', layoutLoadingJulia);
new ResizeObserver(resizeCanvas).observe(stage);
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function showError(error) {
  if (failed) return;
  failed = true;
  loading.hidden = false;
  document.body.dataset.state = 'error';
  layoutLoadingJulia();
  language.showStatus('error');
  console.warn('Game startup failed:', error?.message || String(error));
  retry.hidden = false;
  progress.hidden = true;
  retry.focus();
}
retry.addEventListener('click', () => location.reload());
document.addEventListener('fullscreenchange', resizeCanvas);

async function loadScript(path) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = path;
    script.onload = resolve;
    script.onerror = () => reject(new Error('The game engine could not be loaded.'));
    document.head.append(script);
  });
}

async function startGame() {
  document.body.dataset.state = 'loading';
  progress.hidden = false;
  language.showStatus('loading');
  try {
    if (!globalThis.WebAssembly || !globalThis.ReadableStream || !crypto.subtle) {
      throw new Error('Use a current browser with WebAssembly over HTTPS.');
    }
    const response = await fetch(boot.manifest, { cache: 'no-cache', credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Download details returned ${response.status}.`);
    const manifest = await response.json();
    if (manifest.commit !== boot.commit) throw new Error('This page was updated. Reload it to continue.');
    installChunkFetch(manifest, { onError: showError, onProgress(current, total) {
      // WASM and PCK downloads overlap. A later progress callback must not
      // replace the first actionable failure with a download-size message.
      if (failed) return;
      progress.max = total;
      progress.value = current;
      language.showStatus(current === total ? 'opening' : 'loading');
    } });
    await loadScript(boot.engine);
    const missing = Engine.getMissingFeatures({ threads: false });
    if (missing.length) throw new Error(`This browser needs ${missing.join(', ')}.`);
    const engine = new Engine({ ...config, canvas, canvasResizePolicy: 0,
      experimentalVK: true, persistentPaths: ['/userfs'], serviceWorker: '',
      onPrint: (...parts) => console.log(...parts),
      onPrintError: (...parts) => console.error(...parts),
      onExit(code) { showError(new Error(code ? `The game closed (${code}).` : 'The game has closed.')); },
    });
    await engine.startGame();
    // Let the initialized engine present before removing the home art.
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    if (failed) return;
    loading.hidden = true;
    document.body.dataset.state = 'playing';
    canvas.focus();
    resizeCanvas();
  } catch (error) { showError(error); }
}

// The link opens the game directly; its actual menu owns New Game.
void startGame();
