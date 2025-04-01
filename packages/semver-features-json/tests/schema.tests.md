# Schema Test Plan

## Overview
This test plan covers the schema validation functionality in the `schema.ts` file, which defines Zod schemas for feature flags configuration.

## Plan
Testing will focus on the schema validation components:
1. `FeatureNameSchema` - For validating feature names
2. `SemverRangeSchema` - For validating semver ranges
3. `FeatureSchema` - For validating individual feature configurations
4. `FeaturesJsonSchema` - For validating the root feature configuration object

## Test Cases

### FeatureNameSchema Tests
- Should validate valid feature names
- Should reject invalid feature names (not starting with a letter)
- Should reject invalid feature names (containing invalid characters)
- Should directly test VALID_FEATURE_NAME_REGEX against various inputs

### SemverRangeSchema Tests
- Should validate valid semver ranges
- Should reject invalid semver ranges

### FeatureSchema Tests
- Should validate a complete valid feature configuration
- Should validate a minimal valid feature configuration
- Should apply default values for optional fields
- Should reject configuration missing required fields
- Should validate date fields correctly

### FeaturesJsonSchema Tests
- Should validate a complete valid configuration
- Should validate configuration with optional schema field
- Should reject configuration with extra fields
- Should reject configuration with invalid features

## Implementation Notes
- Follow AAA pattern (Arrange-Act-Assert)
- Include only one assertion per test
- Use descriptive test names following "should" format
- Test both positive (valid) and negative (invalid) cases
- Create test fixtures for valid and invalid configurations 