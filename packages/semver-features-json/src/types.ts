import { Feature } from 'semver-features';
import { SemverFeaturesOptions } from 'semver-features';

/**
 * Type definitions for feature configuration based on schema
 */
export interface FeatureConfig {
  name: string;
  description: string;
  versionRange: string;
  enabledByDefault?: boolean;
  tags?: string[];
  deprecated?: boolean;
  owners?: string[];
  createdAt?: string;
  expiresAt?: string;
}

export interface FeatureFlagsConfig {
  $schema?: string;
  features: FeatureConfig[];
}

/**
 * Type to extract feature names from the config as a string literal union
 */
export type ExtractFeatureNames<T extends FeatureFlagsConfig> = T['features'][number]['name'];

/**
 * Options for creating JSON-based SemverFeatures
 */
export interface JsonSemverFeaturesOptions extends Omit<SemverFeaturesOptions, 'version'> {
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
  message: string;
  path?: string;
  keyword?: string;
}

/**
 * Schema validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
} 