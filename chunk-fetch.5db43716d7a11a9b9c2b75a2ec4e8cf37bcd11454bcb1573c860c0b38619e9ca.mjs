// Reassemble exported files without changing Godot's loader or game bytes.
export function installChunkFetch(manifest, options = {}) {
  const origin = options.baseURL || document.baseURI;
  const target = options.target || globalThis;
  const fetchOriginal = options.fetch || target.fetch.bind(target);
  const digest = options.digest || (async (data) => {
    const bytes = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(bytes)].map((v) => v.toString(16).padStart(2, '0')).join('');
  });
  const entries = new Map();
  const completed = new Map();
  if (manifest.schema !== 'julia-web-chunks-v1') throw new Error('Unknown game download manifest.');
  for (const [path, entry] of Object.entries(manifest.files || {})) {
    const url = new URL(path, origin);
    if (url.origin !== new URL(origin).origin || entry.chunks.reduce((n, c) => n + c.bytes, 0) !== entry.bytes) {
      throw new Error('Invalid game download manifest.');
    }
    entries.set(url.href, entry);
    for (const chunk of entry.chunks) {
      const partURL = new URL(chunk.path, origin);
      if (partURL.origin !== url.origin || !/^[a-f0-9]{64}$/.test(chunk.sha256) || chunk.bytes <= 0) {
        throw new Error('Invalid game download chunk.');
      }
    }
  }
  const total = [...entries.values()].reduce((sum, entry) => sum + entry.bytes, 0);
  if (!total || total !== manifest.total_bytes) throw new Error('Invalid game download size.');
  const report = () => options.onProgress?.([...completed.values()].reduce((sum, n) => sum + n, 0), total);

  async function readChunk(chunk, signal, key) {
    let failure;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (signal?.aborted) throw signal.reason || new Error('Download cancelled.');
      try {
        const response = await fetchOriginal(new URL(chunk.path, origin), {
          credentials: 'same-origin', cache: attempt ? 'reload' : 'default', signal,
        });
        if (!response.ok) throw new Error(`Download returned ${response.status}.`);
        // Count actual network bytes as they arrive, rather than leaving a
        // slow phone motionless until the entire 20 MiB piece has downloaded.
        const data = new Uint8Array(chunk.bytes);
        const reader = response.body.getReader();
        let offset = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (offset + value.byteLength > chunk.bytes) throw new Error('A game file had an unexpected size.');
            data.set(value, offset);
            offset += value.byteLength;
            completed.set(key, offset);
            report();
          }
        } finally { await reader.cancel().catch(() => {}); }
        if (offset !== chunk.bytes || await digest(data) !== chunk.sha256) {
          throw new Error('A game file was incomplete.');
        }
        completed.set(key, chunk.bytes);
        return data;
      } catch (error) {
        failure = error;
        completed.delete(key);
        report();
        if (signal?.aborted) throw error;
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }
    throw failure;
  }

  target.fetch = async function chunkAwareFetch(input, init) {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, origin);
    const entry = entries.get(url.href);
    const method = init?.method || (typeof input === 'object' && input.method) || 'GET';
    if (!entry || method !== 'GET') return fetchOriginal(input, init);
    // Native fetch accepts AbortSignal, null or undefined, never the boolean
    // false produced by an && expression for Godot's ordinary string URLs.
    // Explicit null also overrides an inherited Request signal.
    const signal = init?.signal === undefined
      ? (typeof input === 'object' ? input.signal : undefined)
      : init.signal;
    let index = 0;
    let cancelled = false;
    const body = new ReadableStream({
      async pull(controller) {
        if (cancelled) return;
        try {
          if (index === entry.chunks.length) { controller.close(); return; }
          const bytes = await readChunk(entry.chunks[index], signal, `${url.href}:${index}`);
          if (!cancelled) { index += 1; controller.enqueue(bytes); }
        } catch (error) {
          if (!cancelled) { cancelled = true; controller.error(error); options.onError?.(error); }
        }
      },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 });
    return new Response(body, { status: 200, headers: {
      'Content-Type': entry.mime, 'Content-Length': String(entry.bytes),
      'Cache-Control': 'no-store',
    } });
  };
  return { total, restore() { target.fetch = fetchOriginal; } };
}
