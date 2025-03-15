/**
 * Main feature manager implementation
 */

import { Feature } from './Feature';
import type { SemverFeaturesOptions, VersionedApiConfig } from '../utils/types';
import { createVersionedApi } from '../api/versioned-api';

/**
 * Main class for managing semver-based feature toggles
 */
export class SemverFeatures {
  private version: string;
  private features: Map<string, Feature<any, any>>;

  /**
   * Create a new feature manager
   * @param options Configuration options with explicit version
   */
  constructor(options: SemverFeaturesOptions) {
    if (!options.version) {
      throw new Error('Version must be explicitly provided');
    }
    this.version = options.version;
    this.features = new Map();
  }

  /**
   * Get the current application version
   */
  get currentVersion(): string {
    return this.version;
  }

  /**
   * Register a new feature with version requirements
   * @param name Unique feature name
   * @param minVersion Minimum version required for this feature
   * @returns Feature entity that can be used for checking and rendering
   */
  register<T = unknown, U = unknown>(name: string, minVersion: string): Feature<T, U> {
    // Return existing feature if already registered
    if (this.features.has(name)) {
      return this.features.get(name) as Feature<T, U>;
    }

    // Create new feature
    const feature = new Feature<T, U>({
      name,
      minVersion,
      currentVersion: this.version
    });
    
    // Store for future reference
    this.features.set(name, feature);
    return feature;
  }

  /**
   * Create a versioned API with different implementations based on versions
   * @param name API name for identification
   * @param config Configuration with different API versions
   * @returns API instance with methods from the highest compatible version
   */
  createVersionedApi<T extends Record<string, any>>(
    name: string, 
    config: VersionedApiConfig<T>
  ): T {
    return createVersionedApi<T>(this.version, config);
  }
} 