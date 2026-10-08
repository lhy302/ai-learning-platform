import { HeartbeatMonitor } from './source.js';
import assert from 'node:assert';

const monitor = new HeartbeatMonitor();
let pingCount = 0;
const ping = () => { pingCount++; };

// 连续触发两次 start
monitor.start(20, ping);
monitor.start(20, ping);

// 调用 stop 停止
monitor.stop();

const countAfterStop = pingCount;
await new Promise(r => setTimeout(r, 60));

assert.strictEqual(pingCount, countAfterStop, "在调用 stop() 之后，心跳函数不应继续被孤儿定时器触发！");