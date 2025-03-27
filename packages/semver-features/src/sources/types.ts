/**
 * Feature source type definitions
 */

import type { Semver } from '../utils/types';

/**
 * Feature state that can be returned by a source
 */
export type FeatureState = boolean | Semver;

/**
 * Interface for feature state sources
 */
export interface FeatureStateSource {
  /**
   * Get feature state for a given feature ID
   * @param featureId The unique identifier of the feature
   * @returns Feature state if available, undefined otherwise
   */
  getFeatureState(featureId: string): FeatureState | undefined;

  /**
   * Optional initialization method
   */
  initialize?(): Promise<void> | void;
} 