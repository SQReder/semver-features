/**
 * URL parameters-based feature state source
 */

import type { FeatureState, FeatureStateSource } from './types';
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
    this.prefix = options.prefix || 'feature.';
  }

  private getParamName(featureId: string): string {
    return `${this.prefix}${featureId}`;
  }

  getFeatureState(featureId: string): FeatureState | undefined {
    try {
      const params = new URLSearchParams(window.location.search);
      const value = params.get(this.getParamName(featureId));
      return parseSourceValue(value);
    } catch (e) {
      // In case window is not available (SSR)
      return undefined;
    }
  }
} 