export class BatchExecutor {
  constructor() {
    // BUG: AI 假设实例只用一次，将结果数组定义在实例属性上
    this.results = [];
  }
  async executeBatch(tasks) {
    for (const task of tasks) {
      try {
        const data = await task();
        this.results.push({ success: true, data });
      } catch (err) {
        this.results.push({ success: false, error: err });
      }
    }
    return this.results;
  }
}