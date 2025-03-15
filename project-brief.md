# SemVer-Based Feature Toggle Library

## Overview

This library provides an elegant solution for automatically enabling features based on semantic versioning. Instead of manually managing feature flags across different releases, it uses the application version to determine which features should be active. This approach streamlines release management, especially when developing multiple parallel releases.

## Core Concept

When a team develops features that should be released in specific versions, the library automatically enables those features when the application's version reaches or exceeds the specified threshold. The library requires explicit configuration with the current application version, ensuring clear dependency management and predictable behavior. It manages feature availability without requiring explicit conditional statements throughout the codebase.

## API and Behavior Description

### 1. Feature Registration

The library provides a simple API for registering features with their minimum version requirements:

```typescript
// Initialize the feature manager with explicit version (required)
const features = new SemverFeatures({ 
  version: '1.3.5'  // Explicitly provide current application version
});  

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
      
      {/* Legacy component selector (original API) */}
      {newUI.renderComponent({
        enabled: () => <NewHeader subtitle="Improved version" />,
        disabled: () => <OldHeader />
      })}
      
      {/* New pattern with value selection and mapping */}
      {newUI
        .select({
          enabled: { subtitle: "Improved version", showBeta: true },
          disabled: "Legacy Header"
        })
        .map({
          enabled: (config) => <NewHeader {...config} />,
          disabled: (title) => <OldHeader title={title} />
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
- Advanced value transformation with select/map/fold pattern

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

### 6. Value Transformation

The library provides powerful value transformation capabilities through a functional programming inspired API:

```typescript
// Select different values based on feature status
const config = newUI.select({
  enabled: { maxItems: 20, showPreview: true },
  disabled: { maxItems: 10, showPreview: false }
});

// Access current value
console.log(config.value.maxItems);

// Transform values with different output types (bifunctor map)
const element = newUI
  .select({ 
    enabled: userData,
    disabled: "guest-user"
  })
  .map({ 
    enabled: (data) => <UserProfile data={data} />, // Returns React component
    disabled: (id) => <GuestBanner id={id} />      // Returns different component
  });

// Transform values to a common type (monadic fold)
const message = newUI
  .select({
    enabled: { user: currentUser, count: notifications.length },
    disabled: { defaultCount: 0 }
  })
  .fold({
    enabled: (data) => `Welcome ${data.user.name}! You have ${data.count} notifications.`,
    disabled: (legacy) => `Welcome guest! Please sign in to see notifications.`
  });

// Complex data transformation
const processedData = experimentalApi
  .select({
    enabled: rawData.newFormat,
    disabled: rawData.legacyFormat
  })
  .fold({
    enabled: (data) => processEnhancedData(data),
    disabled: (data) => convertAndProcessLegacyFormat(data)
  });
```

Key behaviors:
- **Type-Safe Selection**: `.select()` chooses between enabled/disabled values with appropriate types
- **Bifunctor Mapping**: `.map()` transforms values while preserving the feature toggle structure
- **Monadic Folding**: `.fold()` collapses the toggle structure into a single unified type
- **Value Access**: Direct access to the current value via `.value` property
- **Full Type Safety**: TypeScript ensures correct handling of different types throughout the chain
- **Declarative Style**: Transformations expressed as composable function chains

This functional approach provides several advantages:
- Eliminates conditional expressions and ternaries
- Maintains type safety through transformations
- Ensures all code paths are handled
- Creates predictable, composable patterns
- Supports complex data transformations with minimal boilerplate

These transformation methods are particularly useful when different feature versions work with different data structures or when UI components require different prop shapes based on feature status.

## Feature Behavior

The library automatically determines feature availability with these behaviors:

1. **Version-Based Activation**: Features are enabled when the application version meets or exceeds the minimum version requirement
2. **Permanent Enabling**: Once a feature is enabled for a version, it remains enabled for all future versions
3. **Declarative Definition**: Features are registered once with their version requirements, then used throughout the codebase without repeated checks
4. **Type Safety**: Feature entities maintain type information, eliminating string-based errors
5. **Composability**: Feature checks can be combined and nested for complex logic

## Benefits

- **Explicit configuration** - Clear version dependencies with required version specification
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
- Version must always be explicitly provided, making version dependencies clear
- Can integrate with existing feature flag systems for complex scenarios

## Potential Extensions

- Integration with A/B testing frameworks
- Support for feature deprecation and sunsetting
- Optional runtime overrides for testing and debugging
- Analytics tracking for feature adoption across versions
- Advanced transformation patterns for complex state management
- Integration with state management libraries like Redux or MobX 