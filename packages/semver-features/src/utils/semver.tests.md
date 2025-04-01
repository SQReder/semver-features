# SemVer Type Tests

## Overview
This test plan covers type testing for the TypeScript string literal type `SemVer` to ensure it correctly validates semantic versioning strings according to the specification.

## Plan
Testing will focus on validating that the `SemVer` type properly accepts valid semantic version strings and rejects invalid ones. We'll use Vitest's `expectTypeOf` and `assertType` utilities to verify type constraints.

## Test Cases

### Valid SemVer Formats
- Test basic version core format (X.Y.Z)
- Test version with pre-release suffix (X.Y.Z-alpha)
- Test version with build metadata (X.Y.Z+build)
- Test version with both pre-release and build metadata (X.Y.Z-alpha+build)
- Test complex pre-release identifiers (alphanumeric, dots, hyphens)
- Test complex build metadata (alphanumeric, dots, hyphens)

### Invalid SemVer Formats
- Test version with leading zeros (01.0.0)
- Test version with missing components (.1.0, 1..0)
- Test version with invalid pre-release format (1.0.0-+build)
- Test version with empty build metadata (1.0.0+.)
- Test version with invalid characters

### Type Inference
- Test that variables assigned valid SemVer strings are recognized as SemVer type
- Test that function parameters constrained to SemVer accept only valid formats

## Implementation Notes
- Use `expectTypeOf` for positive assertions (valid formats)
- Use `@ts-expect-error` with `assertType` for negative assertions (invalid formats)
- Follow AAA pattern (Arrange-Act-Assert) for each test
- Use meaningful test descriptions with "should" format
- Include only one assertion per test case 