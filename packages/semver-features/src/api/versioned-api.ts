/**
 * Versioned API implementation with improved type safety
 */

import * as semver from 'semver';

/**
 * Check if a specific API version is available based on the current application version
 * 
 * @param currentVersion Current application version
 * @param minVersion Minimum version required for the API version
 * @returns True if the API version is available
 */
export function isApiVersionAvailable(
  currentVersion: string,
  minVersion: string
): boolean {
  return semver.compare(currentVersion, minVersion) >= 0;
}

/**
 * Version-specific API helper that provides type-safe access to version-specific methods
 * 
 * @param currentVersion Current application version
 * @param minVersion Minimum version required for this API version
 * @param api The API instance
 * @param method Function to execute if version is available
 * @param fallback Function to execute if version is not available
 * @returns Result of the method or fallback
 */
export function withVersionedMethod<TApi, TResult>(
  currentVersion: string,
  minVersion: string,
  api: TApi,
  method: (api: TApi) => TResult,
  fallback: () => TResult
): TResult {
  if (isApiVersionAvailable(currentVersion, minVersion)) {
    return method(api);
  }
  return fallback();
} 