// SemVer TypeScript String Literal Type
// Based on Semantic Versioning 2.0.0 specification

// Basic Components
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type PositiveDigit = Exclude<Digit, '0'>;
type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
            | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
            | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'a' | 'b' | 'c' | 'd'
            | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n'
            | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x'
            | 'y' | 'z';
type NonDigit = Letter | '-';

// Numeric Identifiers (0 | 1-9 digits)
type NumericIdentifier = '0' | `${PositiveDigit}` | `${PositiveDigit}${string & Record<number, Digit>}`;

// Major, Minor, Patch are all numeric identifiers
type Major = NumericIdentifier;
type Minor = NumericIdentifier;
type Patch = NumericIdentifier;

// Version Core (major.minor.patch)
type VersionCore = `${Major}.${Minor}.${Patch}`;

// Identifier Character (digit | non-digit)
type IdentifierChar = Digit | NonDigit;

// Alphanumeric Identifier
type AlphanumericIdentifier = `${NonDigit}${string & Record<number, IdentifierChar>}` 
                            | `${string & Record<number, IdentifierChar>}${NonDigit}` 
                            | `${string & Record<number, IdentifierChar>}${NonDigit}${string & Record<number, IdentifierChar>}` 
                            | NonDigit;

// Pre-release and Build Identifiers
type PreReleaseIdentifier = AlphanumericIdentifier | NumericIdentifier;
type BuildIdentifier = AlphanumericIdentifier | `${string & Record<number, Digit>}`;

// Recursive dot-separated identifiers
// Due to TypeScript limitations for recursive types, we'll support a reasonable finite depth
type DotSeparatedPreReleaseIds = PreReleaseIdentifier 
                                | `${PreReleaseIdentifier}.${PreReleaseIdentifier}` 
                                | `${PreReleaseIdentifier}.${PreReleaseIdentifier}.${PreReleaseIdentifier}`
                                | `${PreReleaseIdentifier}.${PreReleaseIdentifier}.${PreReleaseIdentifier}.${PreReleaseIdentifier}`
                                | `${PreReleaseIdentifier}.${PreReleaseIdentifier}.${PreReleaseIdentifier}.${PreReleaseIdentifier}.${PreReleaseIdentifier}`;

type DotSeparatedBuildIds = BuildIdentifier 
                          | `${BuildIdentifier}.${BuildIdentifier}` 
                          | `${BuildIdentifier}.${BuildIdentifier}.${BuildIdentifier}`
                          | `${BuildIdentifier}.${BuildIdentifier}.${BuildIdentifier}.${BuildIdentifier}`
                          | `${BuildIdentifier}.${BuildIdentifier}.${BuildIdentifier}.${BuildIdentifier}.${BuildIdentifier}`;

// Pre-release and Build
type PreRelease = DotSeparatedPreReleaseIds;
type Build = DotSeparatedBuildIds;

// Full SemVer
type SemVer = VersionCore
            | `${VersionCore}-${PreRelease}`
            | `${VersionCore}+${Build}`
            | `${VersionCore}-${PreRelease}+${Build}`;

// Export the type
export type { SemVer };

// Usage examples:
const validVersions: SemVer[] = [
  '1.0.0',
  '2.3.4',
  '1.0.0-alpha',
  '1.0.0-alpha.1',
  '1.0.0+build.1',
  '1.0.0-beta+exp.sha.5114f85',
  '0.1.0',
  '0.0.1-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay'
];

// This would cause a type error if uncommented:
// const invalidVersions: SemVer[] = [
//   '01.0.0',    // Leading zeros not allowed in major/minor/patch
//   '1.01.0',    // Leading zeros not allowed in major/minor/patch
//   '.1.0',      // Missing major version
//   '1..0',      // Empty minor version
//   '1.0.-beta', // Prerelease cannot start with dash
//   '1.0.0+.'    // Empty build metadata
// ]; 