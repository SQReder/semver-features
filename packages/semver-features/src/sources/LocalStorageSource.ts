/**
 * LocalStorage-based feature state source
 */

import type { FeatureState, FeatureStateSource } from './types';
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
    this.prefix = options.prefix || 'feature.';
  }

  private getKey(featureId: string): string {
    return `${this.prefix}${featureId}`;
  }

  getFeatureState(featureId: string): FeatureState | undefined {
    try {
      const value = localStorage.getItem(this.getKey(featureId));
      return parseSourceValue(value);
    } catch (e) {
      // In case localStorage is not available
      return undefined;
    }
  }
} 