/**
 * Feature entity implementation
 */

import * as semver from 'semver';
import type { FeatureOptions, RenderOptions, SelectOptions, MapOptions, FoldOptions, ExecuteOptions, RenderComponentOptions } from '../utils/types';

/**
 * FeatureValue class for handling feature-dependent values and transformations
 */
export class FeatureValue<E, D> {
  readonly value: E | D;
  private readonly isEnabled: boolean;
  private readonly enabledValue: E | undefined;
  private readonly disabledValue: D | undefined;

  constructor(value: E | D, isEnabled: boolean) {
    this.value = value;
    this.isEnabled = isEnabled;
    
    if (isEnabled) {
      this.enabledValue = value as E;
    } else {
      this.disabledValue = value as D;
    }
  }

  /**
   * Transform both enabled and disabled values to new types
   * @param options Object with transform functions for both states
   * @returns A new FeatureValue with transformed values
   */
  map<NE, ND>(options: MapOptions<E, D, NE, ND>): FeatureValue<NE, ND> {
    if (this.isEnabled && this.enabledValue !== undefined) {
      return new FeatureValue<NE, ND>(
        options.enabled(this.enabledValue), 
        true
      );
    } else if (!this.isEnabled && this.disabledValue !== undefined) {
      return new FeatureValue<NE, ND>(
        options.disabled(this.disabledValue), 
        false
      );
    }
    
    throw new Error('Invalid state in FeatureValue.map');
  }

  /**
   * Collapse both enabled and disabled values to a common result type
   * @param options Object with transform functions for both states
   * @returns The result of applying the appropriate transform function
   */
  fold<R>(options: FoldOptions<E, D, R>): R {
    if (this.isEnabled && this.enabledValue !== undefined) {
      return options.enabled(this.enabledValue);
    } else if (!this.isEnabled && this.disabledValue !== undefined) {
      return options.disabled(this.disabledValue);
    }
    
    throw new Error('Invalid state in FeatureValue.fold');
  }
}

/**
 * Feature entity representing a feature toggle based on semver
 */
export class Feature<T = unknown, U = unknown> {
  private name: string;
  private enabled: boolean;
  
  /**
   * Create a new feature
   * @param options Configuration options
   */
  constructor(options: FeatureOptions) {
    this.name = options.name;
    // Feature is enabled if current version >= min version
    this.enabled = semver.gte(options.currentVersion, options.minVersion);
  }

  /**
   * Check if feature is enabled
   */
  get isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Execute appropriate function based on feature status
   * @param options Object with functions for both states
   * @returns The result of the executed function
   */
  execute<R>(options: ExecuteOptions<R>): R {
    return this.enabled ? options.enabled() : options.disabled();
  }

  /**
   * Execute appropriate async function based on feature status
   * @param options Object with async functions for both states
   * @returns Promise with the result of the executed function
   */
  executeAsync<R>(options: ExecuteOptions<Promise<R>>): Promise<R> {
    return this.enabled ? options.enabled() : options.disabled();
  }

  /**
   * Execute a function only when feature is enabled
   * @param fn Function to execute when feature is enabled
   */
  when(fn: () => void): void {
    if (this.enabled) {
      fn();
    }
  }

  /**
   * Create a method that's only available when this feature is enabled
   * This provides a type-safe way to access methods that depend on this feature
   * 
   * @param implementation Method implementation to use when feature is enabled
   * @returns A function that returns null when feature is not enabled
   */
  createMethod<TArgs extends any[], TResult>(
    implementation: (...args: TArgs) => TResult
  ): (...args: TArgs) => TResult | null {
    return (...args: TArgs): TResult | null => {
      if (this.enabled) {
        return implementation(...args);
      }
      return null;
    };
  }

  /**
   * Render appropriate component based on feature status
   * @param options Object with components for both states
   * @returns The appropriate component
   */
  render<C = any>(options: RenderComponentOptions<C>): C {
    return this.enabled ? options.enabled : options.disabled;
  }

  /**
   * Render appropriate component based on feature status (legacy API)
   * @param options Object with render functions for both states
   * @returns The appropriate component
   */
  renderComponent<C = any, D = any>(
    options: RenderOptions<C, D>
  ): C | D {
    return this.enabled ? options.enabled() : options.disabled();
  }

  /**
   * Select appropriate value based on feature status
   * @param options Object with values for both states
   * @returns A FeatureValue with the appropriate value
   */
  select<E, D>(options: SelectOptions<E, D>): FeatureValue<E, D> {
    const value = this.enabled ? options.enabled : options.disabled;
    return new FeatureValue<E, D>(value, this.enabled);
  }
} 