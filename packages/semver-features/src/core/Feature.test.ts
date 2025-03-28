import { describe, it, expect, vi } from 'vitest';
import { Feature } from './Feature';

describe('Feature', () => {
  it('should create a feature with correct properties', () => {
    const feature = new Feature({
      name: 'test-feature',
      currentVersion: '1.0.0',
      minVersion: '1.0.0'
    });
    
    expect(feature.isEnabled).toBe(true);
    expect(feature.requiredVersion).toBe('1.0.0');
  });

  it('should validate version format', () => {
    expect(() => new Feature({
      name: 'test',
      currentVersion: 'invalid',
      minVersion: '1.0.0'
    })).toThrow();

    expect(() => new Feature({
      name: 'test',
      currentVersion: '1.0.0',
      minVersion: '1.0.0'
    })).not.toThrow();
  });

  it('should handle boolean feature flags', () => {
    const enabledFeature = new Feature({
      name: 'test-feature',
      currentVersion: '1.0.0',
      minVersion: true
    });

    const disabledFeature = new Feature({
      name: 'test-feature',
      currentVersion: '1.0.0',
      minVersion: false
    });

    expect(enabledFeature.isEnabled).toBe(true);
    expect(disabledFeature.isEnabled).toBe(false);
  });

  it('should handle different version comparisons', () => {
    // Lower version - feature disabled
    const featureNotReady = new Feature({
      name: 'test-feature',
      currentVersion: '1.0.0',
      minVersion: '2.0.0'
    });
    expect(featureNotReady.isEnabled).toBe(false);

    // Equal version - feature enabled
    const featureJustEnabled = new Feature({
      name: 'test-feature',
      currentVersion: '2.0.0',
      minVersion: '2.0.0'
    });
    expect(featureJustEnabled.isEnabled).toBe(true);

    // Higher version - feature enabled
    const featureEnabled = new Feature({
      name: 'test-feature',
      currentVersion: '2.1.0',
      minVersion: '2.0.0'
    });
    expect(featureEnabled.isEnabled).toBe(true);
  });

  describe('Feature value handling', () => {
    it('should handle select method correctly', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });

      const result = feature.select({
        enabled: 'ON',
        disabled: 'OFF'
      });

      expect(result.value).toBe('ON');
    });

    it('should handle map method correctly', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });

      const result = feature
        .select({ enabled: 1, disabled: 0 })
        .map({
          enabled: (n) => n + 1,
          disabled: (n) => n - 1
        });

      expect(result.value).toBe(2);
    });

    it('should handle fold method correctly', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: false
      });

      const result = feature
        .select({ enabled: 'Yes', disabled: 'No' })
        .fold({
          enabled: (s) => s.toUpperCase(),
          disabled: (s) => s.toLowerCase()
        });

      expect(result).toBe('no');
    });
  });

  describe('Feature execution methods', () => {
    it('should execute appropriate functions based on feature state', () => {
      const feature = new Feature({
        name: 'test-feature',
        currentVersion: '1.0.0',
        minVersion: true
      });

      const result = feature.execute({
        enabled: () => 'enabled',
        disabled: () => 'disabled'
      });

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
}); 