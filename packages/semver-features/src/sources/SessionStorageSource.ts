/**
 * SessionStorage-based feature state source
 */

import type { FeatureAvailability, FeatureStateSource } from './types';
import { parseSourceValue } from './valueParser';

export interface SessionStorageSourceOptions {
  /**
   * Prefix for sessionStorage keys (default: 'feature.')
   */
  prefix?: string;
}

export class SessionStorageSource implements FeatureStateSource {
  private prefix: string;

  constructor(options: SessionStorageSourceOptions = {}) {
    this.prefix = options.prefix ?? 'feature.';
  }

  getFeatureState(featureId: string): FeatureAvailability | undefined {
    const key = this.prefix + featureId;
    const value = sessionStorage.getItem(key);
    return parseSourceValue(value);
  }
} 