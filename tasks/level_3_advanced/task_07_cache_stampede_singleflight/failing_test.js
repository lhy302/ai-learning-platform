import { AsyncCache } from './source.js';
import assert from 'node:assert';

const cache = new AsyncCache();
let callCount = 0;
const fetcher = async () => {
  callCount++;
  await new Promise(r => setTimeout(r, 40));
  return "payload";
};

await Promise.all([
  cache.get("k1", fetcher),
  cache.get("k1", fetcher),
  cache.get("k1", fetcher)
]);

assert.strictEqual(callCount, 1, "并发查询同一 key 时，fetcher 应当只被触发 1 次，实际触发了 " + callCount + " 次");