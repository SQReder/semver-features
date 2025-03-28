import { SemverFeatures, Feature } from 'semver-features';
import { SemverFeaturesOptions } from 'semver-features';
import { FeatureFlagsConfig, ExtractFeatureNames, JsonSemverFeaturesOptions } from './types';
import { validateAndAssertConfig } from './validator';
import schema from './schema';

/**
 * SemverFeatures class extended with strongly typed feature access
 */
export class JsonSemverFeatures<T extends FeatureFlagsConfig> extends SemverFeatures {
  private featureConfig: T;
  private featureNameMap: Map<string, Feature<unknown, unknown>>;

  /**
   * Create a new instance of JsonSemverFeatures
   * @param config The validated feature configuration
   * @param options SemverFeatures options
   */
  constructor(config: T, options: SemverFeaturesOptions) {
    super(options);
    this.featureConfig = config;
    this.featureNameMap = new Map();
    this.registerFeaturesFromConfig();
  }

  /**
   * Register all features from the configuration
   */
  private registerFeaturesFromConfig(): void {
    for (const featureConfig of this.featureConfig.features) {
      // Register feature using the versionRange or enabledByDefault
      const featureEnabled = featureConfig.enabledByDefault ?? false;
      
      // If versionRange is provided, use it as a semver string
      // otherwise use the enabledByDefault value as a boolean
      const versionOrBoolean = featureConfig.versionRange 
        ? featureConfig.versionRange  // This is a Semver string
        : featureEnabled;             // This is a boolean fallback
        
      const feature = super.register<unknown, unknown>(
        featureConfig.name, 
        versionOrBoolean as any
      );
      
      this.featureNameMap.set(featureConfig.name, feature);
    }
  }

  /**
   * Get a feature by name with strong typing
   * @param name The name of the feature
   * @returns The Feature instance or undefined if not found
   */
  get<K extends ExtractFeatureNames<T>>(name: K): Feature<unknown, unknown> | undefined {
    return this.featureNameMap.get(name);
  }

  /**
   * Check if a feature is enabled
   * @param name The name of the feature
   * @returns Whether the feature is enabled
   */
  isEnabled<K extends ExtractFeatureNames<T>>(name: K): boolean {
    const feature = this.get(name);
    return feature ? feature.isEnabled : false;
  }

  /**
   * Get all registered features from the configuration
   * @returns Map of feature names to Feature instances
   */
  getAllFeatures(): Map<ExtractFeatureNames<T>, Feature<unknown, unknown>> {
    return this.featureNameMap as Map<ExtractFeatureNames<T>, Feature<unknown, unknown>>;
  }
}

/**
 * Get Zod schema for feature configuration
 * @returns The Zod schema
 */
export function getSchema() {
  return schema;
}

/**
 * Factory function to create a new JsonSemverFeatures instance from a JSON configuration
 * @param config The feature configuration object (will be validated)
 * @param options Additional options for SemverFeatures
 * @returns A new JsonSemverFeatures instance
 */
export function createSemverFeaturesJson<T extends object>(
  config: T, 
  options: SemverFeaturesOptions
): JsonSemverFeatures<T & FeatureFlagsConfig> {
  // Validate the configuration
  const validatedConfig = validateAndAssertConfig(config);
  
  // Create the instance with the validated config
  return new JsonSemverFeatures<T & FeatureFlagsConfig>(
    config as T & FeatureFlagsConfig, 
    options
  );
}

// Re-export types
export * from './types';
export { validateFeatureConfig, validateAndAssertConfig } from './validator';
