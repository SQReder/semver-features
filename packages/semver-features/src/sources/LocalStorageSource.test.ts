import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { LocalStorageSource } from './LocalStorageSource';

describe('LocalStorageSource', () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    mockLocalStorage = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: vi.fn(() => {
        mockLocalStorage = {};
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('constructor and prefix behavior', () => {
    it('should use default prefix for feature keys', () => {
      mockLocalStorage['feature.test'] = 'true';
      
      const source = new LocalStorageSource();
      const result = source.getFeatureState('test');
      
      expect(result).toBe(true);
    });

    it('should use custom prefix when provided', () => {
      mockLocalStorage['custom.test'] = 'true';
      
      const source = new LocalStorageSource({ prefix: 'custom.' });
      const result = source.getFeatureState('test');
      
      expect(result).toBe(true);
    });
  });

  describe('getFeatureState', () => {
    it('should return undefined for nonexistent features', () => {
      const source = new LocalStorageSource();
      
      const result = source.getFeatureState('nonexistent');
      
      expect(result).toBeUndefined();
    });

    it('should access localStorage with the correct prefixed key', () => {
      const source = new LocalStorageSource();
      
      source.getFeatureState('test');
      
      expect(localStorage.getItem).toHaveBeenCalledWith('feature.test');
    });

    it('should return boolean true for "true" string values', () => {
      mockLocalStorage['feature.enabled'] = 'true';
      const source = new LocalStorageSource();
      
      const result = source.getFeatureState('enabled');
      
      expect(result).toBe(true);
    });

    it('should return boolean false for "false" string values', () => {
      mockLocalStorage['feature.disabled'] = 'false';
      const source = new LocalStorageSource();
      
      const result = source.getFeatureState('disabled');
      
      expect(result).toBe(false);
    });

    it('should return semver string for valid semver values', () => {
      mockLocalStorage['feature.version'] = '1.2.3';
      const source = new LocalStorageSource();
      
      const result = source.getFeatureState('version');
      
      expect(result).toBe('1.2.3');
    });
  });
}); 