import { describe, expect, it } from 'vitest';
import { parseSourceValue } from './valueParser';
import { asRange } from '../utils/asRange';

describe('valueParser', () => {
  describe('parseSourceValue', () => {
    it('should return undefined for null input', () => {
      const input = null;
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      const input = undefined;
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });

    it('should parse "true" as boolean true', () => {
      const input = 'true';
      
      const result = parseSourceValue(input);
      
      expect(result).toBe(true);
    });

    it('should parse "false" as boolean false', () => {
      const input = 'false';
      
      const result = parseSourceValue(input);
      
      expect(result).toBe(false);
    });

    it('should parse valid semver as semver string', () => {
      const input = '1.2.3';
      
      const result = parseSourceValue(input);
      
      expect(result).toEqual(asRange('1.2.3'));
    });

    it('should return undefined for invalid values', () => {
      const input = 'not-a-boolean-or-semver';
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const input = '';
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for whitespace string', () => {
      const input = '   ';
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for numeric values', () => {
      const input = '123';
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });

    it('should return undefined for invalid semver strings', () => {
      const input = '1.2.3.4';
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });
  });
}); 