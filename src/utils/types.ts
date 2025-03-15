/**
 * Type definitions for the SemVer-based feature toggle library
 */

// We'll make ReactNode optional and provide a fallback type
type ReactNodeType = any; // Fallback type when React is not available

/**
 * Options for initializing the SemverFeatures class
 */
export interface SemverFeaturesOptions {
  /**
   * The current application version (required)
   */
  version: string;
}

/**
 * Options for creating a Feature instance
 */
export interface FeatureOptions {
  /**
   * Unique name for the feature
   */
  name: string;
  
  /**
   * Minimum semver version required for this feature
   */
  minVersion: string;
  
  /**
   * Current application version
   */
  currentVersion: string;
}

/**
 * Options for execution with a feature
 */
export interface ExecuteOptions<R> {
  /**
   * Function to execute when feature is enabled
   */
  enabled: () => R;
  
  /**
   * Function to execute when feature is disabled
   */
  disabled: () => R;
}

/**
 * Options for component rendering with a feature
 */
export interface RenderOptions<T, U> {
  /**
   * Function that returns the component to render when feature is enabled
   */
  enabled: () => T;
  
  /**
   * Function that returns the component to render when feature is disabled
   */
  disabled: () => U;
}

/**
 * Options for direct component rendering with a feature
 */
export interface RenderComponentOptions<C> {
  /**
   * Component to render when feature is enabled
   */
  enabled: C;
  
  /**
   * Component to render when feature is disabled
   */
  disabled: C;
}

/**
 * Configuration for a single API version
 */
export interface ApiVersionConfig<T> {
  /**
   * Minimum semver version required for this API version
   */
  minVersion: string;
  
  /**
   * API methods
   */
  [methodName: string]: any;
}

/**
 * Configuration for versioned API
 */
export interface VersionedApiConfig<T extends Record<string, any>> {
  /**
   * Available API versions
   */
  versions: Record<string, ApiVersionConfig<T>>;
}

/**
 * Options for select transformation
 */
export interface SelectOptions<E, D> {
  /**
   * Value to use when feature is enabled
   */
  enabled: E;
  
  /**
   * Value to use when feature is disabled
   */
  disabled: D;
}

/**
 * Options for map transformation
 */
export interface MapOptions<E, D, NE, ND> {
  /**
   * Function to transform enabled value
   */
  enabled: (value: E) => NE;
  
  /**
   * Function to transform disabled value
   */
  disabled: (value: D) => ND;
}

/**
 * Options for fold transformation
 */
export interface FoldOptions<E, D, R> {
  /**
   * Function to transform enabled value to result type
   */
  enabled: (value: E) => R;
  
  /**
   * Function to transform disabled value to result type
   */
  disabled: (value: D) => R;
}

/**
 * React specific types - only used when React is available
 */
export type ReactComponent = ReactNodeType; 