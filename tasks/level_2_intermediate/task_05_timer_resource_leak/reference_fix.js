export class HeartbeatMonitor {
  constructor() {
    this.timer = null;
  }
  start(intervalMs, pingFn) {
    this.stop(); // 启动前先防御性清理历史句柄
    this.timer = setInterval(pingFn, intervalMs);
  }
  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  isRunning() {
    return this.timer !== null;
  }
}