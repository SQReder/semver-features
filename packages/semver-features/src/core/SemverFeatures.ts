/**
 * Main feature manager implementation
 */

import { Feature } from './Feature';
import type { Semver, SemverFeaturesOptions } from '../utils/types';
import type { FeatureStateSource } from '../sources/types';
import { isApiVersionAvailable } from '../api/versioned-api';

/**
 * Main class for managing semver-based feature toggles
 */
export class SemverFeatures {
  private version: string;
  private features: Map<string, Feature<any, any>>;
  private sources: FeatureStateSource[];

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
    this.sources = options.sources || [];

    // Initialize sources if needed
    this.sources.forEach(source => {
      if (source.initialize) {
        source.initialize();
      }
    });
  }

  /**
   * Dumps information about all registered features to console
   * @returns Array of feature information (for testing purposes)
   */
  dumpFeatures(): Array<{name: string, enabled: boolean}> {
    const featureInfo = Array.from(this.features.entries()).map(([name, feature]) => ({
      name,
      enabled: feature.isEnabled
    }));
    
    console.table(featureInfo);
    return featureInfo;
  }

  /**
   * Get the current application version
   */
  get currentVersion(): string {
    return this.version;
  }

  /**
   * Register a new feature with version requirements or explicit state
   * @param name Unique feature name
   * @param minVersion Minimum version required for this feature,
   *                  or a boolean to explicitly enable/disable
   * @returns Feature entity that can be used for checking and rendering
   */
  register<T = unknown, U = unknown>(
    name: string, 
    minVersion: Semver | boolean
  ): Feature<T, U> {
    // Return existing feature if already registered
    if (this.features.has(name)) {
      return this.features.get(name) as Feature<T, U>;
    }

    // Create new feature
    const feature = new Feature<T, U>({
      name,
      minVersion,
      currentVersion: this.version,
      sources: this.sources
    });
    
    // Store for future reference
    this.features.set(name, feature);
    return feature;
  }
} 