/**
 * Functional programming utilities
 */

/**
 * Identity function that returns the input unchanged
 * @param x Input value
 * @returns The same value
 */
export function identity<T>(x: T): T {
  return x;
}

/**
 * Compose multiple functions into a single function
 * @param fns Functions to compose, from right to left
 * @returns Composed function
 */
export function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}

/**
 * Create a function that will be called only once
 * @param fn Function to memoize
 * @returns Function that calls the original function only once
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  }) as T;
}

/**
 * Memoize a function to cache results
 * @param fn Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
} 