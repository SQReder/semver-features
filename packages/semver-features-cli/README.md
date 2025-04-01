# semver-features-cli

Command-line interface for managing semver-based feature toggles in `features.json`.

## Installation

```bash
npm install semver-features-cli
```

Or install globally:

```bash
npm install -g semver-features-cli
```

## Usage

The CLI provides the following commands:

```bash
# Add a new feature toggle
semver-features add

# Remove an existing feature toggle
semver-features remove

# Deprecate an existing feature toggle
semver-features deprecate
```

## Features

- Interactive questionnaire-based interface using Enquirer
- Add new feature toggles with name, description, and version range
- Remove existing feature toggles with confirmation
- Deprecate existing feature toggles with confirmation
- Configuration via cosmiconfig (`.semver-featuresrc`, `semver-features.json`, etc.)

## Configuration

The CLI supports configuration through [cosmiconfig](https://github.com/davidtheclark/cosmiconfig). You can create a configuration file in one of the following formats:

- `.semver-featuresrc` (JSON or YAML)
- `.semver-featuresrc.json`
- `.semver-featuresrc.yaml`
- `.semver-featuresrc.yml`
- `.semver-featuresrc.js`
- `.semver-featuresrc.cjs`
- `semver-features.config.js`
- `semver-features.config.cjs`
- `semver-features` property in `package.json`

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `featuresJsonPath` | `string` | `"features.json"` | Path to the features JSON file |

### Example Configuration

```json
{
  "featuresJsonPath": "./config/features.json"
}
```

## Feature Toggle Format

Each feature toggle has the following properties:

- `name` - Unique identifier for the feature (alphanumeric with underscores/hyphens)
- `description` - Human-readable description of the feature
- `versionRange` - Semver range expression for when the feature is active
- `deprecated` - (Optional) Boolean indicating if the feature is deprecated
- `createdAt` - (Optional) ISO 8601 timestamp when the feature was created

Example features.json:

```json
{
  "features": [
    {
      "name": "new-ui",
      "description": "New user interface components",
      "versionRange": ">=1.5.0",
      "createdAt": "2023-03-15T12:30:45Z"
    },
    {
      "name": "api-v2",
      "description": "Version 2 of the API",
      "versionRange": ">=2.0.0",
      "deprecated": true,
      "createdAt": "2022-11-10T09:15:30Z"
    }
  ]
}
```

## License

MIT
