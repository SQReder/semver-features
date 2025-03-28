import { describe, it, expect, vi } from 'vitest';
import { SemverFeatures } from './SemverFeatures';

describe('SemverFeatures', () => {
  describe('Constructor and Initialization', () => {
    it('should throw error when version is not provided', () => {
      // Arrange & Act & Assert
      expect(() => new SemverFeatures({} as any)).toThrow('Version must be explicitly provided');
    });

    it('should initialize with correct version', () => {
      // Arrange
      const version = '1.2.3';
      
      // Act
      const features = new SemverFeatures({ version });
      
      // Assert
      expect(features.currentVersion).toBe(version);
    });

    it('should initialize sources when provided', () => {
      // Arrange
      const mockSource = {
        initialize: vi.fn(),
        getFeatureState: vi.fn()
      };
      
      // Act
      new SemverFeatures({ 
        version: '1.0.0',
        sources: [mockSource]
      });
      
      // Assert
      expect(mockSource.initialize).toHaveBeenCalledTimes(1);
    });

    it('should skip initialization when source has no initialize method', () => {
      // Arrange
      const mockSource = {
        getFeatureState: vi.fn()
      };
      
      // Act & Assert (no error thrown)
      expect(() => new SemverFeatures({ 
        version: '1.0.0', 
        sources: [mockSource]
      })).not.toThrow();
    });

    it('should handle empty sources array', () => {
      // Arrange
      const options = {
        version: '1.0.0',
        sources: []
      };
      
      // Act & Assert (no error thrown)
      expect(() => new SemverFeatures(options)).not.toThrow();
    });

    it('should handle undefined sources', () => {
      // Arrange
      const options = {
        version: '1.0.0',
        sources: undefined
      };
      
      // Act & Assert (no error thrown)
      expect(() => new SemverFeatures(options)).not.toThrow();
    });
  });

  describe('Feature Registration', () => {
    it('should return existing feature if already registered', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      const feature1 = features.register('test-feature', '1.0.0');
      
      // Act
      const feature2 = features.register('test-feature', '2.0.0');
      
      // Assert
      expect(feature1).toBe(feature2);
    });
    
    it('should create new feature if not previously registered', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Act
      const feature = features.register('new-feature', '1.0.0');
      
      // Assert
      expect(feature).toBeDefined();
      expect(feature.isEnabled).toBe(true);
    });

    it('should register feature with semver string for version-based features', () => {
      // Arrange
      const features = new SemverFeatures({ version: '2.0.0' });
      
      // Act
      const feature = features.register('semver-feature', '1.5.0');
      
      // Assert
      expect(feature.requiredVersion).toBe('1.5.0');
    });

    it('should register feature with boolean true for explicitly enabled features', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Act
      const feature = features.register('explicit-feature', true);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it('should register feature with boolean false for explicitly disabled features', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Act
      const feature = features.register('disabled-feature', false);
      
      // Assert
      expect(feature.isEnabled).toBe(false);
    });

    it('should preserve feature state across retrievals', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      const feature = features.register('stateful-feature', true);
      
      // Act - Get the same feature again
      const retrievedFeature = features.register('stateful-feature', false);
      
      // Assert - Should maintain original state (true), ignoring the new value (false)
      expect(retrievedFeature.isEnabled).toBe(true);
    });
  });

  describe('Feature State Reporting', () => {
    it('should return feature information with correct name and enabled status', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register test features
      features.register('feature1', '0.5.0');
      features.register('feature2', '2.0.0');
      features.register('feature3', true);
      features.register('feature4', false);
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result).toEqual([
        { name: 'feature1', enabled: true },
        { name: 'feature2', enabled: false },
        { name: 'feature3', enabled: true },
        { name: 'feature4', enabled: false }
      ]);
    });
    
    it('should correctly identify enabled features based on semver comparison', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register feature with version below current (should be enabled)
      features.register('feature1', '0.5.0');
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result.find(f => f.name === 'feature1')?.enabled).toBe(true);
    });
    
    it('should correctly identify disabled features based on semver comparison', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register feature with version above current (should be disabled)
      features.register('feature2', '2.0.0');
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result.find(f => f.name === 'feature2')?.enabled).toBe(false);
    });
    
    it('should respect explicitly enabled features regardless of version', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register explicitly enabled feature
      features.register('feature3', true);
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result.find(f => f.name === 'feature3')?.enabled).toBe(true);
    });
    
    it('should respect explicitly disabled features regardless of version', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register explicitly disabled feature
      features.register('feature4', false);
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result.find(f => f.name === 'feature4')?.enabled).toBe(false);
    });
    
    it('should return empty array when no features are registered', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('Integration with Feature State Sources', () => {
    it('should pass sources to Feature instances', () => {
      // Arrange
      const mockSource = {
        getFeatureState: vi.fn(),
      };
      const features = new SemverFeatures({ 
        version: '1.0.0',
        sources: [mockSource]
      });
      
      // Act - Register will create a Feature instance with the sources
      features.register('source-test', '1.0.0');
      
      // Assert
      // This is an indirect test - we're verifying the feature was created
      // with the source. The Feature class tests would verify it uses the sources.
      expect(features.dumpFeatures()[0].name).toBe('source-test');
    });

    it('should determine feature state from sources', () => {
      // Arrange
      const mockSource = {
        getFeatureState: vi.fn((name) => {
          if (name === 'source-enabled') return true;
          if (name === 'source-disabled') return false;
          return undefined;
        }),
      };
      
      const features = new SemverFeatures({ 
        version: '2.0.0',  // Higher than required versions
        sources: [mockSource]
      });
      
      // Act
      const enabledFeature = features.register('source-enabled', '3.0.0'); // Would be disabled by version
      
      // Assert
      expect(enabledFeature.isEnabled).toBe(true); // Source wins over version
    });
    
    it('should prioritize source state over version comparison', () => {
      // Arrange
      const mockSource = {
        getFeatureState: vi.fn((name) => {
          if (name === 'source-disabled') return false;
          return undefined;
        }),
      };
      
      const features = new SemverFeatures({ 
        version: '2.0.0',  // Higher than required versions
        sources: [mockSource]
      });
      
      // Act
      const disabledFeature = features.register('source-disabled', '1.0.0'); // Would be enabled by version
      
      // Assert
      expect(disabledFeature.isEnabled).toBe(false); // Source wins over version
    });

    it('should fall back to version comparison when sources provide no state', () => {
      // Arrange
      const mockSource = {
        getFeatureState: vi.fn().mockReturnValue(undefined),
      };
      
      const features = new SemverFeatures({ 
        version: '2.0.0',
        sources: [mockSource]
      });
      
      // Act
      const enabledFeature = features.register('version-enabled', '1.0.0'); // Lower than current
      const disabledFeature = features.register('version-disabled', '3.0.0'); // Higher than current
      
      // Assert - test only one assertion per test for clarity
      expect(enabledFeature.isEnabled).toBe(true); // Fallback to version comparison
    });
    
    it('should disable features when version comparison fails after source fallback', () => {
      // Arrange
      const mockSource = {
        getFeatureState: vi.fn().mockReturnValue(undefined),
      };
      
      const features = new SemverFeatures({ 
        version: '2.0.0',
        sources: [mockSource]
      });
      
      // Act
      const disabledFeature = features.register('version-disabled', '3.0.0'); // Higher than current
      
      // Assert
      expect(disabledFeature.isEnabled).toBe(false); // Fallback to version comparison
    });
  });

  describe('Error Handling', () => {
    it('should throw error when version is missing', () => {
      // Arrange, Act & Assert
      expect(() => new SemverFeatures({} as any)).toThrow('Version must be explicitly provided');
    });

    it('should handle registration with invalid version format properly', () => {
      // Arrange
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Act & Assert
      expect(() => features.register('invalid', 'not-a-version' as any)).toThrow();
    });
  });
}); 