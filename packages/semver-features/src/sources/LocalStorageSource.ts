/**
 * LocalStorage-based feature state source
 */

import type { FeatureAvailability, FeatureStateSource } from './types';
import { parseSourceValue } from './valueParser';

export interface LocalStorageSourceOptions {
  /**
   * Prefix for localStorage keys (default: 'feature.')
   */
  prefix?: string;
}

export class LocalStorageSource implements FeatureStateSource {
  private prefix: string;

  constructor(options: LocalStorageSourceOptions = {}) {
    this.prefix = options.prefix ?? 'feature.';
  }

  getFeatureState(featureId: string): FeatureAvailability | undefined {
    const key = this.prefix + featureId;
    const value = localStorage.getItem(key);
    return parseSourceValue(value);
  }
} 