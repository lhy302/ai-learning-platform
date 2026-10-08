export class BatchExecutor {
  async executeBatch(tasks) {
    const results = [];
    for (const task of tasks) {
      try {
        const data = await task();
        results.push({ success: true, data });
      } catch (err) {
        results.push({ success: false, error: err });
      }
    }
    return results;
  }
}