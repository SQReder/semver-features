import React from 'react';
import type { Preview } from '@storybook/react';
import { SemverFeatures } from 'semver-features';
import { SemverFeaturesProvider } from './components';

const withSemverFeatures = (Story: any, context: any) => {
  // Get the version from globals, default to 1.0.0
  const selectedVersion = context.globals.semverVersion || '1.0.0';
  
  // Initialize semver-features with the selected version
  const features = new SemverFeatures({ version: selectedVersion });
  
  // Wrap story with provider
  return (
    <SemverFeaturesProvider features={features}>
      <div style={{ margin: '1em' }}>
        <Story />
        <div style={{ 
          marginTop: '1.5em', 
          padding: '0.8em',
          borderTop: '1px solid #eee',
          fontSize: '0.85em', 
          color: '#666'
        }}>
          Current version: <strong>{selectedVersion}</strong> 
          <span style={{ fontSize: '0.9em', marginLeft: '0.5em' }}>
            (Change the version using the Version Selector panel or toolbar button)
          </span>
        </div>
      </div>
    </SemverFeaturesProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withSemverFeatures],
  globalTypes: {
    semverVersion: {
      name: 'Library Version',
      description: 'Simulated version of the application',
      defaultValue: '1.0.0',
    },
  },
};

export default preview; 