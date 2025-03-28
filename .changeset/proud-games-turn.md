---
"semver-features": major
---

- Replaced `render` method with `execute` method for conditional rendering
- Removed direct render method in favor of functional execution patterns
- Removed utility functions (identity, compose, once, memoize)
- Updated type definitions: replaced `FeatureState` with `FeatureAvailability`

Added support for multiple feature state sources:

- LocalStorageSource - persist feature states in browser's localStorage
- SessionStorageSource - store feature states for current session
- UrlParamsSource - enable/disable features via URL parameters
- AsyncSource - fetch feature states from remote APIs

- Added `when` method for conditional callback execution
- Improved debugging capabilities with `dumpFeatures()` function
- Renamed render patterns to execution patterns for clarity
- Updated executeAsync to just execute (now handles both sync and async)

- Added comprehensive test plans for all components
- Enhanced Vitest configuration with better coverage reporting
- Implemented test-plan-first approach with detailed markdown files
- Improved test organization and clarity

- Updated README examples to reflect new API patterns
- Added detailed examples for all feature sources
- Improved documentation for conditional rendering patterns

- Updated package dependencies
- Configured V8 for coverage reporting
- Enhanced Cursor rules for testing and coverage

For more details, see the [full changelog](https://github.com/your-org/semver-features/blob/main/CHANGELOG.md).
