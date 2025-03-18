# Type-Safe Versioned API Handling

This document explains the recommended approach for implementing version-specific APIs with complete type safety in the SemVer-based feature toggle library.

## Previous Implementation Issues

The original versioned API implementation had several issues:

1. **Type Safety Compromises**: Type casting with `as any` was required in some scenarios
2. **Interface Compatibility Issues**: Method signatures often changed between versions, creating type conflicts
3. **Runtime vs. Static Type Checking**: TypeScript couldn't automatically narrow types based on runtime version checks

## Recommended Implementation Approaches

The improved implementation provides several approaches to handle versioned APIs with complete type safety:

### 1. Conditional Version-Specific Execution

The `withVersionedMethod` utility provides a clean way to execute code only when a specific version is available:

```typescript
// Execute code only in v1.5.0+
await features.withVersionedMethod(
  '1.5.0',
  api,
  async (api) => {
    // This block only runs when version >= 1.5.0
    const result = await api.doSomething();
  },
  () => {
    // This block runs when version < 1.5.0
    console.log('Feature not available');
  }
);
```

### 2. Direct Feature Toggle Approach

The most type-safe approach leverages feature toggles directly:

```typescript
// Register version-specific feature toggles
const v2Feature = features.register('v2Api', '1.2.0');
const v3Feature = features.register('v3Api', '1.5.0');

// Version-dependent functionality
v3Feature.execute({
  enabled: async () => {
    // v3-specific code here
    return await v3Implementation();
  },
  disabled: async () => {
    // fallback implementation
    return await fallbackImplementation();
  }
});
```

## Recommended Practices

Based on our implementation improvements, we recommend these practices:

1. **Use Feature Toggles Directly**: For complex versioned behaviors, use feature toggles with explicit version requirements.

2. **Avoid Type Casting**: Never use `as any` or other unsafe casts - use the provided type-safe utilities instead.

3. **Conditional Execution Blocks**: Use `withVersionedMethod` or `feature.execute()` for version-specific code blocks.

4. **Explicit API Design**: Design APIs with clear version boundaries and compatibility patterns.

## Documentation

See the examples for detailed usage patterns:

- `examples/type-safe-versioned-api.ts` - Comprehensive example of recommended approaches 