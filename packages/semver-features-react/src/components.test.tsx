import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Feature } from 'semver-features';
import { FeatureToggle, FeatureEnabled, FeatureDisabled } from './components';
import React from 'react';

describe('Feature Components', () => {
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

    it('should handle missing disabled content', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });

      render(
        <FeatureToggle
          feature={feature}
          enabled={<div>Feature content</div>}
        />
      );

      expect(screen.queryByText('Feature content')).not.toBeInTheDocument();
      expect(document.body.textContent).toBe('');
    });

    it('should handle complex React elements', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });

      const ComplexComponent = () => (
        <div data-testid="complex">
          <h1>Title</h1>
          <p>Content</p>
        </div>
      );

      render(
        <FeatureToggle
          feature={feature}
          enabled={<ComplexComponent />}
          disabled={<div>Fallback</div>}
        />
      );

      expect(screen.getByTestId('complex')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
    });
  });

  describe('FeatureEnabled', () => {
    it('should render children when feature is enabled', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0'
      });

      render(
        <FeatureEnabled feature={feature}>
          <div>Enabled content</div>
        </FeatureEnabled>
      );

      expect(screen.getByText('Enabled content')).toBeInTheDocument();
    });

    it('should not render children when feature is disabled', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '0.9.0',
        minVersion: '1.0.0'
      });

      render(
        <FeatureEnabled feature={feature}>
          <div>Enabled content</div>
        </FeatureEnabled>
      );

      expect(screen.queryByText('Enabled content')).not.toBeInTheDocument();
    });
  });

  describe('FeatureDisabled', () => {
    it('should render children when feature is disabled', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '0.9.0',
        minVersion: '1.0.0'
      });

      render(
        <FeatureDisabled feature={feature}>
          <div>Disabled content</div>
        </FeatureDisabled>
      );

      expect(screen.getByText('Disabled content')).toBeInTheDocument();
    });

    it('should not render children when feature is enabled', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0'
      });

      render(
        <FeatureDisabled feature={feature}>
          <div>Disabled content</div>
        </FeatureDisabled>
      );

      expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with nested feature toggles', () => {
      const parentFeature = new Feature({
        name: 'parent',
        currentVersion: '2.0.0',
        minVersion: '1.0.0'
      });

      const childFeature = new Feature({
        name: 'child',
        currentVersion: '0.9.0',
        minVersion: '1.0.0'
      });

      render(
        <FeatureToggle
          feature={parentFeature}
          enabled={
            <div>
              <h1>Parent</h1>
              <FeatureToggle
                feature={childFeature}
                enabled={<p>Child Enabled</p>}
                disabled={<p>Child Disabled</p>}
              />
            </div>
          }
          disabled={<div>Parent Disabled</div>}
        />
      );

      expect(screen.getByText('Parent')).toBeInTheDocument();
      expect(screen.getByText('Child Disabled')).toBeInTheDocument();
      expect(screen.queryByText('Child Enabled')).not.toBeInTheDocument();
      expect(screen.queryByText('Parent Disabled')).not.toBeInTheDocument();
    });

    it('should work with mixed component types', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0'
      });

      render(
        <div>
          <FeatureToggle
            feature={feature}
            enabled={<div>Toggle Enabled</div>}
            disabled={<div>Toggle Disabled</div>}
          />
          <FeatureEnabled feature={feature}>
            <div>Feature Enabled</div>
          </FeatureEnabled>
          <FeatureDisabled feature={feature}>
            <div>Feature Disabled</div>
          </FeatureDisabled>
        </div>
      );

      expect(screen.getByText('Toggle Enabled')).toBeInTheDocument();
      expect(screen.getByText('Feature Enabled')).toBeInTheDocument();
      expect(screen.queryByText('Toggle Disabled')).not.toBeInTheDocument();
      expect(screen.queryByText('Feature Disabled')).not.toBeInTheDocument();
    });
  });
}); 