# semver-features

## 4.0.2

### Patch Changes

- c54f6ad: bundle semver

## 4.0.1

### Patch Changes

- f4c9160: fix: allow to gibberish in feature version - fallback to false

## 4.0.0

### Major Changes

- d2f0f39: Get rid of redundant type guards. Value type now automatically narrowed by typescript

### Minor Changes

- dad2e65: Add ability to skip disabled value for feature.select and one of mapping in feature.map. Also improve encapsulation and types, so type guards are redundant now

## 3.1.0

### Minor Changes

- 1d2aa4e: Simplified type handling in the `createSemverFeaturesJson` function for better maintainability and type safety.

## 3.0.1

### Patch Changes

- dbb0b9d: Code cleanup

## 3.0.0

### Minor Changes

- 6cd4efb: Improve documentation, tree-shaking

## 2.0.0

### Major Changes

- 0974485:

  # Features

  - **External Feature Sources**: Added support for multiple feature state sources
    - `LocalStorageSource`: Store feature states in localStorage
    - `SessionStorageSource`: Store feature states in sessionStorage
    - `UrlParamsSource`: Read feature states from URL parameters
    - `AsyncSource`: Fetch feature states asynchronously
  - **Debugging Enhancement**: Added `dumpFeatures()` method to list all registered features and their states

  # Breaking Changes

  - Renamed `FeatureState` type to `FeatureAvailability` for better semantic clarity
  - Renamed `executeAsync` method to `execute` for consistency
  - Removed utility functions (identity, compose, once, memoize)

  # Documentation

  - Updated README with comprehensive examples for external feature sources
  - Added debugging section with examples
  - Improved documentation for conditional execution patterns
  - Updated versioned API examples

  # Testing

  - Added comprehensive test plans:
    - Core Feature class
    - SemverFeatures class
    - AsyncSource
    - LocalStorageSource
    - SessionStorageSource
    - UrlParamsSource
    - Value parsing utilities
  - Improved test coverage with focused test cases for all components

## 1.1.2

### Patch Changes

- 1190335: Add credits

## 1.1.1

### Patch Changes

- 334b518: Update readmes

## 1.1.0

### Minor Changes

- 47f2fc5: Fix release versions
