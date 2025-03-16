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
newUI.execute({
  enabled: () => console.log('Using new UI'),
  disabled: () => console.log('Using legacy UI')
});

// With async operations
await experimentalApi.executeAsync({
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

## Versioned APIs

Create versioned APIs with backward compatibility:

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
        return await response.json();
      }
    },
    v1: {
      minVersion: '0.0.0', // Always available as fallback
      getUser: async (id) => {
        // Legacy implementation
        const response = await fetch(`/api/v1/user?id=${id}`);
        return await response.json();
      }
    }
  }
});

// Usage is consistent regardless of which version is active
const user = await userApi.getUser(userId, { detailed: true });
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

## React Integration

For React applications, check out the [semver-features-react](https://www.npmjs.com/package/semver-features-react) package, which provides specialized React components and hooks for working with this library.

## License

MIT 