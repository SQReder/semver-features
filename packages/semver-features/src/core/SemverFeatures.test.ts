import { describe, it, expect, vi } from 'vitest';
import { SemverFeatures } from './SemverFeatures';

describe('SemverFeatures', () => {
  describe('dumpFeatures', () => {
    it('should log feature information to console using console.table', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register test features
      features.register('feature1', '0.5.0');  // should be enabled
      features.register('feature2', '2.0.0');  // should be disabled
      features.register('feature3', true);     // explicitly enabled
      features.register('feature4', false);    // explicitly disabled
      
      // Act
      features.dumpFeatures();
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      
      // Cleanup
      consoleSpy.mockRestore();
    });
    
    it('should return array of feature information with correct enabled states', () => {
      // Arrange
      vi.spyOn(console, 'table').mockImplementation(() => {});
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register test features
      features.register('feature1', '0.5.0');  // should be enabled
      features.register('feature2', '2.0.0');  // should be disabled
      features.register('feature3', true);     // explicitly enabled
      features.register('feature4', false);    // explicitly disabled
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result).toEqual([
        { name: 'feature1', enabled: true },
        { name: 'feature2', enabled: false },
        { name: 'feature3', enabled: true },
        { name: 'feature4', enabled: false }
      ]);
      
      // Cleanup
      vi.restoreAllMocks();
    });
    
    it('should return empty array when no features are registered', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Act
      const result = features.dumpFeatures();
      
      // Assert
      expect(result).toEqual([]);
      
      // Cleanup
      consoleSpy.mockRestore();
    });
    
    it('should call console.table with empty array when no features are registered', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Act
      features.dumpFeatures();
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith([]);
      
      // Cleanup
      consoleSpy.mockRestore();
    });
  });
}); 