# SemVer-Based Feature Toggle Library (Monorepo)

This is a monorepo for the SemVer-Based Feature Toggle Library, which provides an elegant solution for automatically enabling features based on semantic versioning.

## Packages

The monorepo contains the following packages:

- **semver-features**: Core functionality for semver-based feature toggling
- **semver-features-react**: React integration components for the core library
- **semver-features-json**: JSON-based configuration for the core library
- **@repo/tsup-config**: Shared tsup configuration for building packages (internal)
- **@repo/typescript-config**: Shared TypeScript configuration (internal)
- **docs**: Storybook application for testing and documentation

## Getting Started

### Installation

```bash
# Install dependencies for all packages
npm install
```

### Development

```bash
# Build all packages
npm run build

# Run tests for all packages
npm run test

# Run linting for all packages
npm run lint

# Start the Storybook development server
npm run dev
```

## Requirements

- **React compatibility**: The React integration package supports React 16.14.0 and higher.

## License

MIT
