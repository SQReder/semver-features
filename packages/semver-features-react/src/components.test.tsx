import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Feature } from 'semver-features';
import { FeatureToggle, FeatureEnabled, FeatureDisabled } from './components';
import React from 'react';

describe('Feature Components', () => {
  describe('FeatureToggle', () => {
    it('should render enabled content when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<div>Feature content</div>}
          disabled={<div>Disabled content</div>}
        />
      );

      // Assert
      expect(screen.getByText('Feature content')).toBeInTheDocument();
    });

    it('should not render disabled content when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<div>Feature content</div>}
          disabled={<div>Disabled content</div>}
        />
      );

      // Assert
      expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
    });

    it('should render disabled content when feature is disabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<div>Feature content</div>}
          disabled={<div>Disabled content</div>}
        />
      );

      // Assert
      expect(screen.getByText('Disabled content')).toBeInTheDocument();
    });

    it('should not render enabled content when feature is disabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<div>Feature content</div>}
          disabled={<div>Disabled content</div>}
        />
      );

      // Assert
      expect(screen.queryByText('Feature content')).not.toBeInTheDocument();
    });

    it('should render nothing when disabled content is not provided and feature is disabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<div>Feature content</div>}
        />
      );

      // Assert
      expect(document.body.textContent).toBe('');
    });

    it('should render title in complex component when feature is enabled', () => {
      // Arrange
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

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<ComplexComponent />}
          disabled={<div>Fallback</div>}
        />
      );

      // Assert
      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('should render content paragraph in complex component when feature is enabled', () => {
      // Arrange
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

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<ComplexComponent />}
          disabled={<div>Fallback</div>}
        />
      );

      // Assert
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render component with correct test id when feature is enabled', () => {
      // Arrange
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

      // Act
      render(
        <FeatureToggle
          feature={feature}
          enabled={<ComplexComponent />}
          disabled={<div>Fallback</div>}
        />
      );

      // Assert
      expect(screen.getByTestId('complex')).toBeInTheDocument();
    });
  });

  describe('FeatureEnabled', () => {
    it('should render children when feature is enabled by version comparison', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      // Act
      render(
        <FeatureEnabled feature={feature}>
          <div>Enabled content</div>
        </FeatureEnabled>
      );

      // Assert
      expect(screen.getByText('Enabled content')).toBeInTheDocument();
    });

    it('should not render children when feature is disabled by version comparison', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });

      // Act
      render(
        <FeatureEnabled feature={feature}>
          <div>Enabled content</div>
        </FeatureEnabled>
      );

      // Assert
      expect(screen.queryByText('Enabled content')).not.toBeInTheDocument();
    });
  });

  describe('FeatureDisabled', () => {
    it('should render children when feature is disabled by version comparison', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });

      // Act
      render(
        <FeatureDisabled feature={feature}>
          <div>Disabled content</div>
        </FeatureDisabled>
      );

      // Assert
      expect(screen.getByText('Disabled content')).toBeInTheDocument();
    });

    it('should not render children when feature is enabled by version comparison', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      // Act
      render(
        <FeatureDisabled feature={feature}>
          <div>Disabled content</div>
        </FeatureDisabled>
      );

      // Assert
      expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render parent content when parent feature is enabled', () => {
      // Arrange
      const parentFeature = new Feature({
        name: 'parent',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      const childFeature = new Feature({
        name: 'child',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('should render child disabled content when parent is enabled but child is disabled', () => {
      // Arrange
      const parentFeature = new Feature({
        name: 'parent',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      const childFeature = new Feature({
        name: 'child',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.getByText('Child Disabled')).toBeInTheDocument();
    });

    it('should not render child enabled content when parent is enabled but child is disabled', () => {
      // Arrange
      const parentFeature = new Feature({
        name: 'parent',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      const childFeature = new Feature({
        name: 'child',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.queryByText('Child Enabled')).not.toBeInTheDocument();
    });

    it('should not render parent disabled content when parent is enabled', () => {
      // Arrange
      const parentFeature = new Feature({
        name: 'parent',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      const childFeature = new Feature({
        name: 'child',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.queryByText('Parent Disabled')).not.toBeInTheDocument();
    });

    it('should render enabled toggle content when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.getByText('Toggle Enabled')).toBeInTheDocument();
    });

    it('should render FeatureEnabled component content when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.getByText('Feature Enabled')).toBeInTheDocument();
    });

    it('should not render toggle disabled content when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.queryByText('Toggle Disabled')).not.toBeInTheDocument();
    });

    it('should not render FeatureDisabled content when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      // Act
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

      // Assert
      expect(screen.queryByText('Feature Disabled')).not.toBeInTheDocument();
    });
  });
}); 