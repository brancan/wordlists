(() => {
  const $ = (id) => document.getElementById(id);
  const els = {
    pattern: $("pattern"), exclude: $("exclude"), include: $("include"), nothere: $("nothere"),
    length: $("length"), maxlen: $("maxlen"), count: $("count"), words: $("words"),
    wordsTitle: $("wordsTitle"), more: $("more"), letters: $("letters"), lettersCard: $("lettersCard"),
    clear: $("clear"), random: $("random"), toast: $("toast"),
  };

  const PAGE = 60;
  const SORT_LIMIT = 60000; // por encima de esto no se ordena por puntaje
  let ALL = [];
  let results = [];
  let shown = 0;
  let timer;

  const fmt = (n) => n.toLocaleString("es-AR");

  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => els.toast.classList.remove("show"), 1400);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast(`Copiado: ${text}`); }
    catch { toast(text); }
  }

  function readState() {
    return {
      pattern: els.pattern.value, exclude: els.exclude.value, include: els.include.value,
      notHere: els.nothere.value, length: els.length.value, maxLength: els.maxlen.value,
    };
  }

  function save() { try { localStorage.setItem("ahorcado", JSON.stringify(readState())); } catch {} }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem("ahorcado") || "{}");
      els.pattern.value = s.pattern || ""; els.exclude.value = s.exclude || "";
      els.include.value = s.include || ""; els.nothere.value = s.notHere || "";
      els.length.value = s.length || ""; els.maxlen.value = s.maxLength || "";
    } catch {}
  }

  function chip(text, cls, extra) {
    const b = document.createElement("button");
    b.className = "chip " + (cls || "");
    b.textContent = text;
    if (extra) { const s = document.createElement("small"); s.textContent = extra; b.appendChild(s); }
    return b;
  }

  function renderWords() {
    const frag = document.createDocumentFragment();
    const end = Math.min(results.length, shown + PAGE);
    for (let i = shown; i < end; i++) {
      const b = chip(results[i]);
      b.addEventListener("click", () => copy(results[i]));
      frag.appendChild(b);
    }
    shown = end;
    els.words.appendChild(frag);
    els.more.hidden = shown >= results.length;
  }

  function update() {
    save();
    const st = readState();
    const f = buildFilter(st);
    results = [];
    for (let i = 0; i < ALL.length; i++) if (f.test(ALL[i])) results.push(ALL[i]);

    els.count.innerHTML = `<b>${fmt(results.length)}</b> palabras`;

    // Letras sugeridas (ignora las ya conocidas o excluidas)
    const ignore = new Set([...f.known, ...f.exclude]);
    const { letterRank, score } = analyze(results, ignore);
    els.letters.innerHTML = "";
    const top = letterRank.slice(0, 8);
    els.lettersCard.hidden = !f.active || top.length === 0 || results.length === 0;
    for (const [c, n] of top) {
      const pct = Math.round((n / results.length) * 100);
      const b = chip(c.toUpperCase(), "letter" + (pct === 100 ? " ok" : ""), pct + "%");
      b.addEventListener("click", () => { els.include.value = (els.include.value + c).trim(); update(); });
      els.letters.appendChild(b);
    }

    // Ordenar: palabras que prueban más letras útiles primero
    if (f.active && results.length <= SORT_LIMIT) {
      const sc = new Map();
      results.sort((a, b) => {
        if (!sc.has(a)) sc.set(a, score(a));
        if (!sc.has(b)) sc.set(b, score(b));
        return sc.get(b) - sc.get(a) || a.localeCompare(b);
      });
      els.wordsTitle.textContent = "Mejores intentos primero";
    } else {
      els.wordsTitle.textContent = f.active ? "Palabras (demasiadas para ordenar)" : "Escribí algún dato para filtrar";
    }

    els.words.innerHTML = "";
    shown = 0;
    if (!results.length) {
      els.words.innerHTML = '<div class="empty">Ninguna palabra coincide. Revisá los datos.</div>';
      els.more.hidden = true;
    } else renderWords();
  }

  function debounced() { clearTimeout(timer); timer = setTimeout(update, 120); }

  [els.pattern, els.exclude, els.include, els.nothere, els.length, els.maxlen]
    .forEach((el) => el.addEventListener("input", debounced));
  els.more.addEventListener("click", renderWords);
  els.clear.addEventListener("click", () => {
    [els.pattern, els.exclude, els.include, els.nothere, els.length, els.maxlen].forEach((e) => (e.value = ""));
    update();
  });
  els.random.addEventListener("click", () => {
    if (!results.length) return toast("No hay palabras");
    const pool = results.slice(0, Math.min(results.length, 20));
    copy(pool[Math.floor(Math.random() * pool.length)]);
  });

  async function init() {
    load();
    try {
      const txt = await (await fetch("words.txt")).text();
      ALL = txt.split("\n");
      update();
    } catch {
      els.words.innerHTML = '<div class="empty">No se pudo cargar el diccionario.</div>';
    }
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  init();
})();
