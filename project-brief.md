# SemVer-Based Feature Toggle Library

## Overview

This library provides an elegant solution for automatically enabling features based on semantic versioning. Instead of manually managing feature flags across different releases, it uses the version specified in your package.json to determine which features should be active. This approach streamlines release management, especially when developing multiple parallel releases.

## Core Concept

When a team develops features that should be released in specific versions, the library automatically enables those features when the application's version reaches or exceeds the specified threshold. The library reads the current version from package.json and manages feature availability without requiring explicit conditional statements throughout the codebase.

## API and Behavior Description

### 1. Feature Registration

The library provides a simple API for registering features with their minimum version requirements:

```typescript
// Initialize the feature manager
const features = new SemverFeatures();  // Automatically reads from package.json

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');          // Enabled in v1.2.0+
const analyticsEngine = features.register('analytics', '1.3.0'); // Enabled in v1.3.0+
const experimentalApi = features.register('expApi', '1.5.0-beta.1'); // Enabled in v1.5.0-beta.1+
```

The registration process:
- Takes a feature name and minimum semver version
- Checks the current application version against the minimum version
- Returns a feature entity object that knows whether it should be enabled
- Each feature entity encapsulates all behavior related to that feature

### 2. Feature Entities

Each registered feature returns an entity with methods for different use cases:

- **Status checking**: `feature.isEnabled` property for simple checks
- **Component rendering**: Methods to render different components based on status
- **Function execution**: Methods to execute different code paths
- **Async operations**: Support for promise-based functions with different implementations

Feature entities are designed to be self-contained, making code more readable and maintainable while removing the need for explicit conditionals.

### 3. React Integration

The library seamlessly integrates with React components:

```typescript
function Dashboard() {
  return (
    <>
      {/* Simple component switching */}
      {newUI.render(<NewDashboard />, <LegacyDashboard />)}
      
      {/* Conditional rendering */}
      {analyticsEngine.isEnabled && <AnalyticsProvider />}
      
      {/* Component with props selector */}
      {newUI.select({
        enabled: () => <NewHeader subtitle="Improved version" />,
        disabled: () => <OldHeader />
      })}
    </>
  );
}
```

Key behaviors:
- Components can be toggled directly in JSX
- Both simple and complex component switching is supported
- No explicit conditional statements required in components
- Works with both function and class components

### 4. Conditional Logic

The library replaces traditional if-statements with a more declarative approach:

```typescript
// Execute different implementations based on feature status
newUI.execute(
  () => setupNewUI(),
  () => setupLegacyUI()
);

// With async operations
await experimentalApi.executeAsync(
  async () => await fetchWithNewApi(),
  async () => await fetchWithStableApi()
);

// Chain operations
newUI.when(() => {
  setupNewUI();
  
  // Can be nested for feature combinations
  analyticsEngine.when(() => {
    setupUIAnalytics();
  });
});
```

Key behaviors:
- Code paths are expressed as functions passed to method calls
- Appropriate function is automatically selected based on version
- Async operations are fully supported with proper typing
- Feature checks can be chained and combined
- Nesting is supported for complex feature interactions

### 5. API Version Management

The library provides automatic API versioning capabilities:

```typescript
// Create versioned API client
const userApi = features.createVersionedApi('userApi', {
  versions: {
    v3: {
      minVersion: '1.5.0',
      getUser: async (id, options = {}) => {
        // V3 implementation with enhanced options
        const response = await fetch(`/api/v3/users/${id}?detailed=${options.detailed}`);
        return response.json();
      }
    },
    v2: {
      minVersion: '1.2.0',
      getUser: async (id, options = {}) => {
        // V2 implementation
        const response = await fetch(`/api/v2/users/${id}`);
        const data = await response.json();
        // Adapt to match v3 format if needed
        return options.detailed 
          ? enrichWithDetails(data) 
          : data;
      }
    },
    v1: {
      minVersion: '0.0.0', // Always available as fallback
      getUser: async (id) => {
        // Legacy implementation
        const response = await fetch(`/api/v1/user?id=${id}`);
        return transformLegacyResponse(await response.json());
      }
    }
  }
});

// Usage is consistent regardless of which version is active
const user = await userApi.getUser(userId, { detailed: true });
```

Key behaviors:
- Multiple API versions can be defined with different implementations
- The highest compatible version is automatically selected based on current app version
- API consumer code remains unchanged as versions evolve
- Method signatures can evolve while maintaining backward compatibility
- Fallback versions ensure graceful degradation

## Feature Behavior

The library automatically determines feature availability with these behaviors:

1. **Version-Based Activation**: Features are enabled when the application version meets or exceeds the minimum version requirement
2. **Permanent Enabling**: Once a feature is enabled for a version, it remains enabled for all future versions
3. **Declarative Definition**: Features are registered once with their version requirements, then used throughout the codebase without repeated checks
4. **Type Safety**: Feature entities maintain type information, eliminating string-based errors
5. **Composability**: Feature checks can be combined and nested for complex logic

## Benefits

- **Zero configuration** - Automatically uses package.json version
- **Type-safe** - No string identifiers at usage points
- **Declarative** - Focus on what features do, not when they're available
- **Cleaner code** - Eliminates conditionals and reduces boilerplate
- **Versioned APIs** - Seamlessly handle API evolution with backward compatibility
- **Predictable releases** - Clear understanding of when features will activate
- **Gradual migration** - Helps manage transition periods between implementations

## Usage Considerations

- Features are enabled based solely on version numbers, not on user roles or other runtime factors
- Once a feature is enabled for a specific version, it remains enabled for all higher versions
- Works best in combination with proper semantic versioning practices
- Can integrate with existing feature flag systems for complex scenarios

## Potential Extensions

- Integration with A/B testing frameworks
- Support for feature deprecation and sunsetting
- Optional runtime overrides for testing and debugging
- Analytics tracking for feature adoption across versions 