/**
 * React integration components
 * Note: These components require React as a peer dependency
 */

import * as React from 'react';
import type { Feature } from 'semver-features/core';

/**
 * Properties for the FeatureToggle component
 */
interface FeatureToggleProps {
  /**
   * Feature entity to check
   */
  feature: Feature;
  
  /**
   * Content to render when feature is enabled
   */
  enabled: React.ReactNode;
  
  /**
   * Content to render when feature is disabled
   */
  disabled?: React.ReactNode;
}

/**
 * Component that renders different content based on feature status
 */
export function FeatureToggle(props: FeatureToggleProps): React.ReactElement | null {
  const { feature, enabled, disabled } = props;
  
  return feature.isEnabled 
    ? (enabled as React.ReactElement) 
    : (disabled as React.ReactElement) || null;
}

/**
 * Properties for the FeatureEnabled component
 */
interface FeatureEnabledProps {
  /**
   * Feature entity to check
   */
  feature: Feature;
  
  /**
   * Content to render when feature is enabled
   */
  children: React.ReactNode;
}

/**
 * Component that only renders content when feature is enabled
 */
export function FeatureEnabled(props: FeatureEnabledProps): React.ReactElement | null {
  const { feature, children } = props;
  
  return feature.isEnabled ? (children as React.ReactElement) : null;
}

/**
 * Properties for the FeatureDisabled component
 */
interface FeatureDisabledProps {
  /**
   * Feature entity to check
   */
  feature: Feature;
  
  /**
   * Content to render when feature is disabled
   */
  children: React.ReactNode;
}

/**
 * Component that only renders content when feature is disabled
 */
export function FeatureDisabled(props: FeatureDisabledProps): React.ReactElement | null {
  const { feature, children } = props;
  
  return !feature.isEnabled ? (children as React.ReactElement) : null;
} 