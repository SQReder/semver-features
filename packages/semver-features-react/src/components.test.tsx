import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Feature } from 'semver-features';
import { FeatureToggle } from './components';
import React from 'react';

describe('FeatureToggle', () => {
  it('should render enabled content when feature is enabled', () => {
    const feature = new Feature({
      name: 'test-feature',
      currentVersion: '1.0.0',
      minVersion: true
    });

    render(
      <FeatureToggle
        feature={feature}
        enabled={<div>Feature content</div>}
        disabled={<div>Disabled content</div>}
      />
    );

    expect(screen.getByText('Feature content')).toBeInTheDocument();
    expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
  });

  it('should render disabled content when feature is disabled', () => {
    const feature = new Feature({
      name: 'test-feature',
      currentVersion: '1.0.0',
      minVersion: false
    });

    render(
      <FeatureToggle
        feature={feature}
        enabled={<div>Feature content</div>}
        disabled={<div>Disabled content</div>}
      />
    );

    expect(screen.queryByText('Feature content')).not.toBeInTheDocument();
    expect(screen.getByText('Disabled content')).toBeInTheDocument();
  });

  it('should handle version-based feature flags', () => {
    const enabledFeature = new Feature({
      name: 'test-feature',
      currentVersion: '2.0.0',
      minVersion: '1.0.0'
    });

    const disabledFeature = new Feature({
      name: 'test-feature',
      currentVersion: '0.9.0',
      minVersion: '1.0.0'
    });

    render(
      <>
        <FeatureToggle
          feature={enabledFeature}
          enabled={<div>Enabled feature</div>}
          disabled={<div>Hidden content</div>}
        />
        <FeatureToggle
          feature={disabledFeature}
          enabled={<div>Hidden content</div>}
          disabled={<div>Disabled feature</div>}
        />
      </>
    );

    expect(screen.getByText('Enabled feature')).toBeInTheDocument();
    expect(screen.getByText('Disabled feature')).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });
}); 