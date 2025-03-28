import { describe, expect, it } from 'vitest';
import { parseSourceValue } from './valueParser';

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
      
      expect(result).toBe('1.2.3');
    });

    it('should return undefined for invalid values', () => {
      const input = 'not-a-boolean-or-semver';
      
      const result = parseSourceValue(input);
      
      expect(result).toBeUndefined();
    });
  });
}); 