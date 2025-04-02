import { SemverFeaturesOptions } from "semver-features";
import { FeatureFlagsConfig } from "./types";
import { validateAndAssertConfig } from "./validator";
import { JsonSemverFeatures } from "./json-semver-features";

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
