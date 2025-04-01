/**
 * Main feature manager implementation
 */

import { Feature } from './Feature';
import type { Semver, SemverFeaturesOptions } from '../utils/types';
import type { FeatureStateSource } from '../sources/types';
import { Range, SemVer } from 'semver';
import { asRange } from '../utils/asRange';

/**
 * Main class for managing semver-based feature toggles
 */
export class SemverFeatures {
  private version: SemVer;
  private features: Map<string, Feature>;
  private sources: FeatureStateSource[];

  /**
   * Create a new feature manager
   * @param options Configuration options with explicit version
   */
  constructor(options: SemverFeaturesOptions) {
    if (!options.version) {
      throw new Error('Version must be explicitly provided');
    }
    this.version = new SemVer(options.version);
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
   * Returns information about all registered features
   * @returns Array of feature information with name and enabled status
   */
  dumpFeatures(): Array<{name: string, enabled: boolean}> {
    const featureInfo = Array.from(this.features.entries()).map(([name, feature]) => ({
      name,
      enabled: feature.isEnabled
    }));
    
    return featureInfo;
  }

  /**
   * Get the current application version
   */
  get currentVersion(): string {
    return this.version.format();
  }

  /**
   * Register a new feature with version requirements or explicit state
   * @param name Unique feature name
   * @param minVersion Minimum version required for this feature,
   *                  or a boolean to explicitly enable/disable
   * @returns Feature entity that can be used for checking and rendering
   */
  register(
    name: string, 
    versionsRange: string | boolean
  ): Feature {
    // Return existing feature if already registered
    if (this.features.has(name)) {
      return this.features.get(name) as Feature;
    }

    // Create new feature
    const feature = new Feature({
      name,
      versionsRange: typeof versionsRange === 'string' ? asRange(versionsRange) : versionsRange,
      currentVersion: this.version,
      sources: this.sources
    });
    
    // Store for future reference
    this.features.set(name, feature);
    return feature;
  }
} 