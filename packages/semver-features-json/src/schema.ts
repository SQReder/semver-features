import { z } from "zod";
import * as semver from "semver";

// Constants
export const VALID_FEATURE_NAME_REGEX = /^[a-zA-Z][\w\-\\\/]*$/;

// Branded types
export const featureNameSchema = z
  .string()
  .regex(VALID_FEATURE_NAME_REGEX)
  .describe("Unique code name of the feature, must start with a letter and contain only alphanumeric characters, underscores, or hyphens")
  .brand("FeatureName");

// Semver version range schema with validation
export const semverRangeSchema = z
  .string()
  .refine((val) => semver.validRange(val) !== null, {
    message: "String must be a valid semver range",
  })
  .describe("Semver range expression that specifies in which versions this feature is active")
  .brand("SemverRange");

// Feature schema definition
export const featureSchema = z
  .object({
    /**
     * Unique code name of the feature
     */
    name: featureNameSchema,
    /**
     * Human-readable description of what the feature does
     */
    description: z.string().describe("Human-readable description of what the feature does"),
    /**
     * Semver range expression that specifies in which versions this feature is active
     */
    versionRange: semverRangeSchema,
    /**
     * Indicates whether this feature is deprecated and scheduled for removal
     */
    deprecated: z.boolean().optional().describe("Indicates whether this feature is deprecated and scheduled for removal"),
    /**
     * ISO 8601 date-time when this feature was created
     */
    createdAt: z.string().datetime({ offset: true }).optional().describe("ISO 8601 date-time when this feature was created"),
  })
  .strict();

// Root schema definition
export const featuresJsonSchema = z
  .object({
    /**
     * Path to the schema file
     */
    $schema: z.string().describe("Path to the schema file").optional(),
    /**
     * Array of feature flag configurations
     */
    features: z.array(featureSchema).describe("Array of feature flag configurations"),
  })
  .strict();

// Type exports
export type FeatureName = z.infer<typeof featureNameSchema>;
export type SemverRange = z.infer<typeof semverRangeSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type FeaturesJson = z.infer<typeof featuresJsonSchema>;