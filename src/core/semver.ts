/**
 * Utility functions for semantic versioning comparison
 */

/**
 * Parses a semver string into its components
 * @param version The semver string to parse
 * @returns Parsed version with major, minor, patch, and prerelease parts
 */
export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
}

/**
 * Parse a semver string into its components
 */
export function parseSemver(version: string): ParsedVersion {
  // Handle basic semver format: major.minor.patch[-prerelease]
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
  const match = version.match(semverRegex);
  
  if (!match) {
    throw new Error(`Invalid semver format: ${version}`);
  }
  
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || null
  };
}

/**
 * Compare prerelease strings
 * Returns:
 * - negative if a < b
 * - 0 if a === b
 * - positive if a > b
 */
function comparePrerelease(a: string | null, b: string | null): number {
  // No prerelease is greater than any prerelease
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  
  const aParts = a.split('.');
  const bParts = b.split('.');
  
  const minLength = Math.min(aParts.length, bParts.length);
  
  for (let i = 0; i < minLength; i++) {
    const aIsNum = /^\d+$/.test(aParts[i]);
    const bIsNum = /^\d+$/.test(bParts[i]);
    
    // Numeric identifiers always have lower precedence than non-numeric
    if (aIsNum && !bIsNum) return -1;
    if (!aIsNum && bIsNum) return 1;
    
    // If both are numeric, compare as numbers
    if (aIsNum && bIsNum) {
      const diff = parseInt(aParts[i], 10) - parseInt(bParts[i], 10);
      if (diff !== 0) return diff;
      continue;
    }
    
    // If both are strings, compare alphabetically
    const diff = aParts[i].localeCompare(bParts[i]);
    if (diff !== 0) return diff;
  }
  
  // If all parts are equal up to the common length, 
  // the longer one has higher precedence
  return aParts.length - bParts.length;
}

/**
 * Compare two semver versions
 * Returns:
 * - negative if versionA < versionB
 * - 0 if versionA === versionB
 * - positive if versionA > versionB
 */
export function compareSemver(versionA: string, versionB: string): number {
  const a = parseSemver(versionA);
  const b = parseSemver(versionB);
  
  // Compare major.minor.patch as numbers
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  
  // Same version, now check prerelease
  return comparePrerelease(a.prerelease, b.prerelease);
}

/**
 * Check if versionA is greater than or equal to versionB
 */
export function isVersionGteq(versionA: string, versionB: string): boolean {
  return compareSemver(versionA, versionB) >= 0;
} 