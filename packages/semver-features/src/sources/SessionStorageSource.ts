/**
 * SessionStorage-based feature state source
 */

import type { FeatureStateSource } from './types';

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

  getFeatureState(featureId: string) {
    const key = this.prefix + featureId;
    const value = sessionStorage.getItem(key);
    
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