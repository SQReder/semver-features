# SessionStorageSource Test Plan

## Overview
This test plan covers the SessionStorageSource component, which provides a feature state source that reads feature states from browser sessionStorage.

## Plan
Testing will focus on verifying:
1. Constructor initialization with default and custom prefixes
2. Feature state retrieval with proper key prefixing
3. Value parsing for different input types from sessionStorage

## Test Cases

### Constructor and Prefix Behavior
- Should use default prefix for feature keys
- Should use custom prefix when provided

### getFeatureState
- Should return undefined for nonexistent features
- Should access sessionStorage with the correct prefixed key
- Should return boolean true for "true" string values
- Should return boolean false for "false" string values
- Should return semver string for valid semver values

## Implementation Notes
- Follow AAA pattern (Arrange-Act-Assert)
- Use vitest for testing
- Mock the sessionStorage API to control test scenarios
- Each test should verify a single aspect of behavior
- Ensure tests run independently without side effects 