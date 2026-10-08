export class SafeTaskQueue {
  constructor() {
    this.chain = Promise.resolve();
  }
  enqueue(taskFn) {
    // BUG: 直接将 taskFn 串入 this.chain，前置错误会导致后续所有 then 链断裂被跳过！
    const p = this.chain.then(() => taskFn());
    this.chain = p;
    return p;
  }
}