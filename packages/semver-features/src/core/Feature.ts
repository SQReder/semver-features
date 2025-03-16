/**
 * Feature entity implementation
 */

import * as semver from 'semver';
import type { FeatureOptions, Semver, RenderOptions, SelectOptions, MapOptions, FoldOptions, ExecuteOptions, RenderComponentOptions } from '../utils/types';

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
 * Feature entity that handles version-based feature toggling
 */
export class Feature<E, D> {
  private name: string;
  private minVersion: Semver | boolean;
  private currentVersion: string;
  private _isEnabled: boolean;

  /**
   * Create a new feature entity
   * @param options Configuration options
   */
  constructor(options: FeatureOptions) {
    this.name = options.name;
    this.currentVersion = options.currentVersion;
    this.minVersion = options.minVersion;
    
    // Directly determine enabled state based on minVersion type
    this._isEnabled = typeof this.minVersion === 'boolean'
      ? this.minVersion as boolean // Use boolean directly
      : semver.gte(options.currentVersion, this.minVersion as string); // Use semver comparison
  }

  /**
   * Whether this feature is enabled in the current version
   */
  get isEnabled(): boolean {
    return this._isEnabled;
  }

  /**
   * The required minimum version for this feature
   */
  get requiredVersion(): Semver | boolean {
    return this.minVersion;
  }

  /**
   * Select between enabled and disabled values based on feature status
   * @param options Object containing values for enabled and disabled states
   * @returns A FeatureValue containing the appropriate value
   */
  select<SE, SD>(options: SelectOptions<SE, SD>): FeatureValue<SE, SD> {
    return new FeatureValue<SE, SD>(
      this._isEnabled ? options.enabled : options.disabled,
      this._isEnabled
    );
  }

  /**
   * Execute one of two functions based on feature status
   * @param options Object with functions for both enabled and disabled states
   * @returns Result of the executed function
   */
  execute<R>(options: ExecuteOptions<R>): R {
    return this._isEnabled
      ? options.enabled()
      : options.disabled();
  }

  /**
   * Render a component based on feature status
   * @param options Object with functions that return components
   * @returns The rendered component
   */
  render<T, U>(options: RenderOptions<T, U>): T | U {
    return this._isEnabled
      ? options.enabled()
      : options.disabled();
  }

  /**
   * Render a React component based on feature status
   * @param options Object with functions that return React components
   * @returns The rendered React component
   */
  renderComponent<T = any, U = any>(options: RenderComponentOptions<T, U>): T | U {
    return this.render(options);
  }
} 