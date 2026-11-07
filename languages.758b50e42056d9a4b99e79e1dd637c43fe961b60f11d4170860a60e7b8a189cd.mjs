const LANGUAGES = [
  ['he', 'עברית'], ['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'],
  ['pl', 'Polski'], ['ru', 'Русский'], ['cs', 'Čeština'], ['nl', 'Nederlands'],
];
const COPY = {
  he: ['שפה', 'ג׳וליה', 'סן פרנסיסקו, 1967. הזמן נשבר.', 'טוען…', 'פותח את המשחק…', 'לא ניתן לפתוח את המשחק. נסו שוב.', 'ניסיון נוסף', 'המשחק ג׳וליה ילדי הפרחים'],
  en: ['Language', 'Julia', 'San Francisco, 1967. Time is broken.', 'Loading…', 'Opening the game…', 'The game could not open. Please try again.', 'Try again', 'Julia Flower Girl game'],
  fr: ['Langue', 'Julia', 'San Francisco, 1967. Le temps est déréglé.', 'Chargement…', 'Ouverture du jeu…', 'Le jeu n’a pas pu démarrer. Réessayez.', 'Réessayer', 'Jeu Julia'],
  de: ['Sprache', 'Julia', 'San Francisco, 1967. Die Zeit ist aus den Fugen.', 'Wird geladen…', 'Das Spiel wird geöffnet…', 'Das Spiel konnte nicht geöffnet werden. Bitte versuche es erneut.', 'Erneut versuchen', 'Julia Zeitreise-Spiel'],
  pl: ['Język', 'Julia', 'San Francisco, 1967. Czas się załamał.', 'Wczytywanie…', 'Uruchamianie gry…', 'Nie udało się uruchomić gry. Spróbuj ponownie.', 'Spróbuj ponownie', 'Gra Julia'],
  ru: ['Язык', 'Джулия', 'Сан-Франциско, 1967. Время дало трещину.', 'Загрузка…', 'Запуск игры…', 'Не удалось запустить игру. Попробуйте ещё раз.', 'Повторить', 'Игра «Приключения Джулии»'],
  cs: ['Jazyk', 'Katka', 'San Francisco, 1967. Čas se porouchal.', 'Načítání…', 'Spouštění hry…', 'Hru se nepodařilo spustit. Zkuste to znovu.', 'Zkusit znovu', 'Hra Katka pátrá v minulosti'],
  nl: ['Taal', 'Julia', 'San Francisco, 1967. De tijd is ontregeld.', 'Laden…', 'Het spel wordt geopend…', 'Het spel kon niet worden geopend. Probeer het opnieuw.', 'Opnieuw proberen', 'Julia Sweet Sixties'],
};

export function installLanguagePicker() {
  const picker = document.getElementById('game-language');
  let selected = 'he';
  let status = 'loading';
  try { selected = localStorage.getItem('julia.language') || 'he'; } catch {}
  if (!COPY[selected]) selected = 'he';
  if (picker) {
    for (const [code, name] of LANGUAGES) {
      const option = document.createElement('option');
      option.value = code; option.textContent = name; option.lang = code;
      picker.append(option);
    }
    picker.addEventListener('change', () => setLanguage(picker.value));
  }
  function update() {
    const copy = COPY[selected];
    document.documentElement.lang = selected;
    document.documentElement.dir = selected === 'he' ? 'rtl' : 'ltr';
    document.title = copy[7];
    const brand = document.getElementById('game-brand');
    if (brand) brand.textContent = copy[1];
    const label = document.getElementById('language-label');
    if (label) label.textContent = copy[0];
    const title = document.getElementById('loading-title');
    if (title) title.textContent = copy[1];
    const subtitle = document.getElementById('loading-subtitle');
    if (subtitle) subtitle.textContent = copy[2];
    const message = document.getElementById('status');
    if (message) message.textContent = copy[{ loading: 3, opening: 4, error: 5 }[status]];
    const retry = document.getElementById('retry');
    if (retry) retry.textContent = copy[6];
    document.getElementById('canvas')?.setAttribute('aria-label', copy[7]);
    if (picker) { picker.value = selected; picker.setAttribute('aria-label', copy[0]); }
  }
  function setLanguage(code, notify = true) {
    if (!COPY[code]) return;
    selected = code;
    globalThis.__juliaLanguage = selected;
    try { localStorage.setItem('julia.language', selected); } catch {}
    update();
    if (notify) window.dispatchEvent(new CustomEvent('julia-language-change', { detail: selected }));
  }
  globalThis.__juliaSetLanguage = setLanguage;
  setLanguage(selected, false);
  return { showStatus(value) { status = value; update(); } };
}
