import { SnowflakeIdGenerator } from './source.js';
import assert from 'node:assert';

const gen = new SnowflakeIdGenerator(1);
const origNow = Date.now;

try {
  let simulatedTime = 1700000000000;
  Date.now = () => simulatedTime;

  const id1 = gen.nextId();
  // 模拟 NTP 发生 50ms 时钟回拨
  simulatedTime -= 50;

  let threw = false;
  try {
    const id2 = gen.nextId();
  } catch (err) {
    threw = true;
  }

  assert.strictEqual(threw, true, "当系统发生时钟回拨时，雪花生成器必须抛出异常阻断，绝不允许生成重复 ID！");
} finally {
  Date.now = origNow;
}