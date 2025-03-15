/**
 * Versioned API implementation
 */

import { compareSemver } from '../core/semver';
import type { VersionedApiConfig, ApiVersionConfig } from '../utils/types';

/**
 * Create a versioned API that automatically selects the highest compatible version
 * @param currentVersion Current application version
 * @param config Configuration with different API versions
 * @returns API instance with methods from the highest compatible version
 */
export function createVersionedApi<T extends Record<string, any>>(
  currentVersion: string,
  config: VersionedApiConfig<T>
): T {
  // Sort versions by semver (highest to lowest)
  const sortedVersionKeys = Object.keys(config.versions).sort((a, b) => {
    const versionA = config.versions[a].minVersion;
    const versionB = config.versions[b].minVersion;
    return -compareSemver(versionA, versionB); // Negative for descending order
  });

  // Find the highest compatible version
  const activeVersionKey = sortedVersionKeys.find(key => {
    const minVersion = config.versions[key].minVersion;
    return compareSemver(currentVersion, minVersion) >= 0;
  });

  if (!activeVersionKey) {
    throw new Error(`No compatible API version found for ${currentVersion}`);
  }

  const activeVersion = config.versions[activeVersionKey];
  
  // Create proxy to handle method calls
  return new Proxy({} as T, {
    get(target, prop: string) {
      if (typeof activeVersion[prop] === 'function') {
        return activeVersion[prop].bind(activeVersion);
      }
      return activeVersion[prop];
    }
  });
} 