import {
  Feature,
  SemverFeatures,
  SemverFeaturesOptions,
} from "semver-features";
import { ExtractFeatureNames, FeatureFlagsConfig } from "./types";

/**
 * SemverFeatures class extended with strongly typed feature access
 */
export class JsonSemverFeatures<
  const T extends FeatureFlagsConfig
> extends SemverFeatures {
  private featureConfig: T;
  private featureNameMap: Map<string, Feature>;

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
      const versionOrBoolean = featureConfig.versionRange;

      const feature = super.register(
        featureConfig.name,
        versionOrBoolean as any
      );

      this.featureNameMap.set(featureConfig.name, feature);
    }
  }

  /**
   * Get a feature by name with strong typing
   * @param name The name of the feature
   * @returns The Feature instance
   * @throws Error if the feature does not exist
   */
  get<K extends ExtractFeatureNames<T>>(name: K): Feature {
    const feature = this.featureNameMap.get(name);
    if (!feature) {
      throw new Error(`Feature '${name}' does not exist`);
    }
    return feature;
  }

  /**
   * Check if a feature is enabled
   * @param name The name of the feature
   * @returns Whether the feature is enabled
   * @throws Error if the feature does not exist
   */
  isEnabled<K extends ExtractFeatureNames<T>>(name: K): boolean {
    const feature = this.get(name);
    return feature.isEnabled;
  }

  /**
   * Get all registered features from the configuration
   * @returns Map of feature names to Feature instances
   */
  getAllFeatures(): Map<ExtractFeatureNames<T>, Feature> {
    return this.featureNameMap as Map<ExtractFeatureNames<T>, Feature>;
  }
} 