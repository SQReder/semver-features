/**
 * Feature entity implementation
 */

import { Range, SemVer } from "semver";
import type { FeatureAvailability, FeatureStateSource } from "../sources/types";
import type {
  ExecuteOptions,
  FeatureOptions,
  FoldOptions,
  MapOptions,
  SelectOptions,
} from "../utils/types";
import { parseSourceValue } from "../sources/valueParser";

/**
 * FeatureValue class for handling feature-dependent values and transformations
 */
export class FeatureValue<E, D> {
  readonly value: E | D;
  private readonly isEnabled: boolean;

  constructor(value: E | D, isEnabled: boolean) {
    this.value = value;
    this.isEnabled = isEnabled;
  }

  /**
   * Transform both enabled and disabled values to new types
   * @param options Object with transform functions for both states
   * @returns A new FeatureValue with transformed values
   */
  map<NE, ND>(options: MapOptions<E, D, NE, ND>): FeatureValue<NE, ND> {
    if (this.isEnabled) {
      return new FeatureValue<NE, ND>(options.enabled(this.value as E), true);
    } else {
      return new FeatureValue<NE, ND>(options.disabled(this.value as D), false);
    }
  }

  /**
   * Collapse both enabled and disabled values to a common result type
   * @param options Object with transform functions for both states
   * @returns The result of applying the appropriate transform function
   */
  fold<R>(options: FoldOptions<E, D, R>): R {
    if (this.isEnabled) {
      return options.enabled(this.value as E);
    } else {
      return options.disabled(this.value as D);
    }
  }
}

/**
 * Feature entity that handles version-based feature toggling
 */
export class Feature {
  private name: string;
  private versionsRange: Range | boolean;
  private currentVersion: SemVer;
  private _isEnabled: boolean;
  private sources: FeatureStateSource[];

  /**
   * Create a new feature entity
   * @param options Configuration options
   */
  constructor(options: FeatureOptions) {
    this.name = options.name;
    this.currentVersion = options.currentVersion;
    this.versionsRange = options.versionsRange;
    this.sources = options.sources || [];

    // Check sources first, then fall back to version comparison
    this._isEnabled = this.determineEnabledState();
  }

  /**
   * Determine if the feature is enabled by checking sources and version
   */
  private determineEnabledState(): boolean {
    // Find first defined state from sources or fall back to minVersion
    let effectiveState: FeatureAvailability | undefined = this.versionsRange;

    for (const source of this.sources) {
      const state = source.getFeatureState(this.name);
      if (state !== undefined) {
        effectiveState = parseSourceValue(state);
        break;
      }
    }

    // Determine final state once
    if (typeof effectiveState === "boolean") {
      return effectiveState;
    } else if (effectiveState instanceof Range) {
      return effectiveState.test(this.currentVersion);
    } else {
      throw new Error(`Invalid feature state: ${effectiveState}`);
    }
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
  get requiredVersion(): Range | boolean {
    return this.versionsRange;
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
    return this._isEnabled ? options.enabled() : options.disabled();
  }

  /**
   * Execute a function only when the feature is enabled
   * @param callback Function to execute when the feature is enabled
   * @returns The result of the callback function if the feature is enabled, otherwise undefined
   */
  when<T>(callback: () => T): T | undefined {
    if (!this._isEnabled) return;
    return callback();
  }
}
