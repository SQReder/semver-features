import { SemverFeaturesOptions } from "semver-features";

/**
 * Type definitions for feature configuration based on schema
 */
export interface FeatureConfig {
  /**
   * Unique code name of the feature, must start with a letter and contain only alphanumeric characters, underscores, or hyphens
   */
  readonly name: string;
  
  /**
   * Human-readable description of what the feature does
   */
  readonly description: string;
  
  /**
   * Semver range expression that specifies in which versions this feature is active
   */
  readonly versionRange: string;
  
  /**
   * Indicates whether this feature is deprecated and scheduled for removal
   */
  readonly deprecated?: boolean;
  
  /**
   * ISO 8601 date-time when this feature was created
   */
  readonly createdAt?: string;
}

/**
 * Configuration for feature flags using semver-based version control
 */
export interface FeatureFlagsConfig {
  /**
   * Path to the schema file
   */
  $schema?: string;
  
  /**
   * Array of feature flag configurations
   */
  readonly features: readonly FeatureConfig[];
}

/**
 * Type to extract feature names from the config as a string literal union
 */
export type ExtractFeatureNames<T extends FeatureFlagsConfig> =
  T["features"][number]["name"];

/**
 * Options for creating JSON-based SemverFeatures
 */
export interface JsonSemverFeaturesOptions
  extends Omit<SemverFeaturesOptions, "version"> {
  /**
   * Optional version to override the one from SemverFeaturesOptions
   * If not provided, version must be included in the main options
   */
  version?: string;
}

/**
 * Validation error information
 */
export interface ValidationError {
  /**
   * Error message describing the validation issue
   */
  message: string;
  
  /**
   * Path to the property that failed validation
   */
  path?: string;
  
  /**
   * Validation keyword that triggered the error
   */
  keyword?: string;
}

/**
 * Schema validation result
 */
export interface ValidationResult {
  /**
   * Whether the validation was successful
   */
  valid: boolean;
  
  /**
   * List of validation errors if any
   */
  errors: ValidationError[];
}
