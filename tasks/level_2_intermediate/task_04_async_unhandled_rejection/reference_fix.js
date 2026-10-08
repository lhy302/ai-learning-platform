export class SafeTaskQueue {
  constructor() {
    this.chain = Promise.resolve();
  }
  enqueue(taskFn) {
    let resolveTask, rejectTask;
    const taskPromise = new Promise((resolve, reject) => {
      resolveTask = resolve;
      rejectTask = reject;
    });

    this.chain = this.chain.then(async () => {
      try {
        const val = await taskFn();
        resolveTask(val);
      } catch (err) {
        rejectTask(err);
      }
    });

    return taskPromise;
  }
}