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
        deprecated: false
      }
    ]
  };

  // Test case: Should return valid result for valid configuration
  it('should return valid result for valid configuration', () => {
    // Act
    const result = validateFeatureConfig(validConfig);
    
    // Assert
    expect(result.valid).toBe(true);
  });
  
  it('should return empty errors array for valid configuration', () => {
    // Act
    const result = validateFeatureConfig(validConfig);
    
    // Assert
    expect(result.errors).toEqual([]);
  });
  
  // Test case: Should validate feature name format (must start with a letter)
  it('should validate feature name format (must start with a letter)', () => {
    // Arrange
    const invalidConfig = {
      features: [{ 
        name: '123-invalid-name', 
        description: 'Feature with invalid name', 
        versionRange: '>=1.0.0' 
      }]
    };
    
    // Act
    const result = validateFeatureConfig(invalidConfig);
    
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  // Test case: Should validate semver range format
  it('should validate semver range format', () => {
    // Arrange
    const invalidConfig = {
      features: [{ 
        name: 'validFeature', 
        description: 'Feature with invalid version range', 
        versionRange: 'not-a-semver-range' 
      }]
    };
    
    // Act
    const result = validateFeatureConfig(invalidConfig);
    
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  // Test case: Should require all mandatory fields
  it('should require all mandatory fields', () => {
    // Arrange
    const invalidConfig = {
      features: [{ 
        // Missing name field
        description: 'An invalid feature', 
        versionRange: '>=1.0.0' 
      }]
    };
    
    // Act
    const result = validateFeatureConfig(invalidConfig);
    
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  // Test case: Should handle non-object inputs gracefully
  it('should handle non-object inputs gracefully', () => {
    // Act
    const result = validateFeatureConfig('not an object');
    
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  // Test case: Should handle unexpected errors (null/undefined inputs)
  it.each([
    ['null input', null],
    ['undefined input', undefined]
  ])('should handle unexpected errors (%s)', (_, problematicInput) => {
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
        deprecated: false
      }
    ]
  };

  // Test case: Should return typed configuration for valid input
  it('should return typed configuration for valid input', () => {
    // Act
    const result = validateAndAssertConfig(validConfig);
    
    // Assert
    expect(result).toEqual(validConfig);
  });

  // Test case: Should throw descriptive error for invalid input
  it('should throw descriptive error for invalid input', () => {
    // Arrange
    const invalidConfig = {
      features: [{ 
        description: 'An invalid feature', 
        versionRange: '>=1.0.0' 
      }]
    };
    
    // Act & Assert
    expect(() => validateAndAssertConfig(invalidConfig)).toThrow(
      'Feature configuration validation failed:'
    );
  });
  
  // Test case: Should handle unexpected errors by throwing
  it('should handle unexpected errors by throwing', () => {
    // Act & Assert
    expect(() => validateAndAssertConfig(null)).toThrow(
      'Feature configuration validation failed:'
    );
  });
}); 