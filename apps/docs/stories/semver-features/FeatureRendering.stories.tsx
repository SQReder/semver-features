import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { SemverFeatures } from 'semver-features';
import { useGlobals } from '@storybook/preview-api';

export default {
  title: 'SemVer Features/Feature Rendering',
  parameters: {
    docs: {
      description: {
        component: 'Examples of different rendering patterns using the feature.render method',
      },
    },
  },
} as Meta;

// Helper hook to get the current version from the version selector
const useSelectedVersion = () => {
  const [globals] = useGlobals();
  // 'semverVersion' is the global parameter set by the version selector addon
  return globals.semverVersion || '1.0.0';
};

// Style constants
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  section: {
    marginBottom: '32px',
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  card: {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  title: {
    margin: '0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#64748b',
  },
  pill: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  col: {
    flex: '1',
    minWidth: '200px',
  },
  versionBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    borderRadius: '4px',
    fontSize: '0.85em',
    marginLeft: '8px',
  },
  previewBox: {
    padding: '12px',
    borderRadius: '4px',
    backgroundColor: '#f1f5f9',
    marginTop: '8px',
  },
  result: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    border: '1px dashed #cbd5e1',
  },
  codeBlock: {
    backgroundColor: '#f8fafc', 
    padding: '12px', 
    borderRadius: '4px', 
    fontFamily: 'monospace', 
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    overflow: 'auto',
    marginBottom: '16px',
  },
};

// Example components
const LegacyHeader = ({ title = 'Dashboard' }: { title?: string }) => (
  <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '4px' }}>
    <h3 style={{ margin: '0', color: '#475569' }}>{title}</h3>
  </div>
);

const ModernHeader = ({ title = 'Dashboard', subtitle }: { title?: string; subtitle?: string }) => (
  <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '4px' }}>
    <h3 style={{ margin: '0', color: '#1e40af' }}>{title}</h3>
    {subtitle && <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#3b82f6' }}>{subtitle}</p>}
  </div>
);

const LegacyChart = () => (
  <div style={{ 
    height: '100px', 
    backgroundColor: '#f1f5f9', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: '4px'
  }}>
    <span style={{ color: '#64748b' }}>Basic Chart</span>
  </div>
);

const ModernChart = () => (
  <div style={{ 
    height: '100px', 
    backgroundColor: '#dbeafe', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <span style={{ color: '#1e40af', fontWeight: 'bold' }}>Interactive Chart</span>
    <div style={{ 
      position: 'absolute', 
      bottom: '0', 
      left: '0', 
      width: '100%', 
      height: '40px', 
      display: 'flex', 
      alignItems: 'flex-end'
    }}>
      {[40, 25, 60, 35, 70, 45, 55].map((height, i) => (
        <div 
          key={i} 
          style={{ 
            height: `${height}%`, 
            flex: '1', 
            backgroundColor: '#3b82f6', 
            margin: '0 2px', 
            borderRadius: '2px 2px 0 0',
            opacity: 0.7
          }} 
        />
      ))}
    </div>
  </div>
);

/**
 * Example 1: Basic Render Method Pattern
 */
export const BasicRenderMethod = () => {
  const currentVersion = useSelectedVersion();
  const features = new SemverFeatures({ version: currentVersion });
  
  // Register features with version requirements
  const modernUI = features.register('modernUI', '1.2.0');
  const analytics = features.register('analytics', '1.5.0');
  
  return (
    <div style={styles.container}>
      <h3>Current Version: {currentVersion}</h3>
      <p>Change the version using the Version Selector in the toolbar to see how components render differently.</p>
      
      <div style={styles.section}>
        <h3>Feature.render Method Pattern</h3>
        <p>The <code>render</code> method allows you to specify different components to render based on feature availability:</p>
        
        <pre style={styles.codeBlock}>
          {`modernUI.execute({
  enabled: () => <ModernHeader title="Dashboard" subtitle="Feature-based rendering" />,
  disabled: () => <LegacyHeader title="Dashboard" />
});`}
        </pre>
        
        <div style={styles.card}>
          <div style={styles.header}>
            <h4 style={styles.title}>Header Example <span style={styles.versionBadge}>v1.2.0+</span></h4>
          </div>
          
          <div style={styles.result}>
            {modernUI.execute({
              enabled: () => <ModernHeader title="Dashboard" subtitle="Feature-based rendering" />,
              disabled: () => <LegacyHeader title="Dashboard" />
            })}
          </div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.header}>
            <h4 style={styles.title}>Chart Example <span style={styles.versionBadge}>v1.5.0+</span></h4>
          </div>
          
          <div style={styles.result}>
            {analytics.execute({
              enabled: () => <ModernChart />,
              disabled: () => <LegacyChart />
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 2: Render Method with Props
 */
export const RenderWithProps = () => {
  const currentVersion = useSelectedVersion();
  const features = new SemverFeatures({ version: currentVersion });
  
  // Register features with version requirements
  const enhancedUI = features.register('enhancedUI', '1.3.0');
  const dataExport = features.register('dataExport', '1.4.0');
  
  // State for the demos
  const [count, setCount] = useState(0);
  
  return (
    <div style={styles.container}>
      <h3>Current Version: {currentVersion}</h3>
      
      <div style={styles.section}>
        <h3>Render Method with Shared Props</h3>
        <p>Pass props consistently to both enabled and disabled components:</p>
        
        <pre style={styles.codeBlock}>
          {`enhancedUI.execute({
  enabled: () => <EnhancedCounter count={count} onIncrement={() => setCount(count + 1)} />,
  disabled: () => <BasicCounter count={count} onIncrement={() => setCount(count + 1)} />
});`}
        </pre>
        
        <div style={styles.card}>
          <div style={styles.header}>
            <h4 style={styles.title}>Interactive Counter <span style={styles.versionBadge}>v1.3.0+</span></h4>
          </div>
          
          <div style={styles.result}>
            {enhancedUI.execute({
              enabled: () => (
                <div style={{ backgroundColor: '#dbeafe', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>Enhanced Counter</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{count}</span>
                    <div>
                      <button 
                        onClick={() => setCount(count + 1)}
                        style={styles.buttonPrimary}
                      >
                        Increment
                      </button>
                      <button 
                        onClick={() => setCount(Math.max(0, count - 1))}
                        style={{ ...styles.buttonSecondary, marginLeft: '8px' }}
                      >
                        Decrement
                      </button>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <span style={{ fontSize: '14px', color: '#3b82f6' }}>
                        Updated {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ),
              disabled: () => (
                <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '4px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>Basic Counter</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '18px', color: '#64748b' }}>{count}</span>
                    <button 
                      onClick={() => setCount(count + 1)}
                      style={styles.buttonSecondary}
                    >
                      Increment
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.header}>
            <h4 style={styles.title}>Export Actions <span style={styles.versionBadge}>v1.4.0+</span></h4>
          </div>
          
          <div style={styles.result}>
            {dataExport.execute({
              enabled: () => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={styles.buttonPrimary}>Export as CSV</button>
                  <button style={styles.buttonPrimary}>Export as JSON</button>
                  <button style={styles.buttonPrimary}>Export as PDF</button>
                </div>
              ),
              disabled: () => (
                <div>
                  <button style={styles.buttonSecondary} disabled>
                    Export (Available in v1.4.0+)
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 3: Conditional Rendering with Branching Logic
 */
export const ConditionalLogic = () => {
  const currentVersion = useSelectedVersion();
  const features = new SemverFeatures({ version: currentVersion });
  
  // Register features with different version requirements
  const basicAPI = features.register('basicAPI', '1.0.0');
  const advancedAPI = features.register('advancedAPI', '1.3.0');
  const experimentalAPI = features.register('experimentalAPI', '2.0.0-beta.1');
  
  // Combined features for complex logic
  const shouldShowAdvanced = advancedAPI.isEnabled;
  const shouldShowExperimental = experimentalAPI.isEnabled;
  const showBasicOnly = basicAPI.isEnabled && !shouldShowAdvanced && !shouldShowExperimental;
  
  return (
    <div style={styles.container}>
      <h3>Current Version: {currentVersion}</h3>
      
      <div style={styles.section}>
        <h3>Complex Conditional Rendering with Feature Composition</h3>
        <p>Combine multiple feature checks to determine what to render:</p>
        
        <pre style={styles.codeBlock}>
          {`// Determine what to show based on multiple feature flags
const shouldShowAdvanced = advancedAPI.isEnabled;
const shouldShowExperimental = experimentalAPI.isEnabled;
const showBasicOnly = basicAPI.isEnabled && !shouldShowAdvanced && !shouldShowExperimental;

// Then use execute to render the appropriate component
const apiComponent = function() {
  if (shouldShowExperimental) {
    return <ExperimentalAPIView />;
  } else if (shouldShowAdvanced) {
    return <AdvancedAPIView />;
  } else {
    return <BasicAPIView />;
  }
}();`}
        </pre>
        
        <div style={styles.card}>
          <div style={styles.header}>
            <h4 style={styles.title}>API Feature Levels</h4>
          </div>
          
          <div style={styles.result}>
            {/* Complex conditional rendering based on multiple features */}
            {(() => {
              if (shouldShowExperimental) {
                return (
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '8px',
                    borderLeft: '4px solid #10b981' 
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#047857' }}>
                      Experimental API <span style={styles.versionBadge}>v2.0.0-beta.1+</span>
                    </h4>
                    <p style={{ color: '#059669', margin: '0 0 8px 0' }}>
                      Access to cutting-edge features still in development.
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        ...styles.buttonPrimary,
                        backgroundColor: '#10b981',
                      }}>
                        AI-Powered Analysis
                      </button>
                      <button style={{
                        ...styles.buttonPrimary,
                        backgroundColor: '#10b981',
                      }}>
                        Predictive Features
                      </button>
                    </div>
                  </div>
                );
              } else if (shouldShowAdvanced) {
                return (
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#dbeafe', 
                    borderRadius: '8px',
                    borderLeft: '4px solid #3b82f6' 
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>
                      Advanced API <span style={styles.versionBadge}>v1.3.0+</span>
                    </h4>
                    <p style={{ color: '#3b82f6', margin: '0 0 8px 0' }}>
                      Extended functionality with advanced data processing.
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={styles.buttonPrimary}>Batch Processing</button>
                      <button style={styles.buttonPrimary}>Advanced Filters</button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '8px',
                    borderLeft: '4px solid #64748b' 
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>
                      Basic API <span style={styles.versionBadge}>v1.0.0+</span>
                    </h4>
                    <p style={{ color: '#64748b', margin: '0 0 8px 0' }}>
                      Core functionality for standard operations.
                    </p>
                    <div>
                      <button style={styles.buttonSecondary}>Simple Query</button>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <h3>Implementation Notes</h3>
        <ul>
          <li>The render method works with both direct values and component references</li>
          <li>For React components, wrap your components in functions to avoid unnecessary rendering</li>
          <li>You can use the render method for simple toggles or complex conditional logic</li>
          <li>To share props between components, define them outside the render method</li>
          <li>For multiple feature dependencies, you can compose logical conditions before rendering</li>
        </ul>
      </div>
    </div>
  );
};