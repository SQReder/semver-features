import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SemverFeatures } from 'semver-features';
import { FeatureToggle, FeatureEnabled, FeatureDisabled } from 'semver-features-react';

// Create a feature manager instance with the current version
const features = new SemverFeatures({ version: '1.2.0' });

// Register some features with different version requirements
const basicFeature = features.register('basic', '1.0.0');         // Enabled
const currentFeature = features.register('current', '1.2.0');     // Enabled
const futureFeature = features.register('future', '1.5.0');       // Disabled
const experimentalFeature = features.register('experimental', '1.3.0-beta.1'); // Disabled

// Mock compose object for the example
// In a real application, you would import this from semver-features
// Note: This is a simplified mock for demonstration purposes only.
// TypeScript will show type errors because our mock doesn't implement the full Feature interface,
// but this is acceptable for this example story.
const compose = {
  and: (features: any[]) => {
    return {
      isEnabled: () => features.every(f => f.isEnabled())
    };
  },
  or: (features: any[]) => {
    return {
      isEnabled: () => features.some(f => f.isEnabled())
    };
  },
  not: (feature: any) => {
    return {
      isEnabled: () => !feature.isEnabled()
    };
  }
};

// Create a composite feature
const combinedFeature = compose.and([basicFeature, currentFeature]);
const eitherFeature = compose.or([currentFeature, futureFeature]);
const notFeature = compose.not(futureFeature);

// A wrapper component to display our examples
const ExampleWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ margin: '20px 0', border: '1px solid #eee', borderRadius: '5px', padding: '20px' }}>
    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>{title}</h3>
    {children}
  </div>
);

// Feature info component
const FeatureInfo: React.FC<{ feature: any; name: string }> = ({ feature, name }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center',
    margin: '5px 0',
    padding: '5px',
    backgroundColor: '#f5f5f5',
    borderRadius: '3px'
  }}>
    <div style={{ 
      width: '12px', 
      height: '12px', 
      borderRadius: '50%',
      backgroundColor: feature.isEnabled() ? 'green' : 'red',
      marginRight: '10px'
    }} />
    <span><strong>{name}</strong> - {feature.isEnabled() ? 'Enabled' : 'Disabled'}</span>
  </div>
);

// Create a component for the example
const CommonPatternsExamples = () => {
  return (
    <div>
      <h2>Common Feature Toggle Patterns</h2>
      <p>Current application version: <strong>1.2.0</strong></p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Feature Status</h3>
        <FeatureInfo feature={basicFeature} name="Basic Feature (v1.0.0)" />
        <FeatureInfo feature={currentFeature} name="Current Feature (v1.2.0)" />
        <FeatureInfo feature={futureFeature} name="Future Feature (v1.5.0)" />
        <FeatureInfo feature={experimentalFeature} name="Experimental Feature (v1.3.0-beta.1)" />
        <FeatureInfo feature={combinedFeature} name="Combined Feature (basic AND current)" />
        <FeatureInfo feature={eitherFeature} name="Either Feature (current OR future)" />
        <FeatureInfo feature={notFeature} name="Not Feature (NOT future)" />
      </div>
      
      <ExampleWrapper title="Simple Toggle">
        <FeatureToggle
          feature={currentFeature}
          enabled={
            <div style={{ padding: '15px', backgroundColor: '#e6f7e6', borderRadius: '4px' }}>
              This feature is available in the current version.
            </div>
          }
          disabled={
            <div style={{ padding: '15px', backgroundColor: '#fae6e6', borderRadius: '4px' }}>
              This feature is not available in the current version.
            </div>
          }
        />
      </ExampleWrapper>
      
      <ExampleWrapper title="Feature Enabled/Disabled Components">
        <div>
          <h4>Feature Enabled Component:</h4>
          <FeatureEnabled feature={basicFeature}>
            <div style={{ padding: '15px', backgroundColor: '#e6f7e6', borderRadius: '4px' }}>
              This content is only visible when the basic feature is enabled.
            </div>
          </FeatureEnabled>
          
          <h4>Feature Disabled Component:</h4>
          <FeatureDisabled feature={futureFeature}>
            <div style={{ padding: '15px', backgroundColor: '#fae6e6', borderRadius: '4px' }}>
              This content is only visible when the future feature is disabled.
            </div>
          </FeatureDisabled>
        </div>
      </ExampleWrapper>
      
      <ExampleWrapper title="Composite Features">
        <div>
          <h4>AND Composition (basic AND current):</h4>
          <FeatureToggle
            feature={combinedFeature}
            enabled={
              <div style={{ padding: '15px', backgroundColor: '#e6f7e6', borderRadius: '4px' }}>
                Both the basic and current features are enabled.
              </div>
            }
            disabled={
              <div style={{ padding: '15px', backgroundColor: '#fae6e6', borderRadius: '4px' }}>
                At least one of the required features is disabled.
              </div>
            }
          />
          
          <h4>OR Composition (current OR future):</h4>
          <FeatureToggle
            feature={eitherFeature}
            enabled={
              <div style={{ padding: '15px', backgroundColor: '#e6f7e6', borderRadius: '4px' }}>
                At least one of the features is enabled.
              </div>
            }
            disabled={
              <div style={{ padding: '15px', backgroundColor: '#fae6e6', borderRadius: '4px' }}>
                None of the features are enabled.
              </div>
            }
          />
          
          <h4>NOT Composition (NOT future):</h4>
          <FeatureToggle
            feature={notFeature}
            enabled={
              <div style={{ padding: '15px', backgroundColor: '#e6f7e6', borderRadius: '4px' }}>
                The future feature is disabled.
              </div>
            }
            disabled={
              <div style={{ padding: '15px', backgroundColor: '#fae6e6', borderRadius: '4px' }}>
                The future feature is enabled.
              </div>
            }
          />
        </div>
      </ExampleWrapper>
      
      <ExampleWrapper title="Feature Flag Button">
        <div>
          <p>A reusable component that uses feature flags:</p>
          
          <FeatureAwareButton 
            feature={currentFeature}
            enabledText="New Button Design"
            disabledText="Old Button Design"
            onClick={() => alert('Button clicked!')}
          />
          
          <div style={{ marginTop: '10px' }}></div>
          
          <FeatureAwareButton 
            feature={futureFeature}
            enabledText="Future Button"
            disabledText="Current Button"
            onClick={() => alert('Button clicked!')}
          />
        </div>
      </ExampleWrapper>
    </div>
  );
};

// Create a button component that is feature aware
const FeatureAwareButton: React.FC<{
  feature: any;
  enabledText: string;
  disabledText: string;
  onClick: () => void;
}> = ({ feature, enabledText, disabledText, onClick }) => {
  return (
    <FeatureToggle
      feature={feature}
      enabled={
        <button
          onClick={onClick}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {enabledText}
        </button>
      }
      disabled={
        <button
          onClick={onClick}
          style={{
            padding: '8px 12px',
            backgroundColor: '#e0e0e0',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '2px',
            cursor: 'pointer'
          }}
        >
          {disabledText}
        </button>
      }
    />
  );
};

const meta: Meta<typeof CommonPatternsExamples> = {
  title: 'Examples/Common Patterns',
  component: CommonPatternsExamples,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof CommonPatternsExamples>;

export const CommonPatterns: Story = {}; 