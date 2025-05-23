# semver-features-json

A strongly-typed extension for the [semver-features](https://github.com/SQReder/semver-features) library that enables feature toggling based on JSON configuration files.

[![npm version](https://img.shields.io/npm/v/semver-features-json.svg)](https://www.npmjs.com/package/semver-features-json)
[![license](https://img.shields.io/npm/l/semver-features-json.svg)](./LICENSE)

## Overview

`semver-features-json` provides a type-safe way to define and manage feature flags using JSON configuration files. It extends the core `semver-features` library by automatically registering features from your JSON config and providing strong TypeScript type inference for feature names.

## Installation

```bash
# npm
npm install semver-features-json

# yarn
yarn add semver-features-json

# pnpm
pnpm add semver-features-json
```

## Key Features

- **Type-safe feature toggling** - Feature names are inferred directly from your JSON config
- **Zod schema validation** - Config is validated using Zod for runtime type safety
- **Automatic registration** - Features from JSON are registered automatically
- **Seamless integration** - Extends the semver-features API you're already familiar with

## Usage

### 1. Create a JSON Configuration File

First, create a JSON file that contains your feature definitions:

```json
// features.json
{
  "features": [
    {
      "name": "newUI",
      "description": "New user interface components",
      "versionRange": "1.2.0"
    },
    {
      "name": "analytics",
      "description": "Enhanced analytics engine",
      "versionRange": "1.3.0"
    },
    {
      "name": "experimentalApi",
      "description": "Experimental API features",
      "versionRange": "1.5.0-beta.1"
    }
  ]
}
```

### 2. Import and Use the Features

```typescript
import { createSemverFeaturesJson } from 'semver-features-json';
import featuresData from './features.json';

// Create and initialize
const features = createSemverFeaturesJson(featuresData, { 
  version: '1.3.5'  // Current application version
});

// Get a feature with full type safety
const newUI = features.get('newUI');  // TypeScript knows this is a valid feature name
const analytics = features.get('analytics');

// This would be a TypeScript error!
// const invalid = features.get('nonExistentFeature');  // Error: Type '"nonExistentFeature"' is not assignable to parameter of type '"newUI" | "analytics" | "experimentalApi"'

// Check if a feature is enabled
console.log('New UI enabled:', newUI.isEnabled);  // true (1.3.5 >= 1.2.0)
console.log('Analytics enabled:', analytics.isEnabled);  // true (1.3.5 >= 1.3.0)

// Use the standard semver-features API
newUI.execute({
  enabled: () => console.log('Using new UI'),
  disabled: () => console.log('Using classic UI')
});
```

## Advanced Usage

### Value Selection and Transformation

The library inherits all the powerful transformation capabilities from the core `semver-features` library:

```typescript
const newUI = features.get('newUI');

// Select different values based on feature status
const config = newUI.select({
  enabled: { maxItems: 20, showPreview: true },
  disabled: { maxItems: 10, showPreview: false }
});

// Value transformation
const result = newUI
  .select({ 
    enabled: userData,
    disabled: "guest-user"
  })
  .map({ 
    enabled: (data) => processUserData(data),
    disabled: (id) => createGuestProfile(id)
  });
```

### Schema Validation

The library uses Zod for schema validation, providing robust runtime type checking. You can access the schemas directly:

```typescript
import { featuresJsonSchema, featureSchema, validateFeatureConfig } from 'semver-features-json';

// Get the Zod schemas
const rootSchema = featuresJsonSchema;
const singleFeatureSchema = featureSchema;

// Use them for validation or type inference
const isValid = featuresJsonSchema.safeParse(someConfig).success;

// Validate your configuration
const validationResult = validateFeatureConfig(myConfig);
if (!validationResult.valid) {
  console.error('Invalid configuration:', validationResult.errors);
}

// Strongly type your data with schema types
import { FeaturesJson, Feature } from 'semver-features-json';
const typedConfig: FeaturesJson = featuresJsonSchema.parse(myConfig);
```

### Schema Reference

The feature configuration follows this schema:

- **$schema** (optional) - Path to schema file
- **features** (required) - Array of feature definitions:
  - **name** (required) - Unique feature identifier, must start with a letter and contain only alphanumeric characters, underscores, or hyphens
  - **description** (required) - Feature description
  - **versionRange** (required) - Semver version range string
  - **deprecated** (optional) - Boolean indicating whether feature is deprecated
  - **createdAt** (optional) - ISO 8601 date-time string when feature was created

The schema validation is performed using Zod with semver range validation.

## API Reference

### `createSemverFeaturesJson(config, options)`

Creates a new JsonSemverFeatures instance from a JSON configuration object.

**Parameters**:
- `config`: The feature configuration object (will be validated using Zod)
- `options`: SemverFeatures options including the current version

**Returns**: A JsonSemverFeatures instance with typed feature access

### `JsonSemverFeatures` Class

Extends the SemverFeatures class with strong typing based on your JSON configuration.

**Methods**:
- `get(name)`: Get a feature by name (name is type-checked against JSON). Throws an error if the feature does not exist.
- `isEnabled(name)`: Check if a feature is enabled (name is type-checked). Throws an error if the feature does not exist.
- `getAllFeatures()`: Get all registered features as a Map of feature names to Feature instances.
- All methods from the base SemverFeatures class

### Schema Functions

#### `validateFeatureConfig(config)`

Validates a feature configuration object against the schema.

**Parameters**:
- `config`: The configuration object to validate

**Returns**: A validation result with success status and any errors

#### `validateAndAssertConfig(config)`

Validates and type guards the feature configuration.

**Parameters**:
- `config`: The configuration object to validate

**Returns**: The validated configuration with type assertion
**Throws**: Error if validation fails

### Zod Schemas

#### `featuresJsonSchema`

The Zod schema used for validating the root configuration object.

#### `featureSchema` 

The Zod schema used for validating individual feature entries.

#### `featureNameSchema`

The Zod schema for feature names (must match the pattern: /^[a-zA-Z][\w\-\\\/]*$/).

#### `semverRangeSchema`

The Zod schema for validating semver range strings.

## Integration with semver-features

This package extends the functionality of semver-features, so all methods and properties from the base library are available. See the [semver-features documentation](https://github.com/SQReder/semver-features) for more details on the core functionality.

## License

MIT