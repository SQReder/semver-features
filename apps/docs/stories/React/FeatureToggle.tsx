import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SemverFeatures } from 'semver-features';
import { FeatureToggle, FeatureEnabled, FeatureDisabled } from 'semver-features-react';

// Create a feature manager instance with the current version
const features = new SemverFeatures({ version: '1.2.0' });

// Register some features with different version requirements
const basicFeature = features.register('basic', '1.0.0'); // Enabled
const newFeature = features.register('new', '1.2.0');     // Enabled
const futureFeature = features.register('future', '1.5.0'); // Disabled

const meta: Meta<typeof FeatureToggle> = {
  title: 'Components/FeatureToggle',
  component: FeatureToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeatureToggle>;

export const EnabledFeature: Story = {
  args: {
    feature: basicFeature,
    enabled: <div style={{ padding: '20px', background: 'green', color: 'white' }}>Feature is enabled!</div>,
    disabled: <div style={{ padding: '20px', background: 'red', color: 'white' }}>Feature is disabled!</div>,
  },
};

export const DisabledFeature: Story = {
  args: {
    feature: futureFeature,
    enabled: <div style={{ padding: '20px', background: 'green', color: 'white' }}>Feature is enabled!</div>,
    disabled: <div style={{ padding: '20px', background: 'red', color: 'white' }}>Feature is disabled!</div>,
  },
};

// Examples of FeatureEnabled and FeatureDisabled components
export const UsingFeatureEnabled: Story = {
  render: () => (
    <div>
      <h3>Using FeatureEnabled</h3>
      <FeatureEnabled feature={newFeature}>
        <div style={{ padding: '20px', background: 'blue', color: 'white' }}>
          This is only visible when the feature is enabled.
        </div>
      </FeatureEnabled>
      
      <h3>Using FeatureDisabled</h3>
      <FeatureDisabled feature={futureFeature}>
        <div style={{ padding: '20px', background: 'orange', color: 'white' }}>
          This is only visible when the feature is disabled.
        </div>
      </FeatureDisabled>
    </div>
  ),
}; 