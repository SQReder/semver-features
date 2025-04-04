/**
 * SemVer-Based Feature Toggle Library - Core Package
 */

// Core exports
export { SemverFeatures } from "./core/SemverFeatures";
export { Feature, FeatureValue } from "./core/Feature";
export type { EnabledFeatureValue, DisabledFeatureValue } from "./core/Feature";

// Sources exports
export {
  type FeatureAvailability,
  type FeatureStateSource,
  LocalStorageSource,
  type LocalStorageSourceOptions,
  UrlParamsSource,
  type UrlParamsSourceOptions,
  SessionStorageSource,
  type SessionStorageSourceOptions,
  AsyncSource,
  type AsyncSourceOptions,
} from "./sources";

// Type exports
export type {
  SemverFeaturesOptions,
  FeatureOptions,
  RenderOptions,
  SelectOptions,
  MapOptions,
  FoldOptions,
  ExecuteOptions,
  RenderComponentOptions,
} from "./utils/types";

export { asRange } from "./utils/asRange";
