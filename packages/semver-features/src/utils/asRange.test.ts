import { describe, it, expect } from 'vitest';
import { asRange } from './asRange';
import { Range } from 'semver';

describe('asRange', () => {
  /**
   * Valid Semver Input
   */
  it('should convert valid semver to a range with >= prefix', () => {
    // Arrange
    const version = '1.0.0';
    
    // Act
    const result = asRange(version);
    
    // Assert
    expect(result).toBeInstanceOf(Range);
    expect(result.format()).toBe('>=1.0.0');
  });

  /**
   * Valid Range Input
   */
  it('should preserve valid range expressions', () => {
    // Arrange
    const rangeExpr = '^1.0.0';
    
    // Act
    const result = asRange(rangeExpr);
    
    // Assert
    expect(result).toBeInstanceOf(Range);
    expect(result.format()).toBe('>=1.0.0 <2.0.0-0');
  });

  /**
   * Complex Range Input
   */
  it('should handle complex range expressions', () => {
    // Arrange
    const complexRange = '>=1.0.0 <2.0.0 || >=3.0.0';
    
    // Act
    const result = asRange(complexRange);
    
    // Assert
    expect(result).toBeInstanceOf(Range);
    expect(result.format()).toBe('>=1.0.0 <2.0.0||>=3.0.0');
  });

  /**
   * Invalid Input
   */
  it('should throw an error for invalid version or range', () => {
    // Arrange
    const invalidInput = 'not-a-version';
    
    // Act & Assert
    expect(() => asRange(invalidInput)).toThrow('Invalid range: not-a-version');
  });
}); 