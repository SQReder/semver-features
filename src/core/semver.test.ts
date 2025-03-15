/**
 * Tests for the semver utility functions
 */
import { parseSemver, compareSemver, isVersionGteq } from './semver';

describe('parseSemver', () => {
  it('parses a simple version', () => {
    const result = parseSemver('1.2.3');
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: null
    });
  });

  it('parses a version with prerelease', () => {
    const result = parseSemver('1.2.3-beta.1');
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'beta.1'
    });
  });

  it('throws an error for invalid versions', () => {
    expect(() => parseSemver('not.a.version')).toThrow();
    expect(() => parseSemver('1.2')).toThrow();
    expect(() => parseSemver('1.2.3.4')).toThrow();
  });
});

describe('compareSemver', () => {
  it('compares major versions correctly', () => {
    expect(compareSemver('2.0.0', '1.0.0')).toBeGreaterThan(0);
    expect(compareSemver('1.0.0', '2.0.0')).toBeLessThan(0);
  });

  it('compares minor versions correctly', () => {
    expect(compareSemver('1.2.0', '1.1.0')).toBeGreaterThan(0);
    expect(compareSemver('1.1.0', '1.2.0')).toBeLessThan(0);
  });

  it('compares patch versions correctly', () => {
    expect(compareSemver('1.0.2', '1.0.1')).toBeGreaterThan(0);
    expect(compareSemver('1.0.1', '1.0.2')).toBeLessThan(0);
  });

  it('treats release versions higher than prereleases', () => {
    expect(compareSemver('1.0.0', '1.0.0-beta')).toBeGreaterThan(0);
    expect(compareSemver('1.0.0-beta', '1.0.0')).toBeLessThan(0);
  });

  it('compares prereleases correctly', () => {
    expect(compareSemver('1.0.0-beta.2', '1.0.0-beta.1')).toBeGreaterThan(0);
    expect(compareSemver('1.0.0-alpha', '1.0.0-beta')).toBeLessThan(0);
  });

  it('treats numeric identifiers lower than non-numeric identifiers', () => {
    expect(compareSemver('1.0.0-alpha.1', '1.0.0-alpha.beta')).toBeLessThan(0);
    expect(compareSemver('1.0.0-alpha.beta', '1.0.0-alpha.1')).toBeGreaterThan(0);
  });

  it('considers identical versions equal', () => {
    expect(compareSemver('1.2.3', '1.2.3')).toBe(0);
    expect(compareSemver('1.2.3-beta.1', '1.2.3-beta.1')).toBe(0);
  });
});

describe('isVersionGteq', () => {
  it('returns true when first version is greater', () => {
    expect(isVersionGteq('2.0.0', '1.0.0')).toBe(true);
    expect(isVersionGteq('1.2.0', '1.1.0')).toBe(true);
    expect(isVersionGteq('1.0.2', '1.0.1')).toBe(true);
  });

  it('returns true when versions are equal', () => {
    expect(isVersionGteq('1.2.3', '1.2.3')).toBe(true);
    expect(isVersionGteq('1.2.3-beta.1', '1.2.3-beta.1')).toBe(true);
  });

  it('returns false when first version is lower', () => {
    expect(isVersionGteq('1.0.0', '2.0.0')).toBe(false);
    expect(isVersionGteq('1.1.0', '1.2.0')).toBe(false);
    expect(isVersionGteq('1.0.1', '1.0.2')).toBe(false);
    expect(isVersionGteq('1.0.0-beta', '1.0.0')).toBe(false);
  });
}); 