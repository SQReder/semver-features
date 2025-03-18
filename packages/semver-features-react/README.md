# semver-features-react

React integration for the SemVer-Based Feature Toggle Library.

[![npm version](https://img.shields.io/npm/v/semver-features-react.svg)](https://www.npmjs.com/package/semver-features-react)
[![license](https://img.shields.io/npm/l/semver-features-react.svg)](./LICENSE)

## Overview

`semver-features-react` provides React components and hooks for working with the [semver-features](https://www.npmjs.com/package/semver-features) library. It allows you to easily toggle React components based on semantic versioning, creating a clean, declarative approach to feature management in React applications.

## Installation

```bash
# npm
npm install semver-features semver-features-react

# yarn
yarn add semver-features semver-features-react

# pnpm
pnpm add semver-features semver-features-react
```

## Requirements

- React 16.14.0 or higher
- semver-features (peer dependency)

## Basic Usage

First, initialize the feature manager and register your features:

```tsx
import { SemverFeatures } from 'semver-features';
import { FeatureToggle, FeatureEnabled, FeatureDisabled } from 'semver-features-react';

// Initialize the feature manager with current app version
const features = new SemverFeatures({ version: '1.3.5' });

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');          // Enabled in v1.2.0+
const analyticsEngine = features.register('analytics', '1.3.0'); // Enabled in v1.3.0+
const experimentalApi = features.register('expApi', '1.5.0-beta.1'); // Enabled in v1.5.0-beta.1+
```

## Component Toggling Approaches

There are multiple ways to use feature toggles in your React components:

### 1. Direct Render Method

Use the feature's built-in render method:

```tsx
function Header() {
  return newUI.render({
    enabled: <NewHeader subtitle="Direct render" />,
    disabled: <OldHeader />
  });
}
```

### 2. FeatureToggle Component

Use the `FeatureToggle` component for declarative toggling:

```tsx
function Dashboard() {
  return (
    <FeatureToggle 
      feature={newUI}
      enabled={<NewDashboard />}
      disabled={<LegacyDashboard />}
    />
  );
}
```

### 3. FeatureEnabled Component

Render content only when a feature is enabled:

```tsx
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

### 4. FeatureDisabled Component

Render content only when a feature is disabled:

```tsx
function App() {
  return (
    <div>
      <FeatureDisabled feature={experimentalApi}>
        <div className="fallback">Experimental API not available in this version</div>
      </FeatureDisabled>
    </div>
  );
}
```

### 5. Direct Conditional Rendering

Use the `isEnabled` property for simple conditional rendering:

```tsx
function App() {
  return (
    <div>
      {analyticsEngine.isEnabled && <div>Analytics is enabled!</div>}
    </div>
  );
}
```

### 6. Render Function Pattern

For more complex scenarios, use the render function pattern:

```tsx
function Header() {
  return newUI.execute({
    enabled: () => <NewHeader subtitle="Using render function API" />,
    disabled: () => <OldHeader />
  });
}
```

### 7. Functional Select/Map Pattern

For advanced use cases with different props and transformations:

```tsx
function Header() {
  return newUI
    .select({
      enabled: { subtitle: "Functional API", showBeta: true },
      disabled: "Old School Header"
    })
    .map({
      enabled: (config) => <NewHeader {...config} />,
      disabled: (title) => <OldHeader title={title} />
    }).value;
}
```

## Complete Example

Here's a complete component example using multiple feature toggle approaches:

```tsx
import React from 'react';
import { SemverFeatures } from 'semver-features';
import { FeatureToggle, FeatureEnabled } from 'semver-features-react';

// Initialize features
const features = new SemverFeatures({ version: '1.3.5' });
const newUI = features.register('newUI', '1.2.0');
const analyticsEngine = features.register('analytics', '1.3.0');
const experimentalApi = features.register('expApi', '1.5.0-beta.1');

// Component definitions
const NewHeader = ({ subtitle, showBeta = false }) => (
  <header className="new-header">
    <h1>New Header {showBeta && <span className="beta-badge">BETA</span>}</h1>
    <p>{subtitle}</p>
  </header>
);

const OldHeader = ({ title = "Legacy Header" }) => (
  <header className="old-header">
    <h1>{title}</h1>
  </header>
);

const NewDashboard = () => <div>New Dashboard</div>;
const LegacyDashboard = () => <div>Legacy Dashboard</div>;
const AnalyticsProvider = () => <div>Analytics Provider</div>;

// Dashboard component using multiple feature toggle approaches
export function Dashboard() {
  return (
    <div className="dashboard">
      {/* Direct render method */}
      {newUI.render({
        enabled: <NewHeader subtitle="Direct render" />,
        disabled: <OldHeader />
      })}
      
      {/* FeatureToggle component */}
      <FeatureToggle 
        feature={newUI}
        enabled={<NewDashboard />}
        disabled={<LegacyDashboard />}
      />
      
      {/* FeatureEnabled component */}
      <FeatureEnabled feature={analyticsEngine}>
        <AnalyticsProvider />
      </FeatureEnabled>
      
      {/* Select and map pattern */}
      {newUI
        .select({
          enabled: { subtitle: "Functional API", showBeta: true },
          disabled: "Old School Header"
        })
        .map({
          enabled: (config) => <NewHeader {...config} />,
          disabled: (title) => <OldHeader title={title} />
        }).value}
    </div>
  );
}
```

## Benefits

- **Declarative API** - Feature toggles expressed directly in your JSX
- **Multiple patterns** - Choose the approach that fits your use case
- **Type safety** - Full TypeScript support with proper type inference
- **Functional approach** - Powerful value transformation with select/map/fold
- **Clean components** - No conditional clutter in your component code
- **Seamless versioning** - Automatically switch components based on app version

## Related Packages

- [semver-features](https://www.npmjs.com/package/semver-features) - Core library for semver-based feature toggles

## License

MIT 