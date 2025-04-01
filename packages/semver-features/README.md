# semver-features

A SemVer-Based Feature Toggle Library for automatically enabling features based on semantic versioning.

[![npm version](https://img.shields.io/npm/v/semver-features.svg)](https://www.npmjs.com/package/semver-features)
[![license](https://img.shields.io/npm/l/semver-features.svg)](./LICENSE)

## Overview

`semver-features` provides an elegant solution for automatically enabling features based on semantic versioning. Instead of manually managing feature flags across different releases, it uses the application version to determine which features should be active. This approach streamlines release management, especially when developing multiple parallel releases.

## Installation

```bash
# npm
npm install semver-features

# yarn
yarn add semver-features

# pnpm
pnpm add semver-features
```

## Basic Usage

```typescript
// Initialize the feature manager with explicit version (required)
const features = new SemverFeatures({ 
  version: '1.3.5'  // Explicitly provide current application version
});  

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');          // Enabled in v1.2.0+
const analyticsEngine = features.register('analytics', '1.3.0'); // Enabled in v1.3.0+
const experimentalApi = features.register('expApi', '1.5.0-beta.1'); // Enabled in v1.5.0-beta.1+

// Explicitly enabled or disabled features
const forceEnabledFeature = features.register('forceEnabled', true);  // Explicitly enabled
const forceDisabledFeature = features.register('forceDisabled', false); // Explicitly disabled
const environmentFeature = features.register('envFeature', 
  Boolean(process.env.ENABLE_FEATURE)
); // Based on environment

// Check feature status
console.log('New UI enabled:', newUI.isEnabled);             // true (1.3.5 >= 1.2.0)
console.log('Analytics enabled:', analyticsEngine.isEnabled); // true (1.3.5 >= 1.3.0)
console.log('Experimental API enabled:', experimentalApi.isEnabled); // false (1.3.5 < 1.5.0-beta.1)
console.log('Force enabled feature:', forceEnabledFeature.isEnabled); // true (explicitly enabled)
console.log('Force disabled feature:', forceDisabledFeature.isEnabled); // false (explicitly disabled)
```

## Feature Conditional Execution

Execute different code paths based on feature availability:

```typescript
// Simple conditional execution
experimentalApi.execute({
  enabled: () => console.log('Using experimental API'),
  disabled: () => console.log('Using stable API')
});

// With async operations
await experimentalApi.execute({
  enabled: async () => await fetchWithNewApi(),
  disabled: async () => await fetchWithStableApi()
});

// Chain operations with the "when" method
newUI.when(() => {
  setupNewUI();
  
  // Can be nested for feature combinations
  analyticsEngine.when(() => {
    setupUIAnalytics();
  });
});
```

## Value Transformation

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
const result = newUI
  .select({ 
    enabled: userData,
    disabled: "guest-user"
  })
  .map({ 
    enabled: (data) => processUserData(data),
    disabled: (id) => createGuestProfile(id)
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
```

## External Feature Sources

The library supports various sources for overriding feature states beyond version comparison:

```typescript
import { 
  SemverFeatures, 
  LocalStorageSource, 
  UrlParamsSource,
  SessionStorageSource,
  AsyncSource
} from 'semver-features';

// Initialize with feature sources
const features = new SemverFeatures({
  version: '1.3.5',
  sources: [
    // Allow enabling/disabling features via URL parameters
    // Example: ?features.newUI=true&features.analytics=false
    new UrlParamsSource({ prefix: 'features.' }),
    
    // Store feature states in localStorage
    new LocalStorageSource({ prefix: 'app.features.' }),
    
    // Store feature states in sessionStorage
    new SessionStorageSource({ prefix: 'app.features.' }),
    
    // Asynchronously fetch feature states from a remote source
    new AsyncSource({ 
      fetchStates: async () => {
        const response = await fetch('/api/features');
        return response.json();
      },
      fetchOnInit: true  // Automatically fetch states on initialization (default: true)
    })
  ]
});

// Register features normally - sources will be checked first
const newUI = features.register('newUI', '1.2.0');
const analytics = features.register('analytics', '1.3.0');

// Source precedence is determined by the order in the sources array
// Earlier sources override later ones and version-based determination
```

## Debugging Features

```typescript
// List all registered features and their states
features.dumpFeatures();
// Outputs an array with feature names and their enabled states:
// [{ name: 'newUI', enabled: true }, { name: 'analytics', enabled: true }, ...]
```

## Versioned APIs

Create versioned APIs with backward compatibility:

```typescript
// Create versioned API client using feature toggles
const v2Feature = features.register('v2Api', '1.2.0');
const v3Feature = features.register('v3Api', '1.5.0');

// User service with versioned methods
const userService = {
  // Base functionality - available in all versions
  async getBasicUser(id: string) {
    return { id, name: 'User Name' };
  },
  
  // Get user with version-specific functionality
  async getUser(id: string, options = {}) {
    return v3Feature.execute({
      enabled: async () => {
        // v3 implementation with enhanced options
        return this.getDetailedUserV3(id, options);
      },
      disabled: async () => {
        // Try v2 API if available
        return v2Feature.execute({
          enabled: async () => {
            // v2 implementation
            return this.getDetailedUserV2(id);
          },
          disabled: async () => {
            // Fallback to basic user
            return this.getBasicUser(id);
          }
        });
      }
    });
  },
  
  // Implementation details...
  async getDetailedUserV3(id, options) { /* ... */ },
  async getDetailedUserV2(id) { /* ... */ }
};

// Usage is consistent regardless of which version is active
const user = await userService.getUser('user123', { detailed: true });
```

## Explicit Feature Toggling

In addition to version-based feature toggling, you can explicitly enable or disable features by passing boolean values:

```typescript
// Boolean values
const alwaysOnFeature = features.register('alwaysOn', true);  // Explicitly enabled
const alwaysOffFeature = features.register('alwaysOff', false);  // Explicitly disabled

// Environment variables (converts to boolean)
const envControlledFeature = features.register('envFeature', 
  process.env.ENABLE_MY_FEATURE === 'true' // Ensure conversion to boolean
);
```

The library enforces type safety by only accepting:
- Valid SemVer strings (e.g., '1.0.0', '2.1.3-beta.1')
- Boolean values (true or false)

This prevents ambiguity and ensures that feature toggling behaves predictably across your application.

```typescript
// ✅ Valid feature registrations
features.register('feature1', '1.0.0');  // SemVer string
features.register('feature2', '2.1.3-beta.1');  // SemVer with suffix
features.register('feature3', true);  // Boolean

// ❌ Invalid (would cause TypeScript errors)
features.register('feature4', 1);  // Not allowed
features.register('feature5', 'true');  // Not allowed
features.register('feature6', 'false');  // Not allowed
features.register('feature7', 'enabled');  // Not allowed
```

This functionality is particularly useful for:

- **Overriding version-based behavior** - Force features on/off regardless of version
- **Environment-specific features** - Control features through environment variables
- **Debug/development features** - Enable features only in specific environments
- **A/B testing** - Control feature availability for specific users or contexts

## Benefits

- **Explicit configuration** - Clear version dependencies with required version specification
- **Type-safe** - No string identifiers at usage points
- **Declarative** - Focus on what features do, not when they're available
- **Cleaner code** - Eliminates conditionals and reduces boilerplate
- **Versioned APIs** - Seamlessly handle API evolution with backward compatibility
- **Predictable releases** - Clear understanding of when features will activate
- **Gradual migration** - Helps manage transition periods between implementations
- **External control** - Toggle features via URL parameters, localStorage, or external APIs

## React Integration

For React applications, check out the [semver-features-react](https://www.npmjs.com/package/semver-features-react) package, which provides specialized React components and hooks for working with this library.

## License

MIT 