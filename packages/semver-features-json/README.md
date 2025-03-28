# semver-features-json

A strongly-typed extension for the [semver-features](https://github.com/SQReder/semver-features) library that enables feature toggling based on JSON configuration files.

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
      "versionRange": "1.2.0",
      "enabledByDefault": false
    },
    {
      "name": "analytics",
      "description": "Enhanced analytics engine",
      "versionRange": "1.3.0",
      "tags": ["performance", "tracking"]
    },
    {
      "name": "experimentalApi",
      "description": "Experimental API features",
      "versionRange": "1.5.0-beta.1",
      "deprecated": false
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
// const invalid = features.get('nonExistentFeature');

// Check if a feature is enabled
console.log('New UI enabled:', newUI?.isEnabled);  // true (1.3.5 >= 1.2.0)
console.log('Analytics enabled:', analytics?.isEnabled);  // true (1.3.5 >= 1.3.0)

// Use the standard semver-features API
if (newUI) {
  newUI.execute({
    enabled: () => console.log('Using new UI'),
    disabled: () => console.log('Using classic UI')
  });
}
```

## Advanced Usage

### Value Selection and Transformation

```typescript
const newUI = features.get('newUI');

if (newUI) {
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
}
```

### Schema Validation

The library uses Zod for schema validation, providing robust runtime type checking. You can access the schema directly:

```typescript
import { getSchema } from 'semver-features-json';

// Get the Zod schema
const featureSchema = getSchema();

// Use it for validation or type inference
const isValid = featureSchema.safeParse(someConfig).success;

// You can also extend the schema
const extendedSchema = featureSchema.extend({
  // add your custom fields
});
```

### Schema Reference

The feature configuration follows this schema:

- **$schema** - Optional path to schema file
- **features** - Array of feature definitions
  - **name** - Unique feature identifier (required)
  - **description** - Feature description (required)
  - **versionRange** - Semver version range (required)
  - **enabledByDefault** - Whether feature is on by default (optional)
  - **tags** - Array of categorization tags (optional)
  - **deprecated** - Whether feature is deprecated (optional)
  - **owners** - Array of feature owners (optional)
  - **createdAt** - Creation timestamp (optional)
  - **expiresAt** - Expiration timestamp (optional)

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
- `get(name)`: Get a feature by name (name is type-checked against JSON)
- `isEnabled(name)`: Check if a feature is enabled
- `getAllFeatures()`: Get all registered features

### `getSchema()`

Returns the Zod schema used for validation.

## Integration with semver-features

This package extends the functionality of semver-features, so all methods and properties from the base library are available. See the [semver-features documentation](https://github.com/SQReder/semver-features) for more details.

## License

MIT
