import React, { useState, useEffect } from 'react';
import { Meta } from '@storybook/react';
import { SemverFeatures } from 'semver-features';
import { useGlobals } from '@storybook/preview-api';

export default {
  title: 'SemVer Features/Feature Toggling',
  parameters: {
    // Optional parameters for better documentation
    docs: {
      description: {
        component: 'Interactive examples of feature toggling using semantic versioning',
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

// Style constants for components
const styles = {
  card: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    width: '250px',
    display: 'inline-block',
    verticalAlign: 'top',
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    borderLeft: '4px solid #3b82f6',
  },
  featureUnavailable: {
    backgroundColor: '#f1f5f9',
    borderLeft: '4px solid #94a3b8',
    color: '#64748b',
    fontStyle: 'italic',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  enhancedUI: {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    maxWidth: '600px',
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
};

/**
 * Example 1: Feature Cards that appear based on version
 */
export const FeatureCards = () => {
  const currentVersion = useSelectedVersion();
  
  // Create feature manager with the current version from the toolbar
  const features = new SemverFeatures({ version: currentVersion });
  
  // Register features with different version requirements
  const basicFeatures = features.register('basicFeatures', '1.0.0');
  const enhancedUI = features.register('enhancedUI', '1.2.0');
  const analytics = features.register('analytics', '1.3.0');
  const experimental = features.register('experimental', '2.0.0-alpha.1');
  const v2Features = features.register('v2Features', '2.0.0');
  
  // Feature cards data
  const featureCards = [
    { 
      name: 'Basic Features',
      description: 'Core functionality available in all versions',
      version: '1.0.0',
      isEnabled: basicFeatures.isEnabled,
    },
    { 
      name: 'Enhanced UI', 
      description: 'Improved user interface with advanced interactions',
      version: '1.2.0',
      isEnabled: enhancedUI.isEnabled,
    },
    { 
      name: 'Analytics Dashboard', 
      description: 'Track performance and user behavior with detailed analytics',
      version: '1.3.0',
      isEnabled: analytics.isEnabled,
    },
    { 
      name: 'Experimental Features', 
      description: 'Try cutting-edge features before they are officially released',
      version: '2.0.0-alpha.1',
      isEnabled: experimental.isEnabled,
    },
    { 
      name: 'Version 2.0 Features', 
      description: 'Complete redesign with new capabilities and improved performance',
      version: '2.0.0',
      isEnabled: v2Features.isEnabled,
    },
  ];
  
  return (
    <div>
      <h3>Current Version: {currentVersion}</h3>
      <p>Change the version using the Version Selector in the toolbar to see how available features change.</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
        {featureCards.map((card) => (
          <div 
            key={card.name}
            style={{
              ...styles.card,
              ...(card.isEnabled ? styles.featureCard : styles.featureUnavailable),
            }}
          >
            <h3>{card.name} <span style={styles.versionBadge}>v{card.version}</span></h3>
            <p>{card.description}</p>
            {card.isEnabled ? (
              <button style={styles.buttonPrimary}>Use Feature</button>
            ) : (
              <p>Available in version {card.version}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example 2: UI Elements that enhance as version increases
 */
export const EnhancedUI = () => {
  const currentVersion = useSelectedVersion();
  const features = new SemverFeatures({ version: currentVersion });
  
  // Register UI enhancements with version requirements
  const darkMode = features.register('darkMode', '1.2.0');
  const advancedFilters = features.register('advancedFilters', '1.3.0');
  const dataVisualizations = features.register('dataVisualizations', '1.5.0-beta.1');
  const aiSuggestions = features.register('aiSuggestions', '2.0.0');
  
  // State for the demo
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Effect to reset state when version changes
  useEffect(() => {
    setIsDarkMode(false);
    setSelectedFilter('all');
  }, [currentVersion]);
  
  return (
    <div style={{ 
      ...styles.enhancedUI,
      backgroundColor: isDarkMode && darkMode.isEnabled ? '#1e293b' : '#f8fafc',
      color: isDarkMode && darkMode.isEnabled ? '#f8fafc' : '#1e293b',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Product Dashboard <span style={styles.versionBadge}>v{currentVersion}</span></h3>
        
        {/* Dark Mode Toggle (v1.2.0+) */}
        {darkMode.isEnabled && (
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              ...styles.buttonSecondary,
              backgroundColor: isDarkMode ? '#64748b' : '#e2e8f0',
              color: isDarkMode ? 'white' : '#1e293b',
            }}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        )}
      </div>
      
      {/* Filters (Basic vs Advanced based on version) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px' }}>Filters:</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={{
              ...styles.buttonSecondary,
              backgroundColor: selectedFilter === 'all' ? '#3b82f6' : '#e2e8f0',
              color: selectedFilter === 'all' ? 'white' : '#1e293b',
            }}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </button>
          <button 
            style={{
              ...styles.buttonSecondary,
              backgroundColor: selectedFilter === 'active' ? '#3b82f6' : '#e2e8f0',
              color: selectedFilter === 'active' ? 'white' : '#1e293b',
            }}
            onClick={() => setSelectedFilter('active')}
          >
            Active
          </button>
          
          {/* Advanced Filters (v1.3.0+) */}
          {advancedFilters.isEnabled && (
            <>
              <button 
                style={{
                  ...styles.buttonSecondary,
                  backgroundColor: selectedFilter === 'pending' ? '#3b82f6' : '#e2e8f0',
                  color: selectedFilter === 'pending' ? 'white' : '#1e293b',
                }}
                onClick={() => setSelectedFilter('pending')}
              >
                Pending
              </button>
              <button 
                style={{
                  ...styles.buttonSecondary,
                  backgroundColor: selectedFilter === 'archive' ? '#3b82f6' : '#e2e8f0',
                  color: selectedFilter === 'archive' ? 'white' : '#1e293b',
                }}
                onClick={() => setSelectedFilter('archive')}
              >
                Archived
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Data Visualizations (v1.5.0-beta.1+) */}
      {dataVisualizations.isEnabled && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '4px' }}>
          <h4 style={{ marginTop: 0 }}>Data Visualization <span style={styles.versionBadge}>v1.5.0-beta.1+</span></h4>
          <div style={{ display: 'flex', height: '100px', alignItems: 'flex-end', gap: '16px' }}>
            {[60, 30, 75, 45, 90].map((height, index) => (
              <div 
                key={index}
                style={{ 
                  height: `${height}px`, 
                  width: '30px', 
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px 4px 0 0',
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* AI Suggestions (v2.0.0+) */}
      {aiSuggestions.isEnabled && (
        <div style={{ padding: '16px', backgroundColor: isDarkMode ? '#475569' : '#f1f5f9', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
            <span role="img" aria-label="AI">🤖</span> 
            AI Suggestions 
            <span style={styles.versionBadge}>v2.0.0+</span>
          </h4>
          <p>Based on your activity, we recommend focusing on the following areas:</p>
          <ul>
            <li>Improve documentation coverage by 15%</li>
            <li>Address the 3 high-priority customer issues</li>
            <li>Complete the quarterly performance review</li>
          </ul>
        </div>
      )}
      
      {/* Base content (always available) */}
      <div style={{ marginTop: '16px' }}>
        <h4>Product Status</h4>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ ...styles.card, flex: 1 }}>
            <h3>Active Projects</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#3b82f6' }}>12</div>
          </div>
          <div style={{ ...styles.card, flex: 1 }}>
            <h3>Completed</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#10b981' }}>8</div>
          </div>
          <div style={{ ...styles.card, flex: 1 }}>
            <h3>Issues</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#ef4444' }}>3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 3: Feature replacement pattern
 */
export const FeatureReplacement = () => {
  const currentVersion = useSelectedVersion();
  const features = new SemverFeatures({ version: currentVersion });
  
  // Setup features for old and new implementations
  const legacyAuth = features.register('legacyAuth', '1.0.0');
  const modernAuth = features.register('modernAuth', '1.3.0');
  
  // In this pattern:
  // 1. Legacy feature is available in all versions (1.0.0+)
  // 2. Modern implementation replaces it from v1.3.0
  // 3. We should never show both - the new one takes precedence
  
  // Should only show modern auth if it's enabled
  const showModernAuth = modernAuth.isEnabled;
  // Only show legacy auth if modern auth is not available
  const showLegacyAuth = legacyAuth.isEnabled && !showModernAuth;
  
  return (
    <div>
      <h3>Authentication System <span style={styles.versionBadge}>v{currentVersion}</span></h3>
      <p>This example demonstrates how to replace a legacy feature with a new implementation:</p>
      
      <div style={{ display: 'flex', marginTop: '16px', gap: '16px', maxWidth: '700px' }}>
        {/* Legacy Implementation (v1.0.0 to v1.2.0) */}
        {showLegacyAuth && (
          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #94a3b8' }}>
            <h3>Legacy Authentication <span style={styles.versionBadge}>v1.0.0+</span></h3>
            <p>Basic authentication with username and password.</p>
            
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label htmlFor="username" style={{ display: 'block', marginBottom: '4px' }}>Username:</label>
                <input id="username" type="text" style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '4px' }}>Password:</label>
                <input id="password" type="password" style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <button style={styles.buttonPrimary}>Sign In</button>
            </div>
          </div>
        )}
        
        {/* Modern Implementation (v1.3.0+) */}
        {showModernAuth && (
          <div style={{ ...styles.card, flex: 1, borderLeft: '4px solid #3b82f6' }}>
            <h3>Modern Authentication <span style={styles.versionBadge}>v1.3.0+</span></h3>
            <p>Enhanced authentication with OAuth and multi-factor authentication support.</p>
            
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '4px' }}>Email:</label>
                <input id="email" type="email" style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label htmlFor="new-password" style={{ display: 'block', marginBottom: '4px' }}>Password:</label>
                <input id="new-password" type="password" style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={styles.buttonPrimary}>Sign In</button>
                <button style={{ ...styles.buttonSecondary, backgroundColor: '#f1f5f9' }}>
                  <span role="img" aria-label="Google">G</span> Sign in with Google
                </button>
              </div>
              <div style={{ marginTop: '8px' }}>
                <input id="remember" type="checkbox" />
                <label htmlFor="remember" style={{ marginLeft: '4px' }}>Remember Me</label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
        <h4>Implementation Note:</h4>
        <p>This pattern shows how to replace a legacy feature with a new implementation:</p>
        <ul>
          <li>Legacy authentication is available from v1.0.0</li>
          <li>Modern authentication replaces it from v1.3.0</li>
          <li>Features are mutually exclusive - we never show both at the same time</li>
          <li>This allows for a clean transition between implementations while maintaining backward compatibility</li>
        </ul>
      </div>
    </div>
  );
}; 