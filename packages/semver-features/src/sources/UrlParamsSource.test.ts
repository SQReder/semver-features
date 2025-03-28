import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UrlParamsSource } from './UrlParamsSource';
import { parseSourceValue } from './valueParser';

// Mock the valueParser module
vi.mock('./valueParser', () => ({
  parseSourceValue: vi.fn()
}));

describe('UrlParamsSource', () => {
  const mockParseSourceValue = parseSourceValue as unknown as ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
      configurable: true
    });
  });
  
  describe('constructor and prefix behavior', () => {
    it('should use default prefix for URL parameters', () => {
      const mockGet = vi.fn().mockReturnValue('true');
      vi.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
        get: mockGet
      } as any));
      
      const source = new UrlParamsSource();
      source.getFeatureState('test');
      
      expect(mockGet).toHaveBeenCalledWith('feature.test');
    });

    it('should use custom prefix when provided', () => {
      const mockGet = vi.fn().mockReturnValue('true');
      vi.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
        get: mockGet
      } as any));
      
      const source = new UrlParamsSource({ prefix: 'custom.' });
      source.getFeatureState('test');
      
      expect(mockGet).toHaveBeenCalledWith('custom.test');
    });
  });

  describe('getFeatureState', () => {
    it('should construct URLSearchParams with window.location.search', () => {
      window.location.search = '?test=value'; 
      
      const urlSearchParamsSpy = vi.fn().mockReturnValue({
        get: vi.fn().mockReturnValue(null)
      });
      
      const originalURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = urlSearchParamsSpy as any;
      
      try {
        const source = new UrlParamsSource();
        source.getFeatureState('feature');
        
        expect(urlSearchParamsSpy).toHaveBeenCalledWith('?test=value');
      } finally {
        global.URLSearchParams = originalURLSearchParams;
      }
    });
    
    it('should call parseSourceValue with result from URLSearchParams.get', () => {
      const mockGet = vi.fn().mockReturnValue('mockValue');
      vi.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
        get: mockGet
      } as any));
      
      const source = new UrlParamsSource();
      source.getFeatureState('testFeature');
      
      expect(mockParseSourceValue).toHaveBeenCalledWith('mockValue');
    });
    
    it('should return true for parsed boolean true values', () => {
      mockParseSourceValue.mockReturnValue(true);
      vi.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
        get: () => 'anyValue'
      } as any));
      
      const source = new UrlParamsSource();
      
      const result = source.getFeatureState('feature');
      
      expect(result).toBe(true);
    });
    
    it('should return false for parsed boolean false values', () => {
      mockParseSourceValue.mockReturnValue(false);
      vi.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
        get: () => 'anyValue'
      } as any));
      
      const source = new UrlParamsSource();
      
      const result = source.getFeatureState('feature');
      
      expect(result).toBe(false);
    });
    
    it('should return semver string for parsed semver values', () => {
      mockParseSourceValue.mockReturnValue('1.2.3');
      vi.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
        get: () => 'anyValue'
      } as any));
      
      const source = new UrlParamsSource();
      
      const result = source.getFeatureState('feature');
      
      expect(result).toBe('1.2.3');
    });
    
    it('should return undefined for invalid or missing values', () => {
      mockParseSourceValue.mockReturnValue(undefined);
      vi.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
        get: () => 'anyValue'
      } as any));
      
      const source = new UrlParamsSource();
      
      const result = source.getFeatureState('feature');
      
      expect(result).toBeUndefined();
    });
  });
}); 