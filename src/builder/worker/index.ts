import Worker from './worker?worker&inline';

let worker: Worker | undefined;

/**
 * Return the default worker.
 *
 * @return The default worker.
 */
export function defaultWorker(): Worker {
  if (!worker) {
    return (worker = new Worker());
  }
  return worker;
}
