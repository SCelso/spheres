export class WorkerPool<T> {
  workerPath;
  pool: { worker: Worker; busy: boolean }[];
  queue: { taskData: unknown; resolve: (e: T) => void }[];

  constructor(workerPath: string, poolSize: number) {
    this.workerPath = workerPath;
    this.pool = Array(poolSize)
      .fill({})
      .map(() => ({
        worker: new Worker(workerPath, { type: "module" }),
        busy: false,
      }));
    this.queue = [];
  }

  executeTask(taskData: unknown): Promise<T> {
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

  runTask(
    worker: { worker: Worker; busy: boolean },
    taskData: unknown,
    resolve: (e: T) => void
  ) {
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
      const item = this.queue.shift();
      if (item) {
        const { taskData, resolve } = item;
        const worker = this.getAvailableWorker();
        if (worker) this.runTask(worker, taskData, resolve);
      }
    }
  }

  terminateAll() {
    this.pool.forEach((w) => w.worker.terminate());
  }
}
