import { assertType, expectTypeOf } from 'vitest';
import { SemVer } from './semver';

// Helper function for testing SemVer validation
const validateSemVer = (version: SemVer): SemVer => version;

describe('SemVer Type Tests', () => {
  describe('Valid SemVer Formats', () => {
    test('should accept basic version core format (X.Y.Z)', () => {
      expectTypeOf('1.0.0').toMatchTypeOf<SemVer>();
      expectTypeOf('0.1.0').toMatchTypeOf<SemVer>();
      expectTypeOf('0.0.1').toMatchTypeOf<SemVer>();
      expectTypeOf('10.20.30').toMatchTypeOf<SemVer>();
    });

    test('should accept version with pre-release suffix', () => {
      expectTypeOf('1.0.0-alpha').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0-beta.1').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0-0.3.7').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0-x.7.z.92').toMatchTypeOf<SemVer>();
    });

    test('should accept version with build metadata', () => {
      expectTypeOf('1.0.0+build').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0+exp.sha.5114f85').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0+21AF26D3').toMatchTypeOf<SemVer>();
    });

    test('should accept version with both pre-release and build metadata', () => {
      expectTypeOf('1.0.0-alpha+001').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0-beta.2+exp.sha.5114f85').toMatchTypeOf<SemVer>();
    });

    test('should accept complex pre-release identifiers', () => {
      expectTypeOf('1.0.0-alpha-a.b-c-somethinglong').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0-alpha.1.2.3').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0-0alpha.beta').toMatchTypeOf<SemVer>();
    });

    test('should accept complex build metadata', () => {
      expectTypeOf('1.0.0+build.1-aef.1-its-okay').toMatchTypeOf<SemVer>();
      expectTypeOf('1.0.0+a.b.c.d.e').toMatchTypeOf<SemVer>();
    });
  });

  describe('Invalid SemVer Formats', () => {
    test('should reject version with leading zeros', () => {
      // @ts-expect-error Leading zeros not allowed in major version
      assertType<SemVer>('01.0.0');
      
      // @ts-expect-error Leading zeros not allowed in minor version
      assertType<SemVer>('1.01.0');
      
      // @ts-expect-error Leading zeros not allowed in patch version
      assertType<SemVer>('1.0.01');
    });

    test('should reject version with missing components', () => {
      // @ts-expect-error Missing major version
      assertType<SemVer>('.1.0');
      
      // @ts-expect-error Missing minor version
      assertType<SemVer>('1..0');
      
      // @ts-expect-error Missing patch version
      assertType<SemVer>('1.0.');
      
      // @ts-expect-error Incomplete version
      assertType<SemVer>('1.0');
    });

    test('should reject version with invalid pre-release format', () => {
      // @ts-expect-error Pre-release cannot start with a dot
      assertType<SemVer>('1.0.0-.alpha');
      
      // @ts-expect-error Pre-release identifiers cannot be empty
      assertType<SemVer>('1.0.0-alpha..beta');
    });

    test('should reject version with empty build metadata', () => {
      // @ts-expect-error Build metadata cannot be empty
      assertType<SemVer>('1.0.0+');
      
      // @ts-expect-error Build identifiers cannot be empty
      assertType<SemVer>('1.0.0+build..1');
    });

    test('should reject version with invalid characters', () => {
      // @ts-expect-error Invalid characters in version core
      assertType<SemVer>('1.0.a');
      
      // @ts-expect-error Invalid characters in pre-release
      assertType<SemVer>('1.0.0-alpha@beta');
      
      // @ts-expect-error Invalid characters in build metadata
      assertType<SemVer>('1.0.0+build@1');
    });
  });

  describe('Type Inference', () => {
    test('should infer variables with valid SemVer strings as SemVer type', () => {
      const version1 = '1.0.0';
      const version2 = '2.1.0-alpha+build';
      
      expectTypeOf(version1).toMatchTypeOf<SemVer>();
      expectTypeOf(version2).toMatchTypeOf<SemVer>();
    });

    test('should validate function parameters constrained to SemVer', () => {
      // Valid usage
      expectTypeOf(validateSemVer('1.0.0')).toMatchTypeOf<SemVer>();
      expectTypeOf(validateSemVer('1.0.0-beta+exp.sha.5114f85')).toMatchTypeOf<SemVer>();
      
      // Invalid usage with @ts-expect-error
      // @ts-expect-error Invalid SemVer string
      validateSemVer('not.a.version');
      
      // @ts-expect-error Wrong type
      validateSemVer(123);
    });
  });
}); 