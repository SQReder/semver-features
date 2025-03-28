/**
 * Feature source type definitions
 */

import type { Semver } from '../utils/types';

/**
 * Represents whether a feature is available via boolean or version requirement
 */
export type FeatureAvailability = boolean | Semver;

/**
 * Interface for feature state sources
 */
export interface FeatureStateSource {
  /**
   * Get feature availability for a given feature ID
   * @param featureId The unique identifier of the feature
   * @returns Feature availability if available, undefined otherwise
   */
  getFeatureState(featureId: string): FeatureAvailability | undefined;

  /**
   * Optional initialization method
   */
  initialize?(): Promise<void> | void;
} 