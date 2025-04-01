/**
 * LocalStorage-based feature state source
 */

import type { FeatureStateSource } from './types';

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

  getFeatureState(featureId: string) {
    const key = this.prefix + featureId;
    const value = localStorage.getItem(key);
    
    if (value === null) {
      return undefined;
    }
    
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Failed to parse feature state for ${featureId}:`, error);
      return value;
    }
  }
} 