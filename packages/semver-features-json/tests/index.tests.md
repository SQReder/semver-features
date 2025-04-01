# Index Test Plan

## Overview
This test plan covers the main functionality in the `index.ts` file, which provides the core `JsonSemverFeatures` class and factory functions.

## Plan
Testing will focus on three main components:
1. `JsonSemverFeatures` class - Provides feature flag functionality with type safety
2. `getSchema` function - Returns the Zod schema
3. `createSemverFeaturesJson` factory function - Creates instances of JsonSemverFeatures

## Test Cases

### JsonSemverFeatures Class Tests
- Should correctly initialize with valid configuration
- Should register features from configuration
- Should get feature by name using typed getter
- Should return undefined for non-existent feature
- Should check if feature is enabled correctly
- Should handle features with version ranges
- Should handle features with boolean enablement
- Should get all registered features

### getSchema Function Tests
- Should return the schema object

### createSemverFeaturesJson Factory Function Tests
- Should create a JsonSemverFeatures instance with valid configuration
- Should throw error when invalid configuration is provided
- Should correctly validate and process the configuration

## Implementation Notes
- Follow AAA pattern (Arrange-Act-Assert)
- Include only one assertion per test
- Use descriptive test names following "should" format
- Create test fixtures for valid configurations
- Test both success and error paths
- Create type tests to ensure type safety works as expected 