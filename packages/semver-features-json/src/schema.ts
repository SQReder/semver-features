import { z } from "zod";
import * as semver from "semver";

// Constants
export const FEATURE_NAME_PATTERN = "^[a-zA-Z][\\w-]*$";

// Branded types
export const FeatureNameSchema = z
  .string()
  .regex(new RegExp(FEATURE_NAME_PATTERN))
  .describe("Кодовое имя фичи")
  .brand("FeatureName");

// Semver version range schema with validation
export const SemverRangeSchema = z
  .string()
  .refine((val) => semver.validRange(val) !== null, {
    message: "String must be a valid semver range",
  })
  .describe("Диапазон версий в формате semver")
  .brand("SemverRange");

// Feature schema definition
export const FeatureSchema = z
  .object({
    /**Кодовое имя фичи*/
    name: FeatureNameSchema,
    description: z.string(),
    /**Диапазон версий в формате semver*/
    versionRange: SemverRangeSchema,
    enabledByDefault: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    deprecated: z.boolean().default(false),
    owners: z.array(z.string()).optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    expiresAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

// Root schema definition
export const FeaturesJsonSchema = z
  .object({
    /**Path to the schema file*/
    $schema: z.string().describe("Path to the schema file").optional(),
    features: z.array(FeatureSchema),
  })
  .strict();

// Type exports
export type JsonFeatureName = z.infer<typeof FeatureNameSchema>;
export type JsonSemverRange = z.infer<typeof SemverRangeSchema>;
export type JsonFeature = z.infer<typeof FeatureSchema>;
export type FeaturesJson = z.infer<typeof FeaturesJsonSchema>;

export default FeaturesJsonSchema;
