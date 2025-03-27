/**
 * Async-based feature state source
 */

import type { FeatureState, FeatureStateSource } from './types';
import { parseSourceValue } from './valueParser';

export interface AsyncSourceOptions {
  /**
   * Function that fetches feature states asynchronously
   */
  fetchStates: () => Promise<Record<string, FeatureState | string | boolean>>;

  /**
   * Whether to fetch data on initialization (default: true)
   */
  fetchOnInit?: boolean;
}

export class AsyncSource implements FeatureStateSource {
  private states: Record<string, FeatureState> = {};
  private fetchStates: () => Promise<Record<string, FeatureState | string | boolean>>;
  private initialized: boolean = false;

  constructor(options: AsyncSourceOptions) {
    this.fetchStates = options.fetchStates;
    
    // Fetch on init by default
    if (options.fetchOnInit !== false) {
      this.initialize();
    }
  }

  /**
   * Initialize by fetching feature states
   */
  async initialize(): Promise<void> {
    try {
      const rawStates = await this.fetchStates();
      
      // Convert all values to proper feature states
      const states: Record<string, FeatureState> = {};
      
      for (const [key, value] of Object.entries(rawStates)) {
        // Handle boolean values directly
        if (typeof value === 'boolean') {
          states[key] = value;
          continue;
        }
        
        // Handle string values using our common parser
        if (typeof value === 'string') {
          const parsedValue = parseSourceValue(value);
          if (parsedValue !== undefined) {
            states[key] = parsedValue;
            continue;
          }
        }
        
        // Skip invalid values
        console.warn(`Invalid feature state value for "${key}":`, value);
      }
      
      this.states = states;
      this.initialized = true;
    } catch (error) {
      console.warn('Error fetching feature states:', error);
    }
  }

  /**
   * Get feature state from cached states
   */
  getFeatureState(featureId: string): FeatureState | undefined {
    if (!this.initialized) {
      return undefined;
    }
    
    return this.states[featureId];
  }
} 