/**
 * Type guards for Feature Value classes
 */

import { EnabledFeatureValue, DisabledFeatureValue, FeatureValue } from "./Feature";

/**
 * Type guard to check if a feature value is enabled
 * @param value The feature value to check
 * @returns A type predicate narrowing to the enabled feature value
 */
export function isEnabled<E, D>(
  value: FeatureValue<E, D>
): value is EnabledFeatureValue<E, D> {
  return value.isEnabled;
}

/**
 * Type guard to check if a feature value is disabled
 * @param value The feature value to check
 * @returns A type predicate narrowing to the disabled feature value
 */
export function isDisabled<E, D>(
  value: FeatureValue<E, D>
): value is DisabledFeatureValue<E, D> {
  return !value.isEnabled;
} 