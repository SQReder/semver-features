import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AsyncSource } from './AsyncSource';
import type { FeatureAvailability } from './types';

describe('AsyncSource', () => {
  describe('constructor', () => {
    it('should set fetchStates and fetchOnInit with defaults', () => {
      // Arrange
      const fetchStates = vi.fn().mockResolvedValue({});
      
      // Act
      const source = new AsyncSource({ fetchStates });
      
      // Assert
      // @ts-expect-error accessing private property for testing
      expect(source.fetchStates).toBe(fetchStates);
      // @ts-expect-error accessing private property for testing
      expect(source.fetchOnInit).toBe(true);
    });

    it('should respect custom fetchOnInit value', () => {
      // Arrange
      const fetchStates = vi.fn().mockResolvedValue({});
      
      // Act
      const source = new AsyncSource({ fetchStates, fetchOnInit: false });
      
      // Assert
      // @ts-expect-error accessing private property for testing
      expect(source.fetchOnInit).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should call refresh if fetchOnInit is true', async () => {
      // Arrange
      const fetchStates = vi.fn().mockResolvedValue({});
      const source = new AsyncSource({ fetchStates });
      const refreshSpy = vi.spyOn(source, 'refresh').mockResolvedValue();
      
      // Act
      await source.initialize();
      
      // Assert
      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call refresh if fetchOnInit is false', async () => {
      // Arrange
      const fetchStates = vi.fn().mockResolvedValue({});
      const source = new AsyncSource({ fetchStates, fetchOnInit: false });
      const refreshSpy = vi.spyOn(source, 'refresh').mockResolvedValue();
      
      // Act
      await source.initialize();
      
      // Assert
      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should call fetchStates when refreshing', async () => {
      // Arrange
      const mockStates = { 'feature1': true };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(fetchStates).toHaveBeenCalledTimes(1);
    });

    it('should update feature states from fetchStates result', async () => {
      // Arrange
      const mockStates = { 'feature1': true };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(source.getFeatureState('feature1')).toBe(true);
    });

    it('should parse string "true" to boolean true', async () => {
      // Arrange
      const mockStates = { 'boolTrue': 'true' };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(source.getFeatureState('boolTrue')).toBe(true);
    });

    it('should parse string "false" to boolean false', async () => {
      // Arrange
      const mockStates = { 'boolFalse': 'false' };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(source.getFeatureState('boolFalse')).toBe(false);
    });

    it('should handle numeric values and convert to string', async () => {
      // Arrange
      const mockStates = { 'numericValue': 123 };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(source.getFeatureState('numericValue')).toBeUndefined();
    });

    it('should keep valid semver strings as is', async () => {
      // Arrange
      const mockStates = { 'version': '1.2.3' };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(source.getFeatureState('version')).toBe('1.2.3');
    });

    it('should exclude invalid values', async () => {
      // Arrange
      const mockStates = { 'invalid': 'not-a-valid-value' };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(source.getFeatureState('invalid')).toBeUndefined();
    });

    it('should handle empty states object', async () => {
      // Arrange
      const mockStates = {};
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      
      // Act
      await source.refresh();
      
      // Assert
      expect(source.getFeatureState('anyFeature')).toBeUndefined();
    });
  });

  describe('getFeatureState', () => {
    it('should return true for enabled features', async () => {
      // Arrange
      const mockStates = { 'enabled': true };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();
      
      // Act
      const result = source.getFeatureState('enabled');
      
      // Assert
      expect(result).toBe(true);
    });

    it('should return false for disabled features', async () => {
      // Arrange
      const mockStates = { 'disabled': false };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();
      
      // Act
      const result = source.getFeatureState('disabled');
      
      // Assert
      expect(result).toBe(false);
    });

    it('should return semver string for version features', async () => {
      // Arrange
      const mockStates = { 'version': '1.2.3' };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();
      
      // Act
      const result = source.getFeatureState('version');
      
      // Assert
      expect(result).toBe('1.2.3');
    });

    it('should return undefined for nonexistent features', async () => {
      // Arrange
      const mockStates = {};
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();
      
      // Act
      const result = source.getFeatureState('nonexistent');
      
      // Assert
      expect(result).toBeUndefined();
    });
  });
}); 