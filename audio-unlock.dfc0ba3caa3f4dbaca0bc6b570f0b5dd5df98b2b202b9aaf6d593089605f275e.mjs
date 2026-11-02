// Resume the engine's own audio on a genuine game gesture, without changing
// any player volume preferences. Automatic startup need not wait for a click.
export function installAudioUnlock(target = window, events = document) {
  const contexts = new Set();
  const originals = new Map();
  for (const name of ['AudioContext', 'webkitAudioContext']) {
    const Original = target[name];
    if (!Original) continue;
    originals.set(name, Original);
    target[name] = new Proxy(Original, { construct(Constructor, args, NewTarget) {
      const context = Reflect.construct(Constructor, args, NewTarget);
      contexts.add(context);
      return context;
    } });
  }
  const resume = (event) => {
    if (!event.isTrusted) return;
    for (const context of contexts) {
      if (context.state === 'closed') contexts.delete(context);
      else if (context.state === 'suspended') context.resume().catch(() => {});
    }
  };
  for (const event of ['pointerdown', 'touchend', 'keydown']) events.addEventListener(event, resume, { capture: true, passive: true });
  return { restore() {
    for (const [name, Original] of originals) target[name] = Original;
    for (const event of ['pointerdown', 'touchend', 'keydown']) events.removeEventListener(event, resume, { capture: true });
  } };
}
