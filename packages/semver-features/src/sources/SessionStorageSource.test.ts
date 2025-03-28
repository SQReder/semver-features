import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SessionStorageSource } from './SessionStorageSource';

describe('SessionStorageSource', () => {
  let mockSessionStorage: Record<string, string>;

  beforeEach(() => {
    mockSessionStorage = {};
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn((key: string) => mockSessionStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockSessionStorage[key];
      }),
      clear: vi.fn(() => {
        mockSessionStorage = {};
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('constructor and prefix behavior', () => {
    it('should use default prefix for feature keys', () => {
      mockSessionStorage['feature.test'] = 'true';
      
      const source = new SessionStorageSource();
      const result = source.getFeatureState('test');
      
      expect(result).toBe(true);
    });

    it('should use custom prefix when provided', () => {
      mockSessionStorage['custom.test'] = 'true';
      
      const source = new SessionStorageSource({ prefix: 'custom.' });
      const result = source.getFeatureState('test');
      
      expect(result).toBe(true);
    });
  });

  describe('getFeatureState', () => {
    it('should return undefined for nonexistent features', () => {
      const source = new SessionStorageSource();
      
      const result = source.getFeatureState('nonexistent');
      
      expect(result).toBeUndefined();
    });

    it('should access sessionStorage with the correct prefixed key', () => {
      const source = new SessionStorageSource();
      
      source.getFeatureState('test');
      
      expect(sessionStorage.getItem).toHaveBeenCalledWith('feature.test');
    });

    it('should return boolean true for "true" string values', () => {
      mockSessionStorage['feature.enabled'] = 'true';
      const source = new SessionStorageSource();
      
      const result = source.getFeatureState('enabled');
      
      expect(result).toBe(true);
    });

    it('should return boolean false for "false" string values', () => {
      mockSessionStorage['feature.disabled'] = 'false';
      const source = new SessionStorageSource();
      
      const result = source.getFeatureState('disabled');
      
      expect(result).toBe(false);
    });

    it('should return semver string for valid semver values', () => {
      mockSessionStorage['feature.version'] = '1.2.3';
      const source = new SessionStorageSource();
      
      const result = source.getFeatureState('version');
      
      expect(result).toBe('1.2.3');
    });
  });
}); 