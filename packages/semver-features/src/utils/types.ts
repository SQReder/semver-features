/**
 * Type definitions for the SemVer-based feature toggle library
 */

import type { FeatureStateSource } from '../sources/types';

// We'll make ReactNode optional and provide a fallback type
type ReactNodeType = any; // Fallback type when React is not available

/**
 * Type definitions for SemVer strings
 */
export type BaseSemver = `${number}.${number}.${number}`;
export type SemverWithSuffix = `${BaseSemver}-${string}`;
export type Semver = BaseSemver | SemverWithSuffix;

/**
 * Options for initializing the SemverFeatures class
 */
export interface SemverFeaturesOptions {
  /**
   * The current application version (required)
   */
  version: string;

  /**
   * Optional array of feature state sources
   */
  sources?: FeatureStateSource[];
}

/**
 * Options for creating a Feature instance
 */
export interface FeatureOptions {
  /**
   * Unique name for the feature
   */
  name: string;
  
  /**
   * Minimum semver version required for this feature
   * Can also be a boolean to explicitly enable/disable
   */
  minVersion: Semver | boolean;
  
  /**
   * Current application version
   */
  currentVersion: string;

  /**
   * Optional array of feature state sources
   */
  sources?: FeatureStateSource[];
}

/**
 * Options for execution with a feature
 */
export interface ExecuteOptions<R> {
  /**
   * Function to execute when feature is enabled
   */
  enabled: () => R;
  
  /**
   * Function to execute when feature is disabled
   */
  disabled: () => R;
}

/**
 * Options for component rendering with a feature
 */
export interface RenderOptions<T, U> {
  /**
   * Function that returns the component to render when feature is enabled
   */
  enabled: () => T;
  
  /**
   * Function that returns the component to render when feature is disabled
   */
  disabled: () => U;
}

/**
 * Options for React component rendering with a feature
 */
export interface RenderComponentOptions<T, U> {
  /**
   * Function that returns the React component to render when feature is enabled
   */
  enabled: () => T;
  
  /**
   * Function that returns the React component to render when feature is disabled
   */
  disabled: () => U;
}

/**
 * Options for selecting between enabled and disabled values
 */
export interface SelectOptions<T, U> {
  /**
   * Value to use when feature is enabled
   */
  enabled: T;
  
  /**
   * Value to use when feature is disabled
   */
  disabled: U;
}

/**
 * Options for mapping between enabled and disabled values
 */
export interface MapOptions<T, U, V, W> {
  /**
   * Function to transform the enabled value
   */
  enabled: (value: T) => V;
  
  /**
   * Function to transform the disabled value
   */
  disabled: (value: U) => W;
}

/**
 * Options for folding enabled and disabled values into a single result
 */
export interface FoldOptions<T, U, R> {
  /**
   * Function to transform the enabled value to the result type
   */
  enabled: (value: T) => R;
  
  /**
   * Function to transform the disabled value to the result type
   */
  disabled: (value: U) => R;
} 