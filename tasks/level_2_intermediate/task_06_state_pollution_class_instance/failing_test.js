import { BatchExecutor } from './source.js';
import assert from 'node:assert';

const executor = new BatchExecutor();
await executor.executeBatch([async () => 'A']);
const res2 = await executor.executeBatch([async () => 'B']);

assert.strictEqual(res2.length, 1, "第二次执行只有 1 个任务，返回数组长度必须为 1，实际长度为 " + res2.length);