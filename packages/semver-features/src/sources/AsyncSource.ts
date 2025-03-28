/**
 * Async-based feature state source
 */

import type { FeatureAvailability, FeatureStateSource } from './types';
import { parseSourceValue } from './valueParser';

export interface AsyncSourceOptions {
  /**
   * Function that fetches feature states asynchronously
   */
  fetchStates: () => Promise<Record<string, FeatureAvailability | string | boolean>>;

  /**
   * Whether to fetch data on initialization (default: true)
   */
  fetchOnInit?: boolean;
}

export class AsyncSource implements FeatureStateSource {
  private states: Record<string, FeatureAvailability> = {};
  private fetchStates: () => Promise<Record<string, FeatureAvailability | string | boolean>>;
  private fetchOnInit: boolean;

  constructor(options: AsyncSourceOptions) {
    this.fetchStates = options.fetchStates;
    this.fetchOnInit = options.fetchOnInit ?? true;
  }

  async initialize(): Promise<void> {
    if (this.fetchOnInit) {
      await this.refresh();
    }
  }

  async refresh(): Promise<void> {
    const rawStates = await this.fetchStates();
    const states: Record<string, FeatureAvailability> = {};

    // Parse raw values into proper feature states
    for (const [key, value] of Object.entries(rawStates)) {
      if (typeof value === 'boolean') {
        states[key] = value;
      } else {
        const parsed = parseSourceValue(String(value));
        if (parsed !== undefined) {
          states[key] = parsed;
        }
      }
    }

    this.states = states;
  }

  getFeatureState(featureId: string): FeatureAvailability | undefined {
    return this.states[featureId];
  }
} 