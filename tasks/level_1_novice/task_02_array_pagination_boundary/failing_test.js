import { paginate } from './source.js';
import assert from 'node:assert';

const list = [1, 2, 3, 4];
const res = paginate(list, 2, 2); // 第 2 页，每页 2 条，刚好完结
assert.strictEqual(res.hasNext, false, "当恰好是最后一页数据时，hasNext 必须为 false");