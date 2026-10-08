export class HeartbeatMonitor {
  constructor() {
    this.timer = null;
  }
  start(intervalMs, pingFn) {
    // BUG: 如果已经运行，再次调用 start 会导致旧 timer 句柄丢失且永不停止！
    this.timer = setInterval(pingFn, intervalMs);
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  isRunning() {
    return this.timer !== null;
  }
}