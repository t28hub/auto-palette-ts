export function timed<T>(label: string, callable: () => Promise<T>): Promise<T> {
  console.time(label);
  return callable().finally(() => console.timeEnd(label));
}
