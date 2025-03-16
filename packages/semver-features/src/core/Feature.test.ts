import { describe, it, expect } from 'vitest';
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
}); 