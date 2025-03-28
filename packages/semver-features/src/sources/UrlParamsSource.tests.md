# UrlParamsSource Test Plan

## Overview
This test plan covers the UrlParamsSource component, which provides a feature state source that reads feature states from URL query parameters.

## Plan
Testing will focus on verifying:
1. Constructor initialization with default and custom prefixes
2. Feature state retrieval from URL parameters
3. Value parsing for different input types from URL parameters

## Test Cases

### Constructor and Prefix Behavior
- Should use default prefix for URL parameters
- Should use custom prefix when provided

### getFeatureState
- Should construct URLSearchParams with window.location.search
- Should call parseSourceValue with result from URLSearchParams.get
- Should return true for parsed boolean true values
- Should return false for parsed boolean false values
- Should return semver string for parsed semver values
- Should return undefined for invalid or missing values

## Implementation Notes
- Follow AAA pattern (Arrange-Act-Assert)
- Use vitest for testing
- Mock the URLSearchParams API to control test scenarios
- Mock the valueParser module for predictable parsing behavior
- Each test should verify a single aspect of behavior
- Ensure tests run independently without side effects 