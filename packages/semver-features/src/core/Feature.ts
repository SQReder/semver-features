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
 * Base FeatureValue class for handling feature-dependent values and transformations
 */
export abstract class FeatureValue<E, D> {
  readonly isEnabled: boolean;

  constructor(isEnabled: boolean) {
    this.isEnabled = isEnabled;
  }

  abstract get value(): E | D;

  /**
   * Transform both enabled and disabled values to new types
   * @param options Object with transform functions for both states
   * @returns A new FeatureValue with transformed values
   */
  map<NE = E, ND = D>(options: MapOptions<E, D, NE, ND>): FeatureValue<NE, ND> {
    if (this.isEnabled) {
      // Use identity function if enabled transform isn't provided
      const transform = options.enabled || ((x: E) => x as unknown as NE);
      return new EnabledFeatureValue<NE, ND>(transform(this.value as E));
    } else {
      // Use identity function if disabled transform isn't provided
      const transform = options.disabled || ((x: D) => x as unknown as ND);
      return new DisabledFeatureValue<NE, ND>(transform(this.value as D));
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
 * FeatureValue subclass for enabled features
 */
export class EnabledFeatureValue<E, D> extends FeatureValue<E, D> {
  private readonly _value: E;
  readonly isEnabled: true = true;


  constructor(value: E) {
    super(true);
    this._value = value;
  }

  get value(): E {
    return this._value;
  }
}

/**
 * FeatureValue subclass for disabled features
 */
export class DisabledFeatureValue<E, D> extends FeatureValue<E, D> {
  private readonly _value: D;
  readonly isEnabled: false = false;

  constructor(value: D) {
    super(false);
    this._value = value;
  }

  get value(): D {
    return this._value;
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
   * @param options Object containing values for enabled and disabled states.
   *                The `enabled` value is required and represents the functionality when the feature is on.
   *                The `disabled` value is optional and represents fallback behavior when the feature is off.
   *                If `disabled` is omitted, the feature will effectively do nothing when turned off.
   * @returns A FeatureValue containing the appropriate value based on the feature's enabled state
   */
  select<E, D = never>(
    options: SelectOptions<E, D>
  ): EnabledFeatureValue<E, D> | DisabledFeatureValue<E, D> {
    return this._isEnabled
      ? new EnabledFeatureValue<E, D>(options.enabled)
      : new DisabledFeatureValue<E, D>(options.disabled as D);
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
