import { describe, it, expect } from 'vitest';
import { validateFeatureConfig, validateAndAssertConfig } from '../src/validator';
import { FeatureFlagsConfig } from '../src/types';

describe('validateFeatureConfig', () => {
  // Valid configuration for testing
  const validConfig: FeatureFlagsConfig = {
    features: [
      {
        name: 'validFeature',
        description: 'A valid feature',
        versionRange: '>=1.0.0',
        enabledByDefault: true,
        deprecated: false
      }
    ]
  };

  it('should return valid result for valid configuration', () => {
    // Arrange - use the valid config

    // Act
    const result = validateFeatureConfig(validConfig);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should return invalid result with errors for missing required fields', () => {
    // Arrange
    const invalidConfig = {
      features: [
        {
          // Missing required 'name' field
          description: 'An invalid feature',
          versionRange: '>=1.0.0'
        }
      ]
    };

    // Act
    const result = validateFeatureConfig(invalidConfig);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    // We can't know the exact error message but we can check it contains useful info
    expect(result.errors[0].message).toBeTruthy();
  });

  it('should return invalid result with errors for invalid feature name format', () => {
    // Arrange
    const invalidConfig = {
      features: [
        {
          name: '123-invalid-name', // Invalid: must start with a letter
          description: 'Feature with invalid name',
          versionRange: '>=1.0.0'
        }
      ]
    };

    // Act
    const result = validateFeatureConfig(invalidConfig);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should return invalid result with errors for invalid semver range', () => {
    // Arrange
    const invalidConfig = {
      features: [
        {
          name: 'validFeature',
          description: 'Feature with invalid version range',
          versionRange: 'not-a-semver-range'
        }
      ]
    };

    // Act
    const result = validateFeatureConfig(invalidConfig);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should return invalid result for non-object input', () => {
    // Arrange
    const invalidInput = 'not an object';

    // Act
    const result = validateFeatureConfig(invalidInput);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should handle unexpected errors gracefully', () => {
    // Arrange
    // Create a value that will cause an unexpected error
    const problematicInput = undefined;

    // Act
    const result = validateFeatureConfig(problematicInput);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('validateAndAssertConfig', () => {
  // Valid configuration for testing
  const validConfig: FeatureFlagsConfig = {
    features: [
      {
        name: 'validFeature',
        description: 'A valid feature',
        versionRange: '>=1.0.0',
        enabledByDefault: true,
        deprecated: false
      }
    ]
  };

  it('should return typed configuration for valid input', () => {
    // Arrange - use the valid config

    // Act
    const result = validateAndAssertConfig(validConfig);

    // Assert
    expect(result).toEqual(validConfig);
  });

  it('should throw error with details for invalid input', () => {
    // Arrange
    const invalidConfig = {
      features: [
        {
          // Missing required 'name' field
          description: 'An invalid feature',
          versionRange: '>=1.0.0'
        }
      ]
    };

    // Act & Assert
    expect(() => validateAndAssertConfig(invalidConfig)).toThrow(
      'Feature configuration validation failed:'
    );
  });

  it('should handle unexpected errors by throwing', () => {
    // Arrange
    const problematicInput = null;

    // Act & Assert
    expect(() => validateAndAssertConfig(problematicInput)).toThrow(
      'Feature configuration validation failed:'
    );
  });
}); 