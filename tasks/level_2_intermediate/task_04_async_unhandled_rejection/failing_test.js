import { SafeTaskQueue } from './source.js';
import assert from 'node:assert';

const queue = new SafeTaskQueue();
let secondExecuted = false;

const task1 = queue.enqueue(async () => { throw new Error("Task 1 failed"); }).catch(() => {});
const task2 = queue.enqueue(async () => {
  secondExecuted = true;
  return "OK";
});

await Promise.all([task1, task2]);
assert.strictEqual(secondExecuted, true, "任务 1 发生异常失败后，任务 2 必须仍能正常执行，队列不可被阻断！");