# semver-features Documentation

Storybook documentation for the SemVer-Based Feature Toggle Library.

## Overview

This package contains the Storybook documentation for the `semver-features` and `semver-features-react` packages. It provides interactive examples, API documentation, and usage guidelines for working with the library.

## Development

### Prerequisites

- Node.js 14.x or higher
- npm, yarn, or pnpm

### Running Locally

From the root of the monorepo, run:

```bash
# Install dependencies
npm install

# Start the Storybook development server
npm run dev
```

Or from this directory:

```bash
# Install dependencies
npm install

# Start the Storybook development server
npm run storybook
```

The Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Content

The documentation includes:

- **Core Concepts** - Overview of the semver-based feature toggle approach
- **API Reference** - Detailed documentation of all library functions
- **Interactive Examples** - Live examples with editable code
- **Integration Guides** - Instructions for integrating with different frameworks
- **Best Practices** - Guidelines for effective use of the library

## Structure

```
docs/
├── .storybook/        # Storybook configuration
├── stories/
│   ├── Introduction/  # Introduction and core concepts
│   ├── Core/          # Core library (semver-features) documentation
│   ├── React/         # React integration (semver-features-react) documentation
│   ├── API/           # API reference
│   └── Examples/      # Interactive examples
└── public/            # Static assets for the documentation
```

## Building for Production

To build the documentation for production deployment:

```bash
# From the root of the monorepo
npm run build

# Or from this directory
npm run build-storybook
```

The built documentation will be available in the `storybook-static` directory.

## Contributing

We welcome contributions to the documentation! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on GitHub.

## Related Packages

- [semver-features](../../packages/semver-features) - Core library for semver-based feature toggles
- [semver-features-react](../../packages/semver-features-react) - React integration components 