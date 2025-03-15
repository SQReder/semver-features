/**
 * SemVer-Based Feature Toggle Library - Core Package
 */

// Core exports
export { SemverFeatures } from './core/SemverFeatures';
export { Feature, FeatureValue } from './core/Feature';

// API exports
export { 
  isApiVersionAvailable,
  withVersionedMethod
} from './api/versioned-api';

// Utility exports
export { identity, compose, once, memoize } from './utils/functional';

// Type exports
export type {
  SemverFeaturesOptions,
  FeatureOptions,
  RenderOptions,
  SelectOptions,
  MapOptions,
  FoldOptions,
  ExecuteOptions,
  RenderComponentOptions
} from './utils/types'; 