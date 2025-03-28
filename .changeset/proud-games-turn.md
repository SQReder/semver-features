---
"semver-features": major
---

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
