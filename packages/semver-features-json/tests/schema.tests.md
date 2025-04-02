# Feature Schema Test Plan

## Overview
This test plan covers validation of the schema definitions used for semver-based feature flags in JSON format.
The schemas validate feature names, semantic versioning ranges, feature objects, and the overall features JSON structure.

## Plan
Testing will focus on validating each schema component individually and then testing the complete schema validation.
We'll use parameterized testing to validate multiple cases efficiently.

## Test Cases

### FeatureNameSchema
- Should validate valid feature names (lowercase, camelCase, with numbers, underscores, hyphens)
- Should reject feature names not starting with a letter
- Should reject feature names containing invalid characters
- Should verify VALID_FEATURE_NAME_REGEX pattern correctly

### SemverRangeSchema
- Should accept valid semver ranges (standard, wildcards, ranges, prerelease versions)
- Should reject invalid semver formats

### FeatureSchema
- Should validate complete valid feature configurations
- Should validate minimal valid feature configurations (only required fields)
- Should reject configurations with missing required fields
  - Missing name
  - Missing description
  - Missing version range
- Should validate optional fields
  - Valid date fields
  - Invalid date fields

### FeaturesJsonSchema
- Should validate complete valid configurations
- Should validate configurations with optional schema field
- Should reject configurations with extra fields
- Should validate configurations with empty features array
- Should reject configurations with invalid feature names

## Implementation Notes
- Follow AAA pattern (Arrange-Act-Assert) with clear structural separation
- Include only one assertion per test
- Use descriptive test names with "should" format
- Group related tests within describe blocks
- Use it.each for parameterized tests with clear descriptions 