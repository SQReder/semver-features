# Type-Safe Versioned API Handling

This document explains the recommended approach for implementing version-specific APIs with complete type safety in the SemVer-based feature toggle library.

## Previous Implementation Issues

The original versioned API implementation had several issues:

1. **Type Safety Compromises**: Type casting with `as any` was required in some scenarios
2. **Interface Compatibility Issues**: Method signatures often changed between versions, creating type conflicts
3. **Runtime vs. Static Type Checking**: TypeScript couldn't automatically narrow types based on runtime version checks

## Recommended Implementation Approach

The improved implementation provides several approaches to handle versioned APIs with complete type safety:

### 1. Feature-Specific Method Wrappers

The `Feature.createMethod` utility creates methods that are tied directly to a specific feature toggle:

```typescript
// Register feature toggle for v3 API
const v3Api = features.register('v3Api', '1.5.0');

// Create a method only available when v3Api is enabled
getUserRoles = v3Api.createMethod<[string], string[]>(
  (id: string): string[] => {
    // Implementation
    return ['admin'];
  }
);

// Usage with runtime null check
const roles = await userApi.getUserRoles('user123');
if (roles !== null) {
  // TypeScript knows roles is string[] here
  console.log('Roles:', roles);
} else {
  console.log('Roles not available in this version');
}
```

This approach has several advantages:
- It's more conceptually aligned - methods are tied directly to feature toggles
- It provides better encapsulation of version-specific behaviors
- It's more discoverable as part of the Feature API

### 2. Conditional Version-Specific Execution

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

### 3. Direct Feature Toggle Approach

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

3. **Feature-Based Method Wrappers**: Use `feature.createMethod()` to implement methods that are only available when a specific feature is enabled.

4. **Conditional Execution Blocks**: Use `withVersionedMethod` or `feature.execute()` for version-specific code blocks.

5. **Explicit API Design**: Design APIs with clear version boundaries and compatibility patterns.

## Documentation

See the examples for detailed usage patterns:

- `examples/type-safe-versioned-api.ts` - Comprehensive example of recommended approaches 