import * as semver from "semver";
import { tryAsRange } from "../utils/asRange";
import type { FeatureAvailability } from "./types";

/**
 * Parse a raw value from a source into a FeatureAvailability
 * @param value The raw value to parse
 * @returns The parsed FeatureAvailability or undefined if parsing fails
 */
export function parseSourceValue(
  value: string | boolean | null | undefined
): FeatureAvailability | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  // Try parsing as boolean first
  if (value === "true") return true;
  if (value === "false") return false;

  // Try parsing as semver
  if (semver.valid(value)) {
    return tryAsRange(value);
  }

  return undefined;
}
