/**
 * Async-based feature state source
 */

import type { FeatureStateSource } from "./types";

export interface AsyncSourceOptions {
  /**
   * Function that fetches feature states asynchronously
   */
  fetchStates: () => Promise<Record<string, string | boolean>>;

  /**
   * Whether to fetch data on initialization (default: true)
   */
  fetchOnInit?: boolean;
}

export class AsyncSource implements FeatureStateSource {
  private states: Record<string, string | boolean> = {};
  private fetchStates: () => Promise<Record<string, string | boolean>>;
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
    this.states = await this.fetchStates();
  }

  getFeatureState(featureId: string) {
    return this.states[featureId];
  }
}
