import { createStreetActor } from './home-street.9cbc3df024ae3ddd79f212d7a5c8e715f214fff40f9a2dbe21823eae85120198.mjs';

const LANGUAGES = [['he', 'עברית'], ['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'], ['pl', 'Polski'], ['ru', 'Русский'], ['cs', 'Čeština'], ['nl', 'Nederlands']];
const COPY = {
  en: { signature: 'Flower Girl', menu: ['New game', 'Continue', 'Settings', 'Language', 'Edition', 'Remastered', 'Original', 'Full screen'] },
  he: { signature: 'ילדת הפרחים', menu: ['משחק חדש', 'המשך', 'הגדרות', 'שפה', 'גרסה', 'מחודש', 'מקורי', 'מסך מלא'] },
  fr: { signature: 'Flower Girl', menu: ['Nouvelle partie', 'Continuer', 'Options', 'Langue', 'Version', 'Remastérisée', 'Originale', 'Plein écran'] },
  de: { signature: 'Blumenmädchen', menu: ['Neues Spiel', 'Fortsetzen', 'Einstellungen', 'Sprache', 'Version', 'Überarbeitet', 'Original', 'Vollbild'] },
  pl: { signature: 'Dziewczyna kwiatów', menu: ['Nowa gra', 'Kontynuuj', 'Ustawienia', 'Język', 'Wersja', 'Odnowiona', 'Oryginalna', 'Pełny ekran'] },
  ru: { signature: 'Дети цветов', menu: ['Новая игра', 'Продолжить', 'Настройки', 'Язык', 'Версия', 'Обновлённая', 'Оригинальная', 'Полный экран'] },
  cs: { signature: 'Květinová dívka', menu: ['Nová hra', 'Pokračovat', 'Nastavení', 'Jazyk', 'Verze', 'Obnovená', 'Původní', 'Celá obrazovka'] },
  nl: { signature: 'Sweet Sixties', menu: ['Nieuw spel', 'Doorgaan', 'Instellingen', 'Taal', 'Versie', 'Vernieuwd', 'Origineel', 'Volledig scherm'] },
};
const KEYS = ['newGame', 'continue', 'settings', 'language', 'edition', 'modern', 'legacy', 'fullscreen'];
const SECRETS = {
  en: ['San Francisco · 1967', 'Requested: this morning.', 'Arrived: San Francisco, 1967.', 'If they never meet… what happens to me?', 'Waiting for you in the future. —Mel', 'Look in the window', 'A message from Mel', 'Close'],
  he: ['סן פרנסיסקו · 1967', 'בקשה: הבוקר.', 'הגעה: סן פרנסיסקו, 1967.', 'אם הם לא ייפגשו… מה יקרה לי?', 'מחכה לך בעתיד. —מל', 'להביט בחלון', 'הודעה ממל', 'סגירה'],
  fr: ['San Francisco · 1967', 'Demandé : ce matin.', 'Arrivée : San Francisco, 1967.', 'S’ils ne se rencontrent jamais… que va-t-il m’arriver ?', 'Je t’attends dans le futur. —Mel', 'Regarder dans la vitrine', 'Un message de Mel', 'Fermer'],
  de: ['San Francisco · 1967', 'Angefordert: heute Morgen.', 'Angekommen: San Francisco, 1967.', 'Wenn sie sich nie treffen… was wird dann aus mir?', 'Ich warte in der Zukunft auf dich. —Mel', 'Ins Schaufenster sehen', 'Eine Nachricht von Mel', 'Schließen'],
  pl: ['San Francisco · 1967', 'Żądany czas: dziś rano.', 'Przybycie: San Francisco, 1967.', 'Jeśli nigdy się nie spotkają… co się ze mną stanie?', 'Czekam na ciebie w przyszłości. —Mel', 'Spójrz w witrynę', 'Wiadomość od Mel', 'Zamknij'],
  ru: ['Сан-Франциско · 1967', 'Запрос: сегодня утром.', 'Прибытие: Сан-Франциско, 1967.', 'Если они не встретятся… что станет со мной?', 'Жду тебя в будущем. —Мел', 'Посмотреть в витрину', 'Сообщение от Мел', 'Закрыть'],
  cs: ['San Francisco · 1967', 'Požadováno: dnes ráno.', 'Příjezd: San Francisco, 1967.', 'Jestli se nikdy nepotkají… co se stane se mnou?', 'Čekám na tebe v budoucnosti. —Mel', 'Podívat se do výlohy', 'Zpráva od Mel', 'Zavřít'],
  nl: ['San Francisco · 1967', 'Gevraagd: vanochtend.', 'Aangekomen: San Francisco, 1967.', 'Als ze elkaar nooit ontmoeten… wat gebeurt er dan met mij?', 'Ik wacht op je in de toekomst. —Mel', 'In de etalage kijken', 'Een bericht van Mel', 'Sluiten'],
};
// Normalized scene coordinates; the art owner can tune these without
// changing the native game or the canvas below this home layer.
const GEOMETRY = {
  desktop: { actor: { centerX: .68, top: .36, bottom: .925, maxWidth: .30 }, reflection: { x: .704, y: .36, w: .11, h: .28 }, mel: { x: 942 / 1672, y: 280 / 941, w: 125 / 1672, h: 94 / 941 } },
  portrait: { actor: { hand: [403, 356], sill: [690, 922], scale: .94 }, reflection: { x: 620 / 852, y: 600 / 1846, w: 170 / 852, h: 239 / 1846 }, mel: { x: 282 / 852, y: 614 / 1846, w: 155 / 852, h: 110 / 1846 } },
};
const REGISTRATION = { head: [180, 3, 153, 138], eyes: [239, 52, 73, 39], offsets: { 1: [30, 1], 2: [0, 0], 3: [30, 1] }, feather: 2, neckFade: [119, 141] };
const instances = new WeakMap();
const flower = '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="currentColor"><ellipse cx="24" cy="12" rx="7" ry="11"/><ellipse cx="24" cy="12" rx="7" ry="11" transform="rotate(60 24 24)"/><ellipse cx="24" cy="12" rx="7" ry="11" transform="rotate(120 24 24)"/><ellipse cx="24" cy="12" rx="7" ry="11" transform="rotate(180 24 24)"/><ellipse cx="24" cy="12" rx="7" ry="11" transform="rotate(240 24 24)"/><ellipse cx="24" cy="12" rx="7" ry="11" transform="rotate(300 24 24)"/></g><circle cx="24" cy="24" r="7" fill="#f7d781"/></svg>';

function parseState(value) {
  try { return typeof value === 'string' ? JSON.parse(value) : value; } catch { return null; }
}
function imageReady(img, src) {
  return new Promise((resolve, reject) => {
    if (!src) { reject(new Error('Missing home background')); return; }
    img.onload = () => resolve(true);
    img.onerror = () => reject(new Error('Home background unavailable'));
    img.src = src;
    if (img.complete && img.naturalWidth) resolve(true);
  });
}
function clamp(value, low, high) { return Math.min(high, Math.max(low, value)); }

/** Add an optional home layer. Failure leaves the native game canvas untouched. */
export function installHomeMenu({ canvas, stage, config = {} } = {}) {
  if (!canvas || !stage) return null;
  if (instances.has(stage)) return instances.get(stage);
  const assets = config.assets || config;
  const backgroundMode = config.backgroundMode === 'graphic' ? 'graphic' : 'image';
  const root = document.createElement('section');
  root.className = 'julia-home';
  root.dataset.backgroundMode = backgroundMode;
  root.hidden = true;
  root.innerHTML = `<div class="julia-home__world">
    <img class="julia-home__background" alt="" decoding="async"><img class="julia-home__portrait-background" alt="" decoding="async">
    <canvas class="julia-home__actor" width="1672" height="941" aria-hidden="true"></canvas>
    <button type="button" class="julia-home__reflection-target" data-secret="reflection"><canvas class="julia-home__reflection" width="235" height="330" aria-hidden="true"></canvas><span aria-hidden="true">✧</span></button>
    <button type="button" class="julia-home__message-target" data-secret="mel"><span aria-hidden="true"></span></button>
    </div><div class="julia-home__wash" aria-hidden="true"></div>
    <div class="julia-home__heading"><div class="julia-home__title-line"><h1></h1><span class="julia-home__title-flower" aria-hidden="true">${flower}</span></div><p class="julia-home__signature"></p><p class="julia-home__subtitle"></p></div>
    <div class="julia-home__controls"><nav class="julia-home__menu"><span class="julia-home__selection" aria-hidden="true">${flower}</span>
      <button type="button" class="julia-home__item" data-action="new_game" data-copy="newGame"></button>
      <button type="button" class="julia-home__item" data-action="continue" data-copy="continue" hidden></button>
      <button type="button" class="julia-home__item" data-action="settings" data-copy="settings"></button>
      <button type="button" class="julia-home__item" data-language-toggle data-copy="language" aria-expanded="false" aria-controls="julia-home-languages"></button>
    </nav><div class="julia-home__languages" id="julia-home-languages" hidden><label><span data-copy="language"></span><select></select></label></div>
    <div class="julia-home__loading" aria-hidden="true"><span></span><progress max="1" value="0"></progress></div></div>
    <div class="julia-home__footer"><button type="button" class="julia-home__date" data-secret="date"></button>
    <div class="julia-home__tools"><button type="button" class="julia-home__mode-toggle" aria-expanded="false" aria-controls="julia-home-mode-panel"><span data-current-edition></span><span aria-hidden="true">⌄</span></button>
    <div class="julia-home__mode-panel" id="julia-home-mode-panel"><div class="julia-home__edition" role="group"><span data-copy="edition"></span><button type="button" data-action="edition" data-value="modern" data-copy="modern" aria-pressed="true"></button><button type="button" data-action="edition" data-value="legacy" data-copy="legacy" aria-pressed="false"></button></div>
    <button type="button" class="julia-home__fullscreen" data-action="fullscreen"><span aria-hidden="true">⛶</span><span data-copy="fullscreen"></span></button></div></div></div>
    <aside class="julia-home__secret" role="dialog" aria-modal="false" hidden><div id="julia-home-secret-copy" aria-live="polite"></div><button type="button" class="julia-home__secret-close">×</button></aside>`;
  stage.append(root);
  const $ = selector => root.querySelector(selector);
  // Reuse the shipped seamless loader and its static reduced-motion image.
  for (const kind of ['animated', 'static']) {
    const source = document.querySelector(`#loading .loading-flower--${kind}`);
    if (source) {
      const icon = source.cloneNode();
      icon.className = `julia-home__loading-flower julia-home__loading-flower--${kind}`;
      $('.julia-home__loading').prepend(icon);
    }
  }
  const actorCanvas = $('.julia-home__actor');
  const menu = $('.julia-home__menu');
  const languageButton = $('[data-language-toggle]');
  const languagePanel = $('.julia-home__languages');
  const languagePicker = $('.julia-home__languages select');
  const modeToggle = $('.julia-home__mode-toggle');
  const secretPanel = $('.julia-home__secret');
  const commands = [...root.querySelectorAll('[data-action], [data-language-toggle], [data-secret], .julia-home__languages select, .julia-home__mode-toggle')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const timers = new Map();
  const errors = [];
  let state = { ready: false, visible: false, busy: false, hasSave: false, edition: 'modern', locale: globalThis.__juliaLanguage || 'en', strings: {} };
  let actor;
  let characterReady = false;
  let assetsReady = false;
  let destroyed = false;
  let failed = false;
  let visible = false;
  let loadingMode = false;
  let backgroundReady = backgroundMode === 'graphic';
  let portraitReady = false;
  let activeSecret = '';
  let modeOpen = false;
  let reflectionDraws = 0;
  let reflectionPainted = false;
  let secretReturnFocus;
  let suppressSecretFocus = false;
  let selectedAction = 'new_game';
  let lastAction = '';
  let copy = COPY[state.locale] || COPY.en;
  let secretCopy = SECRETS[state.locale] || SECRETS.en;

  for (const [code, label] of LANGUAGES) {
    const option = document.createElement('option'); option.value = code; option.lang = code; option.textContent = label; languagePicker.append(option);
  }
  function reduced() { return !!state.reducedMotion || motion.matches; }
  function later(key, fn, delay) {
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => { timers.delete(key); if (!destroyed) fn(); }, delay));
  }
  function setMood(mood) { actor?.setMood(mood); }
  function restSoon() { later('mood', () => setMood('idle'), 1000); }
  function closeLanguage(returnFocus = false) {
    const wasOpen = !languagePanel.hidden;
    languagePanel.hidden = true; languageButton.setAttribute('aria-expanded', 'false');
    if (returnFocus && wasOpen) languageButton.focus();
  }
  function closeMode(returnFocus = false) {
    const wasOpen = modeOpen;
    modeOpen = false; root.dataset.modeOpen = 'false';
    modeToggle.setAttribute('aria-expanded', 'false');
    if (returnFocus && wasOpen) modeToggle.focus({ preventScroll: true });
  }
  function resetScene() {
    root.style.setProperty('--home-x', '0px'); root.style.setProperty('--home-y', '0px');
  }
  function closeSecret(returnFocus = false) {
    root.dataset.secret = '';
    secretPanel.hidden = true; activeSecret = ''; root.classList.remove('julia-home--reflection-fading');
    clearTimeout(timers.get('secret')); timers.delete('secret');
    if (returnFocus && secretReturnFocus?.isConnected && visible) {
      suppressSecretFocus = true; secretReturnFocus.focus({ preventScroll: true }); suppressSecretFocus = false;
    }
  }
  function drawReflection() {
    const target = $('.julia-home__reflection'), context = target.getContext('2d');
    if (!context || !actor?.snapshot().ready) return;
    const crop = config.registration?.reflection || [185, 10, 235, 330];
    context.clearRect(0, 0, 235, 330); context.save(); context.translate(235, 0); context.scale(-1, 1);
    context.drawImage(actorCanvas, ...crop, 0, 0, 235, 330);
    context.restore(); reflectionPainted = true; reflectionDraws++;
  }
  function fillSecret() {
    secretPanel.dataset.kind = activeSecret;
    const body = $('#julia-home-secret-copy'); body.replaceChildren();
    const lines = activeSecret === 'date' ? [secretCopy[1], secretCopy[2]] : [activeSecret === 'mel' ? secretCopy[4] : secretCopy[3]];
    for (const line of lines) { const paragraph = document.createElement('p'); paragraph.textContent = line; body.append(paragraph); }
    secretPanel.setAttribute('aria-label', activeSecret === 'mel' ? secretCopy[6] : activeSecret === 'date' ? secretCopy[0] : secretCopy[5]);
  }
  function revealSecret(kind, focus = false) {
    if (!visible || loadingMode || !state.ready || state.busy) return;
    closeSecret(); closeLanguage(); closeMode(); activeSecret = kind; root.dataset.secret = kind; secretReturnFocus = $(`[data-secret="${kind}"]`);
    fillSecret(); secretPanel.hidden = false;
    if (kind === 'reflection') {
      drawReflection(); root.classList.remove('julia-home--reflection-fading');
      void $('.julia-home__reflection').offsetWidth; root.classList.add('julia-home--reflection-fading');
      setMood('thinking');
      later('secret', () => { root.classList.remove('julia-home--reflection-fading'); closeSecret(secretPanel.contains(document.activeElement)); setMood('idle'); }, 2600);
    } else { setMood(kind === 'date' ? 'surprised' : 'ready'); restSoon(); }
    if (focus) $('.julia-home__secret-close').focus({ preventScroll: true });
  }
  function selectItem(button, react = true) {
    if (!button || button.hidden) return;
    selectedAction = button.dataset.action || 'language';
    root.style.setProperty('--selection-y', `${button.offsetTop + button.offsetHeight / 2 - 15}px`);
    root.style.setProperty('--selection-x', `${root.dir === 'rtl' ? button.offsetLeft + button.offsetWidth - menu.clientWidth : button.offsetLeft}px`);
    menu.querySelectorAll('.julia-home__item').forEach(item => item.classList.toggle('is-selected', item === button));
    if (react && visible) { setMood(button.dataset.action === 'settings' ? 'thinking' : 'ready'); restSoon(); }
  }
  function dispatch(action, value) {
    if (!visible || loadingMode || state.busy || !state.ready) return false;
    const bridge = globalThis.juliaHomeBridge;
    if (typeof bridge?.dispatch !== 'function') { failed = true; render(); return false; }
    try {
      // Keep this synchronous: native fullscreen/audio require a trusted input.
      bridge.dispatch(action, value);
      lastAction = action;
      if (['new_game', 'continue', 'settings', 'edition'].includes(action)) canvas.focus({ preventScroll: true });
      return true;
    } catch (error) {
      errors.push(String(error?.message || error)); failed = true; render(); canvas.focus(); return false;
    }
  }
  function mirrorLoading() {
    const sourceStatus = document.getElementById('status');
    const sourceProgress = document.getElementById('progress');
    $('.julia-home__loading span').textContent = sourceStatus?.textContent || '';
    const target = $('.julia-home__loading progress');
    target.max = sourceProgress?.max || 1; target.value = sourceProgress?.value || 0;
  }
  function layoutScene() {
    const rect = root.getBoundingClientRect();
    const portrait = rect.height > rect.width;
    const world = $('.julia-home__world');
    root.dataset.portraitReady = String(portraitReady);
    root.dataset.layout = portrait ? 'portrait' : 'landscape';
    if (portrait) {
      const scale = Math.max(rect.width / 852, rect.height / 1846);
      const width = 852 * scale, height = 1846 * scale;
      world.style.width = `${width}px`; world.style.height = `${height}px`;
      world.style.left = `${(rect.width - width) / 2}px`; world.style.top = `${(rect.height - height) / 2}px`;
    } else {
      const scale = Math.max((rect.width + 16) / 1672, (rect.height + 16) / 941);
      const width = 1672 * scale, height = 941 * scale;
      world.style.width = `${width}px`; world.style.height = `${height}px`;
      world.style.left = `${(rect.width - width) / 2}px`; world.style.top = `${(rect.height - height) / 2}px`;
    }
    const sceneWidth = parseFloat(world.style.width), sceneHeight = parseFloat(world.style.height);
    const layoutName = portrait ? 'portrait' : 'desktop';
    const geometry = { ...GEOMETRY[layoutName], ...(config.geometry?.[layoutName] || {}) };
    const placement = { ...GEOMETRY[layoutName].actor, ...(geometry.actor || {}) };
    if (portrait) {
      // The hand and the sill share artwork coordinates. Menu height must
      // never rescale Julia independently of the street perspective.
      const scale = sceneWidth / 852, characterScale = placement.scale * scale;
      actorCanvas.style.width = `${actorCanvas.width * characterScale}px`;
      actorCanvas.style.height = `${actorCanvas.height * characterScale}px`;
      actorCanvas.style.left = `${placement.sill[0] * scale - placement.hand[0] * characterScale}px`;
      actorCanvas.style.top = `${placement.sill[1] * scale - placement.hand[1] * characterScale}px`;
    } else if (rect.height <= 580) {
      const worldTop = world.getBoundingClientRect().top;
      const safeBottomLimit = ($('.julia-home__date').getBoundingClientRect().bottom - 10 - worldTop) / sceneHeight;
      placement.bottom = Math.min(placement.bottom, Math.max(placement.top, safeBottomLimit));
    }
    if (!portrait) {
      const snapshot = actor?.snapshot();
      const bounds = snapshot?.contentBounds || [0, 0, actorCanvas.width, actorCanvas.height];
      const scale = Math.min(sceneWidth * placement.maxWidth / bounds[2], sceneHeight * (placement.bottom - placement.top) / bounds[3]);
      actorCanvas.style.width = `${actorCanvas.width * scale}px`; actorCanvas.style.height = `${actorCanvas.height * scale}px`;
      actorCanvas.style.left = `${sceneWidth * placement.centerX - (bounds[0] + bounds[2] / 2) * scale}px`;
      actorCanvas.style.top = `${sceneHeight * placement.top - bounds[1] * scale}px`;
    }
    for (const kind of ['reflection', 'mel']) {
      const box = geometry[kind], target = $(`[data-secret="${kind}"]`);
      target.style.left = `${box.x * 100}%`; target.style.top = `${box.y * 100}%`;
      target.style.width = `${box.w * 100}%`; target.style.height = `${box.h * 100}%`;
    }
  }
  function render() {
    if (destroyed) return;
    // Only the plate used by the current viewport can hold up the home.
    // The other orientation may still be downloading on a slow connection.
    const needsPortrait = window.innerHeight > window.innerWidth && !!assets.backgroundPortrait;
    assetsReady = characterReady && (backgroundMode === 'graphic' || (needsPortrait ? portraitReady : backgroundReady));
    copy = COPY[state.locale] || COPY.en;
    secretCopy = SECRETS[state.locale] || SECRETS.en;
    const bodyState = document.body.dataset.state;
    const wasLoading = loadingMode;
    loadingMode = bodyState === 'loading';
    const bridgeReady = state.ready && typeof globalThis.juliaHomeBridge?.dispatch === 'function';
    const shouldShow = assetsReady && !failed && !document.hidden && bodyState !== 'error' &&
      (loadingMode || (bodyState === 'playing' && bridgeReady && state.visible));
    root.dir = state.rtl || state.locale === 'he' ? 'rtl' : 'ltr';
    root.lang = state.locale;
    root.dataset.reducedMotion = String(reduced());
    root.dataset.highContrast = String(!!state.highContrast);
    root.dataset.largeText = String(!!state.largeText);
    root.dataset.loading = String(loadingMode);
    root.dataset.hasSave = String(!!state.hasSave);
    root.setAttribute('aria-busy', String(loadingMode || !!state.busy));
    const strings = { ...Object.fromEntries(KEYS.map((key, i) => [key, copy.menu[i]])), ...state.strings };
    root.setAttribute('aria-label', strings.title || 'Julia');
    $('h1').textContent = strings.title || document.getElementById('loading-title')?.textContent || 'Julia';
    $('.julia-home__signature').textContent = copy.signature;
    $('.julia-home__subtitle').textContent = strings.subtitle || document.getElementById('loading-subtitle')?.textContent || '';
    root.querySelectorAll('[data-copy]').forEach(node => { node.textContent = strings[node.dataset.copy] || ''; });
    menu.setAttribute('aria-label', strings.title || 'Julia');
    $('.julia-home__edition').setAttribute('aria-label', strings.edition);
    languagePicker.setAttribute('aria-label', strings.language);
    languagePicker.value = state.locale;
    $('[data-action="continue"]').hidden = !state.hasSave;
    const primary = $(`[data-action="${state.hasSave ? 'continue' : 'new_game'}"]`);
    const secondary = $(`[data-action="${state.hasSave ? 'new_game' : 'continue'}"]`);
    const firstItem = menu.querySelector('.julia-home__item');
    if (firstItem !== primary) menu.insertBefore(primary, firstItem);
    primary.dataset.primary = 'true'; secondary.dataset.primary = 'false';
    if (!visible || wasLoading) selectedAction = primary.dataset.action;
    root.querySelectorAll('[data-action="edition"]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.value === state.edition)));
    $('[data-action="fullscreen"]').setAttribute('aria-pressed', String(!!state.fullscreen));
    $('[data-action="fullscreen"]').setAttribute('aria-label', strings.fullscreen);
    $('[data-action="fullscreen"]').title = strings.fullscreen;
    $('[data-current-edition]').textContent = strings[state.edition === 'legacy' ? 'legacy' : 'modern'];
    modeToggle.setAttribute('aria-label', `${strings.edition}: ${$('[data-current-edition]').textContent}`);
    $('.julia-home__date').textContent = secretCopy[0];
    $('[data-secret="reflection"]').setAttribute('aria-label', secretCopy[5]); $('[data-secret="reflection"]').title = secretCopy[5];
    $('[data-secret="mel"]').setAttribute('aria-label', secretCopy[6]); $('[data-secret="mel"]').title = secretCopy[6];
    $('.julia-home__secret-close').setAttribute('aria-label', secretCopy[7]);
    if (activeSecret) fillSecret();
    commands.forEach(button => { button.disabled = loadingMode || !bridgeReady || !!state.busy; });
    $('.julia-home__loading').hidden = !loadingMode;
    mirrorLoading();
    actor?.setReducedMotion(reduced()); actor?.setVisible(!!shouldShow);
    if (shouldShow !== visible) {
      const returnNativeFocus = !shouldShow && root.contains(document.activeElement);
      visible = shouldShow; root.hidden = !visible;
      if (visible) {
        layoutScene();
        requestAnimationFrame(() => {
          if (!visible || destroyed) return;
          root.classList.add('julia-home--entered'); selectItem($(`[data-action="${selectedAction}"]`) || languageButton, false);
          if (!reflectionPainted) drawReflection();
          if (!loadingMode && (document.activeElement === canvas || document.activeElement === document.body)) primary.focus({ preventScroll: true });
        });
      } else {
        root.classList.remove('julia-home--entered');
        for (const timer of timers.values()) clearTimeout(timer); timers.clear();
        closeLanguage(); closeSecret(); closeMode(); resetScene(); setMood('idle');
        if (returnNativeFocus) canvas.focus({ preventScroll: true });
      }
    }
    if (visible && wasLoading && !loadingMode && (document.activeElement === canvas || document.activeElement === document.body)) primary.focus({ preventScroll: true });
    if (reduced()) { root.style.setProperty('--home-x', '0px'); root.style.setProperty('--home-y', '0px'); }
    if (visible && !loadingMode && root.contains(document.activeElement) && document.activeElement.disabled) primary.focus({ preventScroll: true });
    if (visible && root.dataset.layout === 'portrait') layoutScene();
  }
  function update(value) {
    const next = parseState(value);
    if (!next || typeof next !== 'object') return;
    state = { ...state, ...next, strings: { ...state.strings, ...(next.strings || {}) } }; render();
  }
  function onNative(event) { update(event.detail || globalThis.juliaHomeState); }
  function onResize() { render(); if (visible) { layoutScene(); selectItem(menu.querySelector('.is-selected') || $('[data-action="new_game"]'), false); } }
  function onPointer(event) {
    if (!visible || reduced() || event.pointerType === 'touch') return;
    const rect = root.getBoundingClientRect();
    root.style.setProperty('--home-x', `${clamp((event.clientX - rect.left - rect.width / 2) / rect.width * 12, -6, 6).toFixed(2)}px`);
    root.style.setProperty('--home-y', `${clamp((event.clientY - rect.top - rect.height / 2) / rect.height * 8, -4, 4).toFixed(2)}px`);
  }
  root.addEventListener('pointermove', onPointer);
  root.addEventListener('pointerdown', event => {
    if (modeOpen && !event.target.closest('.julia-home__tools')) closeMode();
  });
  root.addEventListener('animationend', event => {
    if (visible && root.dataset.layout === 'portrait' && event.animationName === 'street-arrive' && event.target.matches('.julia-home__item')) layoutScene();
  });
  root.addEventListener('pointerleave', () => { root.style.setProperty('--home-x', '0px'); root.style.setProperty('--home-y', '0px'); restSoon(); });
  root.querySelectorAll('.julia-home__item').forEach(button => {
    button.addEventListener('pointerenter', () => selectItem(button)); button.addEventListener('focus', () => selectItem(button));
  });
  root.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    if (dispatch(button.dataset.action, button.dataset.value)) closeMode();
  }));
  modeToggle.addEventListener('click', () => {
    if (modeToggle.disabled) return;
    modeOpen = !modeOpen; root.dataset.modeOpen = String(modeOpen);
    modeToggle.setAttribute('aria-expanded', String(modeOpen));
    if (modeOpen) { closeLanguage(); closeSecret(); }
  });
  languageButton.addEventListener('click', () => {
    if (languageButton.disabled) return;
    closeMode();
    const open = languagePanel.hidden; languagePanel.hidden = !open; languageButton.setAttribute('aria-expanded', String(open));
    if (open) languagePicker.focus();
  });
  languagePicker.addEventListener('change', () => { dispatch('language', languagePicker.value); closeLanguage(true); });
  root.querySelectorAll('[data-secret]').forEach(button => {
    button.addEventListener('click', () => revealSecret(button.dataset.secret, true));
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch' && matchMedia('(hover: hover)').matches) later('hover-secret', () => revealSecret(button.dataset.secret), 280); });
    button.addEventListener('pointerleave', () => { clearTimeout(timers.get('hover-secret')); timers.delete('hover-secret'); });
    button.addEventListener('focus', () => { if (!suppressSecretFocus && matchMedia('(hover: hover)').matches) revealSecret(button.dataset.secret); });
  });
  $('.julia-home__secret-close').addEventListener('click', () => closeSecret(true));
  root.addEventListener('keydown', event => {
    if (!visible || event.ctrlKey || event.metaKey || event.altKey) return;
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault(); closeSecret(true); closeLanguage(true); closeMode(true); resetScene(); setMood('idle'); return;
    }
    if (event.target === languagePicker) return;
    const buttons = [...menu.querySelectorAll('.julia-home__item')].filter(button => !button.hidden && !button.disabled);
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) && buttons.includes(document.activeElement)) {
      event.preventDefault();
      const index = buttons.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
      buttons[next]?.focus(); return;
    }
  });
  const bodyObserver = new MutationObserver(render);
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['data-state'] });
  const loaderObserver = new MutationObserver(mirrorLoading);
  const loader = document.getElementById('loading');
  if (loader) loaderObserver.observe(loader, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['value', 'max'] });
  window.addEventListener('julia-home-state', onNative); window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', render); motion.addEventListener('change', render);

  function snapshot() {
    return Object.freeze({ ready: assetsReady, visible, loading: loadingMode, bridgeReady: !!state.ready && typeof globalThis.juliaHomeBridge?.dispatch === 'function', locale: state.locale, edition: state.edition, hasSave: !!state.hasSave, reducedMotion: reduced(), backgroundMode, backgroundReady, portraitReady, activeSecret, reflectionDraws, layout: root.dataset.layout, lastAction, selectedAction, audioPlaying: false, actor: actor?.snapshot() || null, errors: [...errors] });
  }
  const controller = {
    ready: null, update, snapshot,
    destroy() {
      if (destroyed) return; destroyed = true;
      for (const timer of timers.values()) clearTimeout(timer); timers.clear();
      actor?.destroy(); bodyObserver.disconnect(); loaderObserver.disconnect();
      window.removeEventListener('julia-home-state', onNative); window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', render); motion.removeEventListener('change', render);
      root.remove(); instances.delete(stage);
      if (Object.getOwnPropertyDescriptor(window, 'juliaHomeDebug')?.get === debugGetter) delete window.juliaHomeDebug;
    },
  };
  const debugGetter = () => snapshot();
  Object.defineProperty(window, 'juliaHomeDebug', { configurable: true, get: debugGetter });
  instances.set(stage, controller);
  controller.ready = (async () => {
    try {
      actor = createStreetActor(actorCanvas, { assets, reducedMotion: reduced(), registration: config.registration || REGISTRATION, onDraw: drawReflection }); actor.setVisible(false);
      const background = backgroundMode === 'image' && assets.background ? imageReady($('.julia-home__background'), assets.background).then(() => {
        backgroundReady = true; render(); return true;
      }).catch(() => { errors.push('Desktop background unavailable; using home fallback'); render(); return false; }) : Promise.resolve(true);
      const portrait = backgroundMode === 'image' && assets.backgroundPortrait ? imageReady($('.julia-home__portrait-background'), assets.backgroundPortrait).then(() => {
        portraitReady = true; render(); return true;
      }).catch(() => { errors.push('Portrait background unavailable; using home fallback'); render(); return false; }) : Promise.resolve(true);
      const character = actor.ready.then(ready => {
        if (ready && !destroyed) { characterReady = true; update(globalThis.juliaHomeState); render(); }
        return ready;
      });
      const requiredBackground = window.innerHeight > window.innerWidth && assets.backgroundPortrait ? portrait : background;
      const results = await Promise.all([requiredBackground, character]);
      if (destroyed) return false;
      if (results[1] === false || !actor.snapshot().ready) throw new Error('Home character unavailable');
      update(globalThis.juliaHomeState); render(); return results[0];
    } catch (error) {
      if (!destroyed) { errors.push(String(error?.message || error)); failed = true; actor?.setVisible(false); render(); }
      return false;
    }
  })();
  update(globalThis.juliaHomeState); render();
  return controller;
}
