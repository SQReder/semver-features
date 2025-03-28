import { describe, it, expect, vi } from 'vitest';
import { Feature, FeatureValue } from './Feature';
import type { FeatureStateSource } from "../sources/types";

describe('Feature', () => {
  describe('initialization', () => {
    it('should enable feature when current version matches required version', () => {
      // Arrange
      const featureConfig = {
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: '1.0.0' as const
      };
      
      // Act
      const feature = new Feature(featureConfig);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it('should correctly store required version', () => {
      // Arrange
      const featureConfig = {
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: '1.0.0' as const
      };
      
      // Act
      const feature = new Feature(featureConfig);
      
      // Assert
      expect(feature.requiredVersion).toBe('1.0.0');
    });
  });

  describe('version validation', () => {
    it('should throw error with invalid current version format', () => {
      // Arrange
      const invalidConfig = {
        name: 'test',
        currentVersion: 'invalid',
        minVersion: '1.0.0' as const
      };
      
      // Act & Assert
      expect(() => new Feature(invalidConfig)).toThrow();
    });

    it('should not throw error with valid version format', () => {
      // Arrange
      const validConfig = {
        name: 'test',
        currentVersion: '1.0.0',
        minVersion: '1.0.0' as const
      };
      
      // Act & Assert
      expect(() => new Feature(validConfig)).not.toThrow();
    });
  });

  describe('boolean feature flags', () => {
    it('should enable feature when minVersion is true', () => {
      // Arrange
      const enabledConfig = {
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      };
      
      // Act
      const feature = new Feature(enabledConfig);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it('should disable feature when minVersion is false', () => {
      // Arrange
      const disabledConfig = {
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      };
      
      // Act
      const feature = new Feature(disabledConfig);
      
      // Assert
      expect(feature.isEnabled).toBe(false);
    });
  });

  describe('version comparison', () => {
    it('should disable feature when current version is lower than required', () => {
      // Arrange
      const config = {
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: '2.0.0' as const
      };
      
      // Act
      const feature = new Feature(config);
      
      // Assert
      expect(feature.isEnabled).toBe(false);
    });

    it('should enable feature when current version equals required version', () => {
      // Arrange
      const config = {
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '2.0.0' as const
      };
      
      // Act
      const feature = new Feature(config);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it('should enable feature when current version is higher than required', () => {
      // Arrange
      const config = {
        name: 'test-feature',
        currentVersion: '2.1.0',
        minVersion: '2.0.0' as const
      };
      
      // Act
      const feature = new Feature(config);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });
  });

  describe('Feature value handling', () => {
    it('should return enabled value when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });
      
      // Act
      const result = feature.select({
        enabled: 'ON',
        disabled: 'OFF'
      });
      
      // Assert
      expect(result.value).toBe('ON');
    });

    it('should apply map function to enabled value', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });
      
      // Act
      const result = feature
        .select({ enabled: 1, disabled: 0 })
        .map({
          enabled: (n) => n + 1,
          disabled: (n) => n - 1
        });
      
      // Assert
      expect(result.value).toBe(2);
    });

    it('should apply fold function to disabled value', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });
      
      // Act
      const result = feature
        .select({ enabled: 'Yes', disabled: 'No' })
        .fold({
          enabled: (s) => s.toUpperCase(),
          disabled: (s) => s.toLowerCase()
        });
      
      // Assert
      expect(result).toBe('no');
    });
  });

  describe('Feature execution methods', () => {
    it('should execute enabled function when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });
      
      // Act
      const result = feature.execute({
        enabled: () => 'enabled',
        disabled: () => 'disabled'
      });
      
      // Assert
      expect(result).toBe('enabled');
    });
  });

  describe('Feature when method', () => {
    it('should execute callback when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'enabled-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0'
      });
      const callback = vi.fn().mockReturnValue('callback result');
      
      // Act
      const result = feature.when(callback);
      
      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
      expect(result).toBe('callback result');
    });

    it('should not execute callback when feature is disabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'disabled-feature',
        currentVersion: '1.0.0',
        minVersion: '2.0.0'
      });
      const callback = vi.fn().mockReturnValue('callback result');
      
      // Act
      const result = feature.when(callback);
      
      // Assert
      expect(callback).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return the callback result when feature is enabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });
      
      // Act
      const result = feature.when(() => 'test value');
      
      // Assert
      expect(result).toBe('test value');
    });

    it('should return undefined when feature is disabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });
      
      // Act
      const result = feature.when(() => 'test value');
      
      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('Feature state sources', () => {
    it('should prioritize source state over version comparison when enabled', () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: (name: string) => name === 'test-feature' ? true : undefined
      };
      
      const config = {
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: '2.0.0' as const,
        sources: [mockSource]
      };
      
      // Act
      const feature = new Feature(config);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it('should prioritize source state over version comparison when disabled', () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: (name: string) => name === 'test-feature' ? false : undefined
      };
      
      const config = {
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const,
        sources: [mockSource]
      };
      
      // Act
      const feature = new Feature(config);
      
      // Assert
      expect(feature.isEnabled).toBe(false);
    });

    it('should check sources in order and use first defined state', () => {
      // Arrange
      const firstSource: FeatureStateSource = {
        getFeatureState: () => undefined
      };
      
      const secondSource: FeatureStateSource = {
        getFeatureState: (name: string) => name === 'test-feature' ? true : undefined
      };
      
      const config = {
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: '2.0.0' as const,
        sources: [firstSource, secondSource]
      };
      
      // Act
      const feature = new Feature(config);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it('should fall back to version comparison when no source provides a state', () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: () => undefined
      };
      
      const config = {
        name: 'test-feature',
        currentVersion: '2.0.0',
        minVersion: '1.0.0' as const,
        sources: [mockSource]
      };
      
      // Act
      const feature = new Feature(config);
      
      // Assert
      expect(feature.isEnabled).toBe(true);
    });
  });

  describe('Complex object value handling', () => {
    it('should handle complex object values for enabled features', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });
      
      const enabledObject = { key: 'enabled', value: 42, nested: { flag: true } };
      const disabledObject = { key: 'disabled', value: 0, nested: { flag: false } };
      
      // Act
      const result = feature.select({
        enabled: enabledObject,
        disabled: disabledObject
      });
      
      // Assert
      expect(result.value).toEqual(enabledObject);
    });
    
    it('should handle complex object values for disabled features', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });
      
      const enabledObject = { key: 'enabled', value: 42, nested: { flag: true } };
      const disabledObject = { key: 'disabled', value: 0, nested: { flag: false } };
      
      // Act
      const result = feature.select({
        enabled: enabledObject,
        disabled: disabledObject
      });
      
      // Assert
      expect(result.value).toEqual(disabledObject);
    });
    
    it('should map complex object properties', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });
      
      // Act
      const result = feature
        .select({
          enabled: { count: 5, label: 'test' },
          disabled: { count: 0, label: 'disabled' }
        })
        .map({
          enabled: (obj) => ({ ...obj, count: obj.count * 2, label: obj.label.toUpperCase() }),
          disabled: (obj) => ({ ...obj, count: -1, label: 'INACTIVE' })
        });
      
      // Assert
      expect(result.value).toEqual({ count: 10, label: 'TEST' });
    });
    
    it('should fold complex objects to derived values', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });
      
      // Act
      const result = feature
        .select({
          enabled: { items: ['a', 'b', 'c'], active: true },
          disabled: { items: ['x', 'y'], active: false }
        })
        .fold<string | number>({
          enabled: (obj) => obj.items.length,
          disabled: (obj) => obj.items.join('-')
        });
      
      // Assert
      expect(result).toBe('x-y');
    });
  });

  describe('Feature execution with disabled feature', () => {
    it('should execute disabled function when feature is disabled', () => {
      // Arrange
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });
      
      // Act
      const result = feature.execute({
        enabled: () => 'enabled',
        disabled: () => 'disabled'
      });
      
      // Assert
      expect(result).toBe('disabled');
    });
  });
}); 