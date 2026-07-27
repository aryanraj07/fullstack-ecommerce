export function debounce<T extends (...args: string[]) => void>(
  fn: T,
  delay: number
) {
  let timerId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
