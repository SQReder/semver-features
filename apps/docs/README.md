# semver-features Documentation

This package contains the documentation for the `semver-features` library, built with Storybook using MDX format.

## Running the Documentation

To run the documentation locally:

```bash
# From the root of the monorepo
pnpm run docs

# Or directly from the docs folder
cd apps/docs
pnpm run storybook
```

## Documentation Structure

The documentation is organized into the following sections:

### Getting Started
- **Introduction** - Overview and basic concepts of the library
- **Installation** - How to install and set up the library

### Features
- **Basic Usage** - Core functionality and basic usage patterns
- **Version Comparison** - How to compare versions using semver rules

### Components
- **React Integration** - How to use the library with React
- **Other Frameworks** - Integration with other frameworks

### Examples
- **E-commerce Application** - Real-world example of using the library in an e-commerce app
- **Progressive Enhancement** - Example of progressive enhancement with feature toggling

### Advanced
- **Custom Feature Detection** - Advanced usage patterns and configurations
- **API Reference** - Complete reference of the library's API

## MDX Format

All documentation is written in MDX format (`.mdx` extension), which combines Markdown with JSX to create interactive documentation.

### MDX Naming Convention

When creating MDX story files, follow this naming convention:

✅ CORRECT: `ComponentName.mdx`
❌ INCORRECT: `ComponentName.stories.mdx`

The `.stories` suffix is redundant for MDX files and should be omitted.

## Development

### Adding New Documentation

To add new documentation:

1. Create a new `.mdx` file in the appropriate directory
2. Start with the Meta component to define the title:

```jsx
import { Meta } from '@storybook/blocks';

<Meta title="Section/Page Title" />

# Your Markdown Content Here
```

3. Write your documentation using Markdown and JSX

### Style Guide

- Use proper heading hierarchy (h1, h2, h3, etc.)
- Include code examples with syntax highlighting
- Use MDX format, not `.stories.mdx`
- Group related documentation in appropriate sections

## Building for Production

To build the documentation for production:

```bash
# From the root directory
pnpm run build-docs

# Or from the docs directory
cd apps/docs
pnpm run build-storybook
```

The built documentation will be available in the `storybook-static` directory.

## License

MIT 