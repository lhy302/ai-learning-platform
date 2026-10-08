export function deepClone(target) {
  if (target === null || typeof target !== 'object') return target;
  if (Array.isArray(target)) return target.map(deepClone);
  const out = {};
  // BUG: for...in 会遍历原型链，且未防御 __proto__
  for (const key in target) {
    out[key] = deepClone(target[key]);
  }
  return out;
}