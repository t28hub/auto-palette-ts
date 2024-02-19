/**
 * Check if the current environment is a browser.
 *
 * @return True if the current environment is a browser, false otherwise.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if the current environment is a web worker.
 *
 * @return True if the current environment is a web worker, false otherwise.
 */
export function isWebWorker(): boolean {
  return typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
}
