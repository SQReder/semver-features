/**
 * SemVer-Based Feature Toggle Library
 * 
 * This library provides an elegant solution for automatically enabling features
 * based on semantic versioning. Instead of manually managing feature flags across
 * different releases, it uses the application version to determine which features
 * should be active.
 */

// Core exports
export { SemverFeatures } from './core/SemverFeatures';
export { Feature, FeatureValue } from './core/Feature';
export { compareSemver, isVersionGteq, parseSemver } from './core/semver';

// React component exports
export { FeatureToggle, FeatureEnabled, FeatureDisabled } from './react/components';

// API exports
export { createVersionedApi } from './api/versioned-api';

// Utility exports
export { identity, compose, once, memoize } from './utils/functional';

// Type exports
export type {
  SemverFeaturesOptions,
  FeatureOptions,
  RenderOptions,
  ApiVersionConfig,
  VersionedApiConfig,
  SelectOptions,
  MapOptions,
  FoldOptions
} from './utils/types'; 