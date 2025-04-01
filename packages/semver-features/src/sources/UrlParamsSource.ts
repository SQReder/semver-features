/**
 * URL parameters-based feature state source
 */

import type { FeatureStateSource } from './types';

export interface UrlParamsSourceOptions {
  /**
   * Prefix for URL parameters (default: 'feature.')
   */
  prefix?: string;
}

export class UrlParamsSource implements FeatureStateSource {
  private prefix: string;

  constructor(options: UrlParamsSourceOptions = {}) {
    this.prefix = options.prefix ?? 'feature.';
  }

  getFeatureState(featureId: string) {
    console.debug('🔍 Checking URL params for feature:', featureId);
    const params = new URLSearchParams(window.location.search);
    const key = this.prefix + featureId;
    const value = params.get(key);
    
    console.debug(`🔑 Looking for key: ${key}`);
        
    if (value === null) {
      console.debug('❌ No value found for feature:', featureId);
      return undefined;
    }
    
    console.debug(`📦 Found value: ${value}`);
    
    try {
      const parsedValue = JSON.parse(value);
      console.debug(`✅ Successfully parsed value for ${featureId}:`, parsedValue);
      return parsedValue;
    } catch (error) {
      console.error(`💥 Failed to parse feature state for ${featureId}:`, error);
      return value;
    }
  }
} 