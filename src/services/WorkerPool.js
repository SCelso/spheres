export class WorkerPool {
  constructor(workerPath, poolSize) {
    this.workerPath = workerPath;
    this.pool = Array(poolSize)
      .fill()
      .map(() => ({
        worker: new Worker(workerPath, { type: "module" }),
        busy: false,
      }));
    this.queue = [];
  }

  executeTask(taskData) {
    return new Promise((resolve) => {
      const worker = this.getAvailableWorker();
      if (worker) {
        this.runTask(worker, taskData, resolve);
      } else {
        this.queue.push({ taskData, resolve });
      }
    });
  }

  getAvailableWorker() {
    return this.pool.find((w) => !w.busy);
  }

  runTask(worker, taskData, resolve) {
    worker.busy = true;
    worker.worker.onmessage = (e) => {
      resolve(e.data);
      worker.busy = false;
      this.processQueue();
    };
    worker.worker.postMessage(taskData);
  }

  processQueue() {
    if (this.queue.length > 0) {
      const { taskData, resolve } = this.queue.shift();
      const worker = this.getAvailableWorker();
      if (worker) this.runTask(worker, taskData, resolve);
    }
  }

  terminateAll() {
    this.pool.forEach((w) => w.worker.terminate());
  }
}
