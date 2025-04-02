import { describe, expect, it } from 'vitest';
import {
  Feature,
  FeatureName,
  featureNameSchema,
  featureSchema,
  FeaturesJson,
  featuresJsonSchema,
  SemverRange,
  semverRangeSchema,
  VALID_FEATURE_NAME_REGEX
} from '../src/schema';

describe('FeatureNameSchema', () => {
  it.each([
    'feature',
    'featureOne',
    'feature1',
    'feature_name',
    'feature-name',
    'a123'
  ])('should validate valid feature name: "%s"', (name) => {
    const result = featureNameSchema.safeParse(name);
    
    expect(result.success).toBe(true);
  });

  it.each([
    '123feature',
    '_feature',
    '-feature',
    '1feature'
  ])('should reject invalid feature name not starting with a letter: "%s"', (name) => {
    const result = featureNameSchema.safeParse(name);
    
    expect(result.success).toBe(false);
  });

  it.each([
    'feature@name',
    'feature.name',
    'feature name',
    'feature+name',
    'feature$name'
  ])('should reject invalid feature name containing invalid characters: "%s"', (name) => {
    const result = featureNameSchema.safeParse(name);
    
    expect(result.success).toBe(false);
  });

  describe('VALID_FEATURE_NAME_REGEX', () => {
    it.each([
      'feature',
      'myFeature123',
      'f1',
      'feature_with_underscore',
      'feature-with-dash',
      'feature\\with\\backslash',
      'feature/with/slash',
      'camelCaseFeature'
    ])('should pass when testing valid feature name: "%s"', (input) => {
      const result = VALID_FEATURE_NAME_REGEX.test(input);
      
      expect(result).toBe(true);
    });

    it.each([
      '1invalidStart',
      '_invalidStart',
      '-invalidStart',
      'invalid@character',
      'invalid.character',
      'invalid space',
      'invalid$character',
      'invalid#character'
    ])('should fail when testing invalid feature name: "%s"', (input) => {
      const result = VALID_FEATURE_NAME_REGEX.test(input);
      
      expect(result).toBe(false);
    });
  });
});

describe('SemverRangeSchema', () => {
  it.each([
    ['standard semver', '>=1.0.0'],
    ['wildcard major', '1.x'],
    ['wildcard minor', '1.2.x'],
    ['caret range', '^1.2.3'],
    ['tilde range', '~1.2.3'],
    ['version range', '1.2.3 - 2.3.4'],
    ['any version', '*'],
    ['complex range', '>=1.0.0 <2.0.0'],
    ['prerelease version', '1.0.0-beta']
  ])('should accept valid semver range: %s "%s"', (_, range) => {
    const result = semverRangeSchema.safeParse(range);
    
    expect(result.success).toBe(true);
  });

  it.each([
    ['non-semver format', 'not-a-version'],
    ['spaces in version', 'version 1'],
    ['invalid characters', '##1.0.0']
  ])('should reject invalid semver range: %s "%s"', (_, range) => {
    const result = semverRangeSchema.safeParse(range);
    
    expect(result.success).toBe(false);
  });
});

describe('FeatureSchema', () => {
  it('should validate a complete valid feature configuration', () => {
    const validFeature = {
      name: 'testFeature' as FeatureName,
      description: 'Test feature description',
      versionRange: '>=1.0.0' as SemverRange,
      deprecated: false,
      createdAt: '2023-01-01T00:00:00Z',
    } satisfies Feature;

    const result = featureSchema.safeParse(validFeature);
    
    expect(result.success).toBe(true);
  });

  it('should validate a minimal valid feature configuration', () => {
    const minimalFeature = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0'
    };

    const result = featureSchema.safeParse(minimalFeature);
    
    expect(result.success).toBe(true);
  });

  it('should reject configuration with missing name', () => {
    const feature = {
      description: 'Test feature description',
      versionRange: '>=1.0.0'
    };
    
    const result = featureSchema.safeParse(feature);
    
    expect(result.success).toBe(false);
  });

  it('should reject configuration with missing description', () => {
    const feature = {
      name: 'testFeature',
      versionRange: '>=1.0.0'
    };
    
    const result = featureSchema.safeParse(feature);
    
    expect(result.success).toBe(false);
  });

  it('should reject configuration with missing version range', () => {
    const feature = {
      name: 'testFeature',
      description: 'Test feature description'
    };
    
    const result = featureSchema.safeParse(feature);
    
    expect(result.success).toBe(false);
  });

  it('should validate feature with valid date fields', () => {
    const feature = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0',
      createdAt: '2023-01-01T00:00:00Z',
    };
    
    const result = featureSchema.safeParse(feature);
    
    expect(result.success).toBe(true);
  });

  it('should reject feature with invalid date fields', () => {
    const feature = {
      name: 'testFeature',
      description: 'Test feature description',
      versionRange: '>=1.0.0',
      createdAt: 'not-a-date',
    };
    
    const result = featureSchema.safeParse(feature);
    
    expect(result.success).toBe(false);
  });
});

describe('FeaturesJsonSchema', () => {
  it('should validate a complete valid configuration', () => {
    const validConfig = {
      features: [
        {
          name: 'feature1' as FeatureName,
          description: 'Feature 1 description',
          versionRange: '>=1.0.0' as SemverRange,
        },
        {
          name: 'feature2' as FeatureName,
          description: 'Feature 2 description',
          versionRange: '^2.0.0' as SemverRange,
          deprecated: true
        }
      ]
    } satisfies FeaturesJson;

    const result = featuresJsonSchema.safeParse(validConfig);
    
    expect(result.success).toBe(true);
  });

  it('should validate configuration with optional schema field', () => {
    const configWithSchema = {
      $schema: './schema.json',
      features: [
        {
          name: 'feature1' as FeatureName,
          description: 'Feature 1 description',
          versionRange: '>=1.0.0' as SemverRange,
        }
      ]
    } satisfies FeaturesJson;

    const result = featuresJsonSchema.safeParse(configWithSchema);
    
    expect(result.success).toBe(true);
  });

  it('should reject configuration with extra fields', () => {
    const configWithExtraFields = {
      $schema: './schema.json',
      features: [
        {
          name: 'feature1' as FeatureName,
          description: 'Feature 1 description',
          versionRange: '>=1.0.0' as SemverRange,
        }
      ],
      // @ts-expect-error - extra field
      extraField: 'this should not be here'
    } satisfies FeaturesJson;

    const result = featuresJsonSchema.safeParse(configWithExtraFields);
    
    expect(result.success).toBe(false);
  });

  it('should accept configuration with empty features array', () => {
    const config = {
      features: []
    } satisfies FeaturesJson;
    
    const result = featuresJsonSchema.safeParse(config);
    
    expect(result.success).toBe(true);
  });
  
  it('should reject configuration with invalid feature name', () => {
    const config = {
      features: [
        {
          name: 'invalid-name!' as FeatureName,
          description: 'Feature with invalid name',
          versionRange: '>=1.0.0' as SemverRange,
        }
      ]
    } satisfies FeaturesJson;
    
    const result = featuresJsonSchema.safeParse(config);
    
    expect(result.success).toBe(false);
  });
}); 