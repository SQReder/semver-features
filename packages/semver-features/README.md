# semver-features

A SemVer-Based Feature Toggle Library for automatically enabling features based on semantic versioning.

[![npm version](https://img.shields.io/npm/v/semver-features.svg)](https://www.npmjs.com/package/semver-features)
[![license](https://img.shields.io/npm/l/semver-features.svg)](./LICENSE)

## Table of Contents
- [Overview](#overview)
- [When to Use](#when-to-use)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Basic Setup](#basic-setup)
  - [Explicit Feature Control](#explicit-feature-control)
- [Integrations](#integrations)
  - [React Integration](#react-integration)
  - [JSON Configuration](#json-configuration)
- [Core Feature API](#core-feature-api)
  - [Feature Checks](#feature-checks)
  - [Conditional Code Execution](#conditional-code-execution)
  - [Type-Safe Value Selection](#type-safe-value-selection)
  - [Type Narrowing Based on Feature State](#type-narrowing-based-on-feature-state)
- [Advanced Features](#advanced-features)
  - [Value Transformation](#value-transformation)
  - [External Feature Sources](#external-feature-sources)
  - [Versioned APIs](#versioned-apis)
  - [Debugging Features](#debugging-features)
- [Real-World Example](#real-world-example)
- [Technical Details](#technical-details)
  - [Feature Value Implementation](#feature-value-implementation)
  - [Optional Disabled State](#optional-disabled-state)
  - [Optional Transforms](#optional-transforms)
  - [Type Safety Enforcement](#type-safety-enforcement)
- [Benefits](#benefits)
- [License](#license)

## Overview

`semver-features` provides an elegant solution for automatically enabling features based on semantic versioning. Instead of manually managing feature flags across different releases, it uses the application version to determine which features should be active. 

**Key advantages:**
- No backend infrastructure required - Works entirely on the client-side
- Zero-configuration feature activation based on version numbers
- Automatic feature enablement when deploying new versions
- Clean API for versioned feature implementation
- Simplified release management for parallel development streams

This approach streamlines release management, especially when developing multiple parallel releases.

## When to Use

`semver-features` is ideal for:

- **Backend-free deployments** - When you can't implement or afford external backend-based feature flag systems like LaunchDarkly, Split.io, or Optimizely. But [Batteries included](#external-feature-sources)
- **Progressive rollouts** - When you want features to automatically activate in newer versions
- **API versioning** - Creating backward-compatible APIs that evolve over time
- **Multiple release branches** - When you're developing features that should only be active in specific versions
- **Migration periods** - Supporting multiple implementations during transition periods
- **Simple client-only apps** - For applications where server-side feature flag management would be overkill
- **Feature deprecation** - Managing the lifecycle of features from experimental to stable to deprecated
- **Local development** - Simulating different production versions during development without changing environment variables

## Installation

```bash
# npm
npm install semver-features

# yarn
yarn add semver-features

# pnpm
pnpm add semver-features
```

## Getting Started

### Basic Setup

```typescript
// Initialize the feature manager with explicit version (required)
const features = new SemverFeatures({ 
  version: '1.3.5'  // Explicitly provide current application version
});  

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');          // Enabled in v1.2.0+
const analyticsEngine = features.register('analytics', '1.3.0'); // Enabled in v1.3.0+
const experimentalApi = features.register('expApi', '1.5.0-beta.1'); // Enabled in v1.5.0-beta.1+

// Check feature status
console.log('New UI enabled:', newUI.isEnabled);             // true (1.3.5 >= 1.2.0)
console.log('Analytics enabled:', analyticsEngine.isEnabled); // true (1.3.5 >= 1.3.0)
console.log('Experimental API enabled:', experimentalApi.isEnabled); // false (1.3.5 < 1.5.0-beta.1)
```

### Explicit Feature Control

You can explicitly enable or disable features regardless of version:

```typescript
// Explicitly enabled or disabled features
const forceEnabledFeature = features.register('forceEnabled', true);  // Always enabled
const forceDisabledFeature = features.register('forceDisabled', false); // Always disabled

// Environment-based features
const environmentFeature = features.register('envFeature', 
  Boolean(process.env.ENABLE_FEATURE)
); // Based on environment variable
```

## Integrations

### React Integration

For React applications, check out the [semver-features-react](https://www.npmjs.com/package/semver-features-react) package, which provides specialized React components and hooks for working with this library.

```tsx
// Example React usage with semver-features-react
import { SemverFeatures } from 'semver-features';
import { FeatureToggle, FeatureEnabled, FeatureDisabled } from 'semver-features-react';

// Initialize the feature manager with current app version
const features = new SemverFeatures({ version: '1.3.5' });

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');
const analyticsEngine = features.register('analytics', '1.3.0');

// Using FeatureToggle component for declarative toggling
function Dashboard() {
  return (
    <FeatureToggle 
      feature={newUI}
      enabled={<NewDashboard />}
      disabled={<LegacyDashboard />}
    />
  );
}

// Render content only when a feature is enabled
function App() {
  return (
    <div>
      <FeatureEnabled feature={analyticsEngine}>
        <AnalyticsProvider />
      </FeatureEnabled>
    </div>
  );
}
```

### JSON Configuration

For applications using JSON-based configuration, check out the [semver-features-json](https://www.npmjs.com/package/semver-features-json) package, which provides utilities for defining and loading feature toggles from JSON files.

## Core Feature API

### Feature Checks

The simplest way to use a feature is to check its enabled state:

```typescript
if (newUI.isEnabled) {
  renderNewUI();
} else {
  renderLegacyUI();
}
```

### Conditional Code Execution

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

### Type-Safe Value Selection

The library provides powerful value transformation capabilities:

```typescript
// Select different values based on feature status
const config = newUI.select({
  enabled: { maxItems: 20, showPreview: true },
  disabled: { maxItems: 10, showPreview: false }
});

// Access current value
console.log(config.value.maxItems);
```

### Type Narrowing Based on Feature State

TypeScript automatically narrows types based on the feature state:

```typescript
// Basic usage with consistent data shapes
const featureValue = newUI.select({
  enabled: { maxItems: 20, showPreview: true },
  disabled: { maxItems: 10, showPreview: false }
});

if (featureValue.isEnabled) {
  // TypeScript knows featureValue.value is the "enabled" type here
  console.log('Preview enabled:', featureValue.value.showPreview);  // true
} else {
  // TypeScript knows featureValue.value is the "disabled" type here
  console.log('Preview enabled:', featureValue.value.showPreview);  // false
}

// Advanced usage with different data shapes
const userInterface = newUI
  .select({
    enabled: { user: currentUser, theme: 'modern' },
    disabled: { theme: 'classic' }
  });

if (userInterface.isEnabled) {
  // TypeScript knows we have the full user object here
  setupModernInterface(userInterface.value.user, userInterface.value.theme);
} else {
  // TypeScript knows we only have theme here
  setupClassicInterface(userInterface.value.theme);
}
```

## Advanced Features

### Value Transformation

Transform feature-dependent values with a functional programming inspired API:

```typescript
// Transform values with different output types
const result = newUI
  .select({ 
    enabled: userData,
    disabled: "guest-user"
  })
  .map({ 
    enabled: (data) => processUserData(data),
    disabled: (id) => createGuestProfile(id)
  });

// Transform values to a common type
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

### External Feature Sources

Override feature states from external sources:

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
      fetchOnInit: true  // Automatically fetch states on initialization
    })
  ]
});

// Register features normally - sources will be checked first
const newUI = features.register('newUI', '1.2.0');
const analytics = features.register('analytics', '1.3.0');
```

### Versioned APIs

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

### Debugging Features

List all registered features and their states:

```typescript
// List all registered features and their states
features.dumpFeatures();
// Outputs an array with feature names and their enabled states:
// [{ name: 'newUI', enabled: true }, { name: 'analytics', enabled: true }, ...]
```

## Real-World Example

Here's a complete example showing how semver-features can help manage a product going through version upgrades:

```typescript
// --- App initialization ---
import { SemverFeatures } from 'semver-features';

// Initialize with current app version (could come from package.json)
const appVersion = '2.3.0';
const features = new SemverFeatures({ version: appVersion });

// --- Feature registration ---
// Legacy features (already active)
const basicUI = features.register('basicUI', '1.0.0');        // Initial release
const userProfiles = features.register('profiles', '1.2.0');  // Added in v1.2

// Current features
const darkMode = features.register('darkMode', '2.0.0');      // Added in v2.0
const analytics = features.register('analytics', '2.1.0');    // Added in v2.1
const enhancedSearch = features.register('search', '2.3.0');  // Just added in v2.3

// Upcoming features (not yet active)
const aiSuggestions = features.register('ai', '2.4.0');       // Coming in v2.4
const newCheckout = features.register('checkout', '3.0.0');   // Major update in v3.0

// --- Feature usage in application ---
function initializeApp() {
  // Core app setup
  setupBasicApp();
  
  // Features enabled based on version
  darkMode.when(() => {
    console.log('Setting up dark mode support');
    setupThemeSystem();
    addDarkModeToggle();
  });
  
  analytics.when(() => {
    console.log('Initializing analytics');
    initAnalytics();
  });
  
  enhancedSearch.when(() => {
    console.log('Using enhanced search');
    setupAdvancedSearch();
  });
  
  // Features that will be skipped in current version
  aiSuggestions.when(() => {
    console.log('Setting up AI suggestions');
    initAiEngine();
  });
  
  newCheckout.when(() => {
    console.log('Using new checkout flow');
    setupNewCheckout();
  });
}

// --- Feature Decision Flow ---
function renderUserProfile(userId) {
  // Base functionality always works
  const profile = loadUserProfile(userId);
  
  return enhancedSearch
    .select({
      // Enhanced search in v2.3+
      enabled: {
        profile,
        searchIndex: buildUserSearchIndex(profile),
        showExtraFields: true
      },
      // Basic display in earlier versions
      disabled: {
        profile,
        showExtraFields: false
      }
    })
    .fold({
      enabled: (data) => renderEnhancedProfile(data),
      disabled: (data) => renderBasicProfile(data)
    });
}

// --- Helper functions referenced above ---
function setupBasicApp() { /* ... */ }
function setupThemeSystem() { /* ... */ }
function addDarkModeToggle() { /* ... */ }
function initAnalytics() { /* ... */ }
function setupAdvancedSearch() { /* ... */ }
function initAiEngine() { /* ... */ }
function setupNewCheckout() { /* ... */ }
function loadUserProfile(id) { return { id, name: 'Test User' }; }
function buildUserSearchIndex(profile) { return { /* ... */ }; }
function renderEnhancedProfile(data) { return `Enhanced profile for ${data.profile.name}`; }
function renderBasicProfile(data) { return `Basic profile for ${data.profile.name}`; }

// --- Initialize app ---
initializeApp();
```

**Feature Decision Flow Diagram:**

```
                      ┌───────────────┐
                      │ App Version   │
                      │    2.3.0      │
                      └───────┬───────┘
                              │
              ┌───────────────┴──────────────┐
              │                              │
     ┌────────▼─────────┐         ┌─────────▼────────┐
     │  Feature Check   │         │  Feature Check   │
     │   darkMode       │         │   aiSuggestions  │
     │   (>= 2.0.0)     │         │   (>= 2.4.0)     │
     └────────┬─────────┘         └─────────┬────────┘
              │                              │
      ┌───────▼─────────┐          ┌────────▼────────┐
      │    ENABLED      │          │    DISABLED     │
      └───────┬─────────┘          └─────────────────┘
              │                    (Skip AI features)
   ┌──────────▼───────────┐
   │  Execute darkMode    │
   │  feature code path   │
   └──────────────────────┘
```

## Technical Details

### Feature Value Implementation

The library uses a type-safe approach with an abstract `FeatureValue` base class and two concrete implementations:

- `EnabledFeatureValue<E, D>` - Used when the feature is enabled, with `.value` typed as `E`
- `DisabledFeatureValue<E, D>` - Used when the feature is disabled, with `.value` typed as `D`

This allows for precise type narrowing through the type guard functions, ensuring type safety throughout your application.

### Optional Disabled State

The `select` method intentionally requires the `enabled` value while making the `disabled` value optional:

```typescript
// REQUIRED: enabled - defines what happens when the feature is ON
// OPTIONAL: disabled - defines what happens when the feature is OFF (if needed)
const result = feature.select({
  enabled: "New feature is active"
  // No disabled value = do nothing when feature is off
});
```

This asymmetric design directly reflects the fundamental purpose of feature flags:

1. **Why enabled is required:**
   - It defines the new functionality being introduced
   - Without it, the feature flag has no purpose
   - It's what users will experience when the feature is active

2. **Why disabled can be optional:**
   - Many features simply add new functionality rather than replacing existing behavior
   - The fallback behavior is often "do nothing" which requires no explicit definition
   - It enables cleaner, less verbose code when no special fallback is needed

**Behavior when disabled value is omitted:**
- TypeScript treats the disabled value type as `never` for type safety
- At runtime, accessing `result.value` when the feature is off returns `undefined`
- The type system prevents accidentally using the value when the feature is disabled

```typescript
// Example usage with omitted disabled value
if (feature.isEnabled) {
  // Safe to use result.value
  console.log(result.value); // "New feature is active"
} else {
  // TypeScript warns about accessing result.value here
  // At runtime, result.value would be undefined
}
```

### Optional Transforms

For `map` operations, you can omit either the `enabled` or `disabled` transform function (but at least one must be provided), which will use an identity function instead:

```typescript
// Only specify the enabled transform when disabled transform isn't needed
const result = feature.select({
  enabled: { count: 5 },
  disabled: "original"
}).map({
  enabled: data => ({ ...data, count: data.count * 2 })
  // Disabled transform is optional - will default to identity function
});

// Only specify the disabled transform when enabled transform isn't needed
const result = feature.select({
  enabled: "original",
  disabled: { count: 5 }
}).map({
  // Enabled transform is optional - will default to identity function
  disabled: data => ({ ...data, count: data.count * 2 })
});

// For enabled features, transformation is applied to the enabled value
// For disabled features, transformation is applied to the disabled value
// When a transform is omitted, the original value remains unchanged
```

This approach reduces boilerplate when you're only processing one path and simplifies working with features.

### Type Safety Enforcement

The library enforces type safety by only accepting:
- Valid SemVer strings (e.g., '1.0.0', '2.1.3-beta.1')
- Boolean values (true or false)

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

## Benefits

- **Explicit configuration** - Clear version dependencies with required version specification
- **Type-safe** - No string identifiers at usage points
- **Declarative** - Focus on what features do, not when they're available
- **Cleaner code** - Eliminates conditionals and reduces boilerplate
- **Versioned APIs** - Seamlessly handle API evolution with backward compatibility
- **Predictable releases** - Clear understanding of when features will activate
- **Gradual migration** - Helps manage transition periods between implementations
- **External control** - Toggle features via URL parameters, localStorage, or external APIs

## License

MIT 
