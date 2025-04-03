/**
 * Type definitions for the SemVer-based feature toggle library
 */

import { Range, SemVer } from "semver";
import type { FeatureStateSource } from "../sources/types";

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
   * The semver range expression or boolean value that determines if the feature is enabled
   * Can be a semver range expression (e.g. '>1.0.0', '1.x', etc.)
   * Can also be a boolean to explicitly enable/disable
   */
  versionsRange: Range | boolean;

  /**
   * Current application version
   */
  currentVersion: SemVer;

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