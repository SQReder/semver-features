import { describe, it, expect } from 'vitest';
import {
  FeatureNameSchema,
  SemverRangeSchema,
  FeatureSchema,
  FeaturesJsonSchema,
  VALID_FEATURE_NAME_REGEX
} from '../src/schema';
import { z } from 'zod';

// Helper function to test schema validation
function expectValidation<T>(
  schema: z.ZodType<T>,
  value: unknown,
  shouldPass: boolean
): void {
  const result = schema.safeParse(value);
  expect(result.success).toBe(shouldPass);
}

describe('FeatureNameSchema', () => {
  it('should validate valid feature names', () => {
    // Arrange
    const validNames = [
      'feature',
      'featureOne',
      'feature1',
      'feature_name',
      'feature-name',
      'a123'
    ];

    // Act & Assert
    validNames.forEach(name => {
      expectValidation(FeatureNameSchema, name, true);
    });
  });

  it('should reject invalid feature names not starting with a letter', () => {
    // Arrange
    const invalidNames = [
      '123feature',
      '_feature',
      '-feature',
      '1feature'
    ];

    // Act & Assert
    invalidNames.forEach(name => {
      expectValidation(FeatureNameSchema, name, false);
    });
  });

  it('should reject invalid feature names containing invalid characters', () => {
    // Arrange
    const invalidNames = [
      'feature@name',
      'feature.name',
      'feature name',
      'feature+name',
      'feature$name'
    ];

    // Act & Assert
    invalidNames.forEach(name => {
      expectValidation(FeatureNameSchema, name, false);
    });
  });

  it('should match the defined regex pattern', () => {
    // Arrange
    const regex = new RegExp(VALID_FEATURE_NAME_REGEX);
    
    // Act & Assert
    expect(regex.test('validFeature')).toBe(true);
    expect(regex.test('123invalid')).toBe(false);
  });

  describe('VALID_FEATURE_NAME_REGEX', () => {
    it.each([
      // test format: [testVerb, input, expectedResult]
      ['pass', 'feature', true],
      ['pass', 'myFeature123', true],
      ['pass', 'f1', true],
      ['pass', 'feature_with_underscore', true],
      ['pass', 'feature-with-dash', true],
      ['pass', 'feature\\with\\backslash', true],
      ['pass', 'feature/with/slash', true],
      ['pass', 'camelCaseFeature', true],
      ['fail', '1invalidStart', false],
      ['fail', '_invalidStart', false],
      ['fail', '-invalidStart', false],
      ['fail', 'invalid@character', false],
      ['fail', 'invalid.character', false],
      ['fail', 'invalid space', false],
      ['fail', 'invalid$character', false],
      ['fail', 'invalid#character', false]
    ])('should %s when testing "%s"', (_, input, expected) => {
      // Arrange & Act
      const result = VALID_FEATURE_NAME_REGEX.test(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});

describe('SemverRangeSchema', () => {
  it.each([
    // test format: [testVerb, input, expectedResult]
    ['pass', '>=1.0.0', true],
    ['pass', '1.x', true],
    ['pass', '1.2.x', true],
    ['pass', '^1.2.3', true],
    ['pass', '~1.2.3', true],
    ['pass', '1.2.3 - 2.3.4', true],
    ['pass', '*', true],
    ['pass', '>=1.0.0 <2.0.0', true],
    ['pass', '1.0.0-beta', true],
    ['fail', 'not-a-version', false],
    ['fail', 'version 1', false],
    ['fail', '##1.0.0', false]
  ])('should %s when validating "%s"', (_, range, shouldBeValid) => {
    // Arrange & Act & Assert
    expectValidation(SemverRangeSchema, range, shouldBeValid);
  });
});

describe('FeatureSchema', () => {
  it('should validate a complete valid feature configuration', () => {
    // Arrange
    const validFeature = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0',
      enabledByDefault: true,
      tags: ['tag1', 'tag2'],
      deprecated: false,
      owners: ['owner1'],
      createdAt: '2023-01-01T00:00:00Z',
      expiresAt: '2024-01-01T00:00:00Z'
    };

    // Act & Assert
    expectValidation(FeatureSchema, validFeature, true);
  });

  it('should validate a minimal valid feature configuration', () => {
    // Arrange
    const minimalFeature = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0'
    };

    // Act & Assert
    expectValidation(FeatureSchema, minimalFeature, true);
  });

  it('should apply default values for optional fields', () => {
    // Arrange
    const minimalFeature = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0'
    };

    // Act
    const parsed = FeatureSchema.parse(minimalFeature);

    // Assert
    expect(parsed.enabledByDefault).toBe(false);
    expect(parsed.deprecated).toBe(false);
  });

  it('should reject configuration missing required fields', () => {
    // Arrange
    const missingNameFeature = {
      description: 'Test feature description',
      versionRange: '>=1.0.0'
    };

    const missingDescriptionFeature = {
      name: 'testFeature',
      versionRange: '>=1.0.0'
    };

    const missingVersionRangeFeature = {
      name: 'testFeature',
      description: 'Test feature description'
    };

    // Act & Assert
    expectValidation(FeatureSchema, missingNameFeature, false);
    expectValidation(FeatureSchema, missingDescriptionFeature, false);
    expectValidation(FeatureSchema, missingVersionRangeFeature, false);
  });

  it('should validate date fields correctly', () => {
    // Arrange
    const featureWithValidDates = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0',
      createdAt: '2023-01-01T00:00:00Z',
      expiresAt: '2024-01-01T00:00:00Z'
    };

    const featureWithInvalidDates = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0',
      createdAt: 'not-a-date',
      expiresAt: '2024-01-01'
    };

    // Act & Assert
    expectValidation(FeatureSchema, featureWithValidDates, true);
    expectValidation(FeatureSchema, featureWithInvalidDates, false);
  });
});

describe('FeaturesJsonSchema', () => {
  it('should validate a complete valid configuration', () => {
    // Arrange
    const validConfig = {
      features: [
        {
          name: 'feature1',
          description: 'Feature 1 description',
          versionRange: '>=1.0.0',
          enabledByDefault: true
        },
        {
          name: 'feature2',
          description: 'Feature 2 description',
          versionRange: '^2.0.0',
          deprecated: true
        }
      ]
    };

    // Act & Assert
    expectValidation(FeaturesJsonSchema, validConfig, true);
  });

  it('should validate configuration with optional schema field', () => {
    // Arrange
    const configWithSchema = {
      $schema: './schema.json',
      features: [
        {
          name: 'feature1',
          description: 'Feature 1 description',
          versionRange: '>=1.0.0'
        }
      ]
    };

    // Act & Assert
    expectValidation(FeaturesJsonSchema, configWithSchema, true);
  });

  it('should reject configuration with extra fields', () => {
    // Arrange
    const configWithExtraFields = {
      $schema: './schema.json',
      features: [
        {
          name: 'feature1',
          description: 'Feature 1 description',
          versionRange: '>=1.0.0'
        }
      ],
      extraField: 'this should not be here'
    };

    // Act & Assert
    expectValidation(FeaturesJsonSchema, configWithExtraFields, false);
  });

  it('should reject configuration with invalid features', () => {
    // Arrange
    const configWithInvalidFeatures = {
      features: [
        {
          name: 'invalid-name!',
          description: 'Feature with invalid name',
          versionRange: '>=1.0.0'
        }
      ]
    };

    const emptyConfig = {
      features: []
    };

    // Act & Assert
    expectValidation(FeaturesJsonSchema, configWithInvalidFeatures, false);
    expectValidation(FeaturesJsonSchema, emptyConfig, true);
  });
}); 