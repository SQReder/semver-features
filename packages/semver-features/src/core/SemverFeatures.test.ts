import { describe, it, expect, vi } from 'vitest';
import { SemverFeatures } from './SemverFeatures';

describe('SemverFeatures', () => {
  describe('dumpFeatures', () => {
    it('should correctly dump feature information', () => {
      // Mock console.table
      const consoleSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
      
      const features = new SemverFeatures({ version: '1.0.0' });
      
      // Register some test features
      features.register('feature1', '0.5.0');  // should be enabled
      features.register('feature2', '2.0.0');  // should be disabled
      features.register('feature3', true);     // explicitly enabled
      features.register('feature4', false);    // explicitly disabled
      
      const result = features.dumpFeatures();
      
      // Verify console.table was called
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      
      // Verify returned data
      expect(result).toEqual([
        { name: 'feature1', enabled: true },
        { name: 'feature2', enabled: false },
        { name: 'feature3', enabled: true },
        { name: 'feature4', enabled: false }
      ]);
      
      consoleSpy.mockRestore();
    });
    
    it('should handle empty features list', () => {
      const consoleSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
      
      const features = new SemverFeatures({ version: '1.0.0' });
      const result = features.dumpFeatures();
      
      expect(consoleSpy).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
      
      consoleSpy.mockRestore();
    });
  });
}); 