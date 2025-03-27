/**
 * SessionStorage-based feature state source
 */

import type { FeatureState, FeatureStateSource } from './types';
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
    this.prefix = options.prefix || 'feature.';
  }

  private getKey(featureId: string): string {
    return `${this.prefix}${featureId}`;
  }

  getFeatureState(featureId: string): FeatureState | undefined {
    try {
      const value = sessionStorage.getItem(this.getKey(featureId));
      return parseSourceValue(value);
    } catch (e) {
      // In case sessionStorage is not available
      return undefined;
    }
  }
} 