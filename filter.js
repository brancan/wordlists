// Lógica de filtrado pura (sin DOM), usada por la app y por los tests.
// Equivale a los filtros de hel2.py, con posiciones en base 1.

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z_?.\s,]/g, "");
const letters = (s) => [...new Set((s || "").toLowerCase().replace(/[^a-z]/g, ""))];

// "e3 a1, r5" -> [{ch:'e', pos:2}, ...]   (pos en base 0 internamente)
function parseNotHere(s) {
  const out = [];
  const re = /([a-z])\s*(\d{1,2})/gi;
  let m;
  while ((m = re.exec(s || ""))) out.push({ ch: m[1].toLowerCase(), pos: parseInt(m[2], 10) - 1 });
  return out;
}

function parsePattern(s) {
  // _ ? . = desconocida; los espacios solo separan y se ignoran
  return (s || "").toLowerCase().replace(/[^a-z_?.]/g, "").replace(/[?.]/g, "_");
}

function buildFilter({ pattern, exclude, include, notHere, length, maxLength }) {
  const pat = parsePattern(pattern);
  const exc = letters(exclude);
  const inc = letters(include);
  const nh = parseNotHere(notHere);
  const fixedLen = length ? parseInt(length, 10) : pat.length || 0;
  const maxLen = maxLength ? parseInt(maxLength, 10) : 0;
  const known = new Set(pat.replace(/_/g, ""));

  const active = !!(pat || exc.length || inc.length || nh.length || fixedLen || maxLen);

  const test = (w) => {
    if (fixedLen && w.length !== fixedLen) return false;
    if (maxLen && w.length > maxLen) return false;
    for (let i = 0; i < pat.length; i++) {
      const c = pat[i];
      if (c !== "_" && w[i] !== c) return false;
    }
    for (const c of exc) if (!known.has(c) && w.includes(c)) return false;
    for (const c of inc) if (!w.includes(c)) return false;
    for (const { ch, pos } of nh) if (pos < w.length && w[pos] === ch) return false;
    return true;
  };
  return { test, active, known, exclude: exc, include: inc, pattern: pat };
}

// Frecuencia de letras (cuántas palabras candidatas contienen cada letra)
// y puntaje por palabra = suma de la frecuencia de sus letras distintas.
function analyze(words, ignore) {
  const freq = {};
  for (const w of words) {
    const seen = new Set(w);
    for (const c of seen) freq[c] = (freq[c] || 0) + 1;
  }
  const letterRank = Object.entries(freq)
    .filter(([c]) => !ignore.has(c))
    .sort((a, b) => b[1] - a[1]);
  const score = (w) => {
    let s = 0;
    for (const c of new Set(w)) if (!ignore.has(c)) s += freq[c] || 0;
    return s;
  };
  return { letterRank, score };
}

if (typeof module !== "undefined") module.exports = { buildFilter, analyze, parsePattern, parseNotHere, letters, norm };
