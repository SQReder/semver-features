# AsyncSource Test Plan

## Overview
This test plan covers the AsyncSource component, which provides an async-based feature state source that can fetch feature states from an external source.

## Plan
Testing will focus on verifying:
1. Constructor initialization with various options
2. Initialization behavior (with fetchOnInit true/false)
3. State refresh functionality
4. Feature state retrieval
5. Value parsing for different input types

## Test Cases

### Constructor
- Should set fetchStates and use default fetchOnInit (true)
- Should respect custom fetchOnInit value when provided

### Initialization
- Should call refresh if fetchOnInit is true
- Should not call refresh if fetchOnInit is false

### Refresh
- Should call fetchStates when refreshing
- Should update feature states from fetchStates result
- Should parse string "true" to boolean true
- Should parse string "false" to boolean false
- Should handle numeric values and convert to string
- Should keep valid semver strings as is
- Should exclude invalid values
- Should handle empty states object

### getFeatureState
- Should return true for enabled features
- Should return false for disabled features
- Should return semver string for version features
- Should return undefined for nonexistent features

## Implementation Notes
- Follow AAA pattern (Arrange-Act-Assert)
- Use vitest for testing
- Mock the fetchStates function to control test scenarios
- Each test should verify a single aspect of behavior
- Ensure tests run independently without side effects 