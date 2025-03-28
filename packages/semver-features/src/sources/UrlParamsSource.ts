/**
 * URL parameters-based feature state source
 */

import type { FeatureAvailability, FeatureStateSource } from './types';
import { parseSourceValue } from './valueParser';

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

  getFeatureState(featureId: string): FeatureAvailability | undefined {
    const params = new URLSearchParams(window.location.search);
    const key = this.prefix + featureId;
    const value = params.get(key);
    return parseSourceValue(value);
  }
} 