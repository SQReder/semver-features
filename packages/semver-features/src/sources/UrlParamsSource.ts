/**
 * URL parameters-based feature state source
 */

import type { FeatureStateSource } from "./types";

export interface UrlParamsSourceOptions {
  /**
   * Prefix for URL parameters (default: 'feature.')
   */
  prefix?: string;
}

export class UrlParamsSource implements FeatureStateSource {
  private prefix: string;

  constructor(options: UrlParamsSourceOptions = {}) {
    this.prefix = options.prefix ?? "feature.";
  }

  getFeatureState(featureId: string) {
    const params = new URLSearchParams(window.location.search);
    const key = this.prefix + featureId;
    const value = params.get(key);

    if (value === null) {
      return undefined;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }
}
