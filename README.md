# SemVer-Based Feature Toggle Library

This library provides an elegant solution for automatically enabling features based on semantic versioning. Instead of manually managing feature flags across different releases, it uses the application's version to determine which features should be active.

## Installation

```bash
npm install semver-features
```

## Core Concept

When a team develops features that should be released in specific versions, this library automatically enables those features when the application's version reaches or exceeds the specified threshold. The library requires explicit configuration with the current application version, ensuring clear dependency management and predictable behavior.

## Usage

### Basic Feature Registration

```typescript
import { SemverFeatures } from 'semver-features';

// Initialize the feature manager with explicit version (required)
const features = new SemverFeatures({ 
  version: '1.3.5'  // Explicitly provide current application version
});  

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');          // Enabled in v1.2.0+
const analyticsEngine = features.register('analytics', '1.3.0'); // Enabled in v1.3.0+
const experimentalApi = features.register('expApi', '1.5.0-beta.1'); // Enabled in v1.5.0-beta.1+

// Check if a feature is enabled
console.log(newUI.isEnabled); // true if current version >= 1.2.0
```

### Conditional Logic

```typescript
// Execute different implementations based on feature status
newUI.execute({
  enabled: () => setupNewUI(),
  disabled: () => setupLegacyUI()
});

// With async operations
await experimentalApi.executeAsync({
  enabled: async () => await fetchWithNewApi(),
  disabled: async () => await fetchWithStableApi()
});

// Chain operations
newUI.when(() => {
  setupNewUI();
  
  // Can be nested for feature combinations
  analyticsEngine.when(() => {
    setupUIAnalytics();
  });
});
```

### React Integration

```tsx
import { FeatureToggle } from 'semver-features';
import React from 'react';

function Dashboard() {
  return (
    <>
      {/* Simple component switching */}
      {newUI.render({
        enabled: <NewDashboard />,
        disabled: <LegacyDashboard />
      })}
      
      {/* Conditional rendering */}
      {analyticsEngine.isEnabled && <AnalyticsProvider />}
      
      {/* Using the FeatureToggle component */}
      <FeatureToggle 
        feature={newUI}
        enabled={<NewHeader subtitle="Improved version" />}
        disabled={<OldHeader />}
      />
      
      {/* Value selection and mapping */}
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

### Versioned APIs

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

## Benefits

- **Explicit configuration** - Clear version dependencies with required version specification
- **Type-safe** - No string identifiers at usage points
- **Declarative** - Focus on what features do, not when they're available 
- **Cleaner code** - Eliminates conditionals and reduces boilerplate
- **Versioned APIs** - Seamlessly handle API evolution with backward compatibility
- **Predictable releases** - Clear understanding of when features will activate
- **Gradual migration** - Helps manage transition periods between implementations

## License

MIT
