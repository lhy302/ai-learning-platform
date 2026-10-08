export function deepClone(target) {
  if (target === null || typeof target !== 'object') return target;
  if (Array.isArray(target)) return target.map(deepClone);
  const out = {};
  for (const key of Object.keys(target)) {
    if (key === '__proto__' || key === 'constructor') continue;
    out[key] = deepClone(target[key]);
  }
  return out;
}