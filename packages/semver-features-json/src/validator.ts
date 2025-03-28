import { z } from 'zod';
import schema from './schema';
import { FeatureFlagsConfig, ValidationResult } from './types';

/**
 * Validates the feature configuration against the Zod schema
 * @param config The feature configuration to validate
 * @returns Validation result with errors if any
 */
export function validateFeatureConfig(config: unknown): ValidationResult {
  try {
    schema.parse(config);
    return { valid: true, errors: [] };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map((err: z.ZodIssue) => ({
          message: err.message,
          path: err.path.join('.'),
          keyword: err.code
        }))
      };
    }
    // For unexpected errors
    return {
      valid: false,
      errors: [{ message: error instanceof Error ? error.message : 'Unknown validation error' }]
    };
  }
}

/**
 * Validates and type guards the feature configuration
 * @param config The feature configuration to validate
 * @throws Error if the configuration is invalid
 * @returns The validated config with type assertion
 */
export function validateAndAssertConfig(config: unknown): FeatureFlagsConfig {
  const result = validateFeatureConfig(config);
  
  if (!result.valid) {
    const errorMessages = result.errors.map(e => 
      `${e.message}${e.path ? ` at ${e.path}` : ''}`
    ).join('\n');
    
    throw new Error(`Feature configuration validation failed:\n${errorMessages}`);
  }
  
  // Parse with zod to ensure the type is correct
  const validatedConfig = schema.parse(config);
  return validatedConfig as unknown as FeatureFlagsConfig;
} 