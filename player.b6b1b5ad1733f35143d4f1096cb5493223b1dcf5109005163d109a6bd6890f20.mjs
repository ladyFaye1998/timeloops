import { installChunkFetch } from './chunk-fetch.5db43716d7a11a9b9c2b75a2ec4e8cf37bcd11454bcb1573c860c0b38619e9ca.mjs';
import { installAudioUnlock } from './audio-unlock.dfc0ba3caa3f4dbaca0bc6b570f0b5dd5df98b2b202b9aaf6d593089605f275e.mjs';
import { installLanguagePicker } from './languages.758b50e42056d9a4b99e79e1dd637c43fe961b60f11d4170860a60e7b8a189cd.mjs';

const config = JSON.parse(document.getElementById('game-config').textContent);
const boot = JSON.parse(document.getElementById('web-config').textContent);
const canvas = document.getElementById('canvas');
const stage = document.getElementById('stage');
const loading = document.getElementById('loading');
const status = document.getElementById('status');
const progress = document.getElementById('progress');
const retry = document.getElementById('retry');
let failed = false;
const language = installLanguagePicker();
installAudioUnlock();

function resizeCanvas() {
  const rect = stage.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
}
new ResizeObserver(resizeCanvas).observe(stage);
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function showError(error) {
  if (failed) return;
  failed = true;
  loading.hidden = false;
  document.body.dataset.state = 'error';
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
