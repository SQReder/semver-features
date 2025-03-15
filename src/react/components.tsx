/**
 * React integration components
 * Note: These components require React as a peer dependency
 */

// Define fallback types for React when it's not available
type ReactNodeType = any;
// We'll use basic return types when JSX isn't available
type ElementType = any;

import type { Feature } from '../core/Feature';

/**
 * Properties for the FeatureToggle component
 */
interface FeatureToggleProps {
  /**
   * Feature entity to check
   */
  feature: Feature<any, any>;
  
  /**
   * Content to render when feature is enabled
   */
  enabled: ReactNodeType;
  
  /**
   * Content to render when feature is disabled
   */
  disabled?: ReactNodeType;
}

/**
 * Component that renders different content based on feature status
 */
export function FeatureToggle(props: FeatureToggleProps): ElementType | null {
  const { feature, enabled, disabled } = props;
  
  return feature.isEnabled 
    ? (enabled as ElementType) 
    : (disabled as ElementType) || null;
}

/**
 * Properties for the FeatureEnabled component
 */
interface FeatureEnabledProps {
  /**
   * Feature entity to check
   */
  feature: Feature<any, any>;
  
  /**
   * Content to render when feature is enabled
   */
  children: ReactNodeType;
}

/**
 * Component that only renders content when feature is enabled
 */
export function FeatureEnabled(props: FeatureEnabledProps): ElementType | null {
  const { feature, children } = props;
  
  return feature.isEnabled ? (children as ElementType) : null;
}

/**
 * Properties for the FeatureDisabled component
 */
interface FeatureDisabledProps {
  /**
   * Feature entity to check
   */
  feature: Feature<any, any>;
  
  /**
   * Content to render when feature is disabled
   */
  children: ReactNodeType;
}

/**
 * Component that only renders content when feature is disabled
 */
export function FeatureDisabled(props: FeatureDisabledProps): ElementType | null {
  const { feature, children } = props;
  
  return !feature.isEnabled ? (children as ElementType) : null;
} 