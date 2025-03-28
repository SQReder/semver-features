import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Feature } from 'semver-features';
import { FeatureToggle, FeatureEnabled, FeatureDisabled } from './components';
import React from 'react';

describe('Feature Components', () => {
  describe('FeatureToggle', () => {
    let enabledFeature: Feature<boolean, boolean>;
    let disabledFeature: Feature<boolean, boolean>;
    let ComplexComponent: React.FC;

    beforeEach(() => {
      // Common test setup for this describe block
      enabledFeature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });

      disabledFeature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });
      
      ComplexComponent = () => (
        <div data-testid="complex">
          <h1>Title</h1>
          <p>Content</p>
        </div>
      );
    });

    describe('with enabled feature', () => {
      it('should render enabled content', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={enabledFeature}
            enabled={<div>Feature content</div>}
            disabled={<div>Disabled content</div>}
          />
        );
        
        // Assert
        expect(screen.getByText('Feature content')).toBeInTheDocument();
      });

      it('should not render disabled content', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={enabledFeature}
            enabled={<div>Feature content</div>}
            disabled={<div>Disabled content</div>}
          />
        );
        
        // Assert
        expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
      });
      
      it('should render complex component title', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={enabledFeature}
            enabled={<ComplexComponent />}
            disabled={<div>Fallback</div>}
          />
        );
        
        // Assert
        expect(screen.getByText('Title')).toBeInTheDocument();
      });
      
      it('should render complex component content paragraph', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={enabledFeature}
            enabled={<ComplexComponent />}
            disabled={<div>Fallback</div>}
          />
        );
        
        // Assert
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
      
      it('should render complex component with correct test id', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={enabledFeature}
            enabled={<ComplexComponent />}
            disabled={<div>Fallback</div>}
          />
        );
        
        // Assert
        expect(screen.getByTestId('complex')).toBeInTheDocument();
      });
      
      it('should not render fallback content', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={enabledFeature}
            enabled={<ComplexComponent />}
            disabled={<div>Fallback</div>}
          />
        );
        
        // Assert
        expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
      });
    });

    describe('with disabled feature', () => {
      it('should render disabled content', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={disabledFeature}
            enabled={<div>Feature content</div>}
            disabled={<div>Disabled content</div>}
          />
        );
        
        // Assert
        expect(screen.getByText('Disabled content')).toBeInTheDocument();
      });

      it('should not render enabled content', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={disabledFeature}
            enabled={<div>Feature content</div>}
            disabled={<div>Disabled content</div>}
          />
        );
        
        // Assert
        expect(screen.queryByText('Feature content')).not.toBeInTheDocument();
      });
      
      it('should render nothing when disabled content is not provided', () => {
        // Arrange & Act
        render(
          <FeatureToggle
            feature={disabledFeature}
            enabled={<div>Feature content</div>}
          />
        );

        // Assert
        expect(document.body.textContent).toBe('');
      });
    });
  });

  describe('FeatureEnabled', () => {
    let enabledFeature: Feature<string, string>;
    let disabledFeature: Feature<string, string>;

    beforeEach(() => {
      enabledFeature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      disabledFeature = new Feature({
        name: 'test-feature',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });
    });

    it('should render children when feature is enabled', () => {
      // Arrange & Act
      render(
        <FeatureEnabled feature={enabledFeature}>
          <div>Enabled content</div>
        </FeatureEnabled>
      );
      
      // Assert
      expect(screen.getByText('Enabled content')).toBeInTheDocument();
    });

    it('should not render children when feature is disabled', () => {
      // Arrange & Act
      render(
        <FeatureEnabled feature={disabledFeature}>
          <div>Enabled content</div>
        </FeatureEnabled>
      );
      
      // Assert
      expect(screen.queryByText('Enabled content')).not.toBeInTheDocument();
    });
  });

  describe('FeatureDisabled', () => {
    let enabledFeature: Feature<string, string>;
    let disabledFeature: Feature<string, string>;

    beforeEach(() => {
      enabledFeature = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      disabledFeature = new Feature({
        name: 'test-feature',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });
    });

    it('should render children when feature is disabled', () => {
      // Arrange & Act
      render(
        <FeatureDisabled feature={disabledFeature}>
          <div>Disabled content</div>
        </FeatureDisabled>
      );
      
      // Assert
      expect(screen.getByText('Disabled content')).toBeInTheDocument();
    });

    it('should not render children when feature is enabled', () => {
      // Arrange & Act
      render(
        <FeatureDisabled feature={enabledFeature}>
          <div>Disabled content</div>
        </FeatureDisabled>
      );
      
      // Assert
      expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    let parentFeatureEnabled: Feature<string, string>;
    let childFeatureDisabled: Feature<string, string>;
    let featureEnabled: Feature<string, string>;

    beforeEach(() => {
      parentFeatureEnabled = new Feature({
        name: 'parent',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });

      childFeatureDisabled = new Feature({
        name: 'child',
        currentVersion: '0.9.0',
        minVersion: '1.0.0' as const
      });

      featureEnabled = new Feature({
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const
      });
    });

    describe('with nested components', () => {
      const renderNestedComponents = () => {
        render(
          <FeatureToggle
            feature={parentFeatureEnabled}
            enabled={
              <div>
                <h1>Parent</h1>
                <FeatureToggle
                  feature={childFeatureDisabled}
                  enabled={<p>Child Enabled</p>}
                  disabled={<p>Child Disabled</p>}
                />
              </div>
            }
            disabled={<div>Parent Disabled</div>}
          />
        );
      };
      
      it('should render parent content when parent feature is enabled', () => {
        // Arrange & Act
        renderNestedComponents();
        
        // Assert
        expect(screen.getByText('Parent')).toBeInTheDocument();
      });

      it('should not render parent disabled content when parent is enabled', () => {
        // Arrange & Act
        renderNestedComponents();
        
        // Assert
        expect(screen.queryByText('Parent Disabled')).not.toBeInTheDocument();
      });
      
      it('should render child disabled content when parent is enabled but child is disabled', () => {
        // Arrange & Act
        renderNestedComponents();
        
        // Assert
        expect(screen.getByText('Child Disabled')).toBeInTheDocument();
      });

      it('should not render child enabled content when parent is enabled but child is disabled', () => {
        // Arrange & Act
        renderNestedComponents();
        
        // Assert
        expect(screen.queryByText('Child Enabled')).not.toBeInTheDocument();
      });
    });

    describe('with multiple component types', () => {
      const renderMultipleComponents = () => {
        render(
          <div>
            <FeatureToggle
              feature={featureEnabled}
              enabled={<div>Toggle Enabled</div>}
              disabled={<div>Toggle Disabled</div>}
            />
            <FeatureEnabled feature={featureEnabled}>
              <div>Feature Enabled</div>
            </FeatureEnabled>
            <FeatureDisabled feature={featureEnabled}>
              <div>Feature Disabled</div>
            </FeatureDisabled>
          </div>
        );
      };
      
      it('should render toggle enabled content when feature is enabled', () => {
        // Arrange & Act
        renderMultipleComponents();
        
        // Assert
        expect(screen.getByText('Toggle Enabled')).toBeInTheDocument();
      });

      it('should not render toggle disabled content when feature is enabled', () => {
        // Arrange & Act
        renderMultipleComponents();
        
        // Assert
        expect(screen.queryByText('Toggle Disabled')).not.toBeInTheDocument();
      });
      
      it('should render FeatureEnabled component content when feature is enabled', () => {
        // Arrange & Act
        renderMultipleComponents();
        
        // Assert
        expect(screen.getByText('Feature Enabled')).toBeInTheDocument();
      });

      it('should not render FeatureDisabled content when feature is enabled', () => {
        // Arrange & Act
        renderMultipleComponents();
        
        // Assert
        expect(screen.queryByText('Feature Disabled')).not.toBeInTheDocument();
      });
    });
  });
}); 