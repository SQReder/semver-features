/**
 * React integration example for the SemVer-based feature toggle library
 * 
 * NOTE: This is EXAMPLE CODE only - not meant to be executed directly.
 * It demonstrates the various ways to use the library with React.
 * In a real application, you would import React properly and have the
 * appropriate build configuration for JSX.
 */

// EXAMPLE PSEUDOCODE - FOR DEMONSTRATION PURPOSES ONLY

// In a real application, you would import React:
// import React from 'react';
// import { SemverFeatures, FeatureToggle, FeatureEnabled, FeatureDisabled } from 'semver-features';

/*
// Initialize the feature manager with current app version
const features = new SemverFeatures({ version: '1.3.5' });

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');          // Enabled in v1.2.0+
const analyticsEngine = features.register('analytics', '1.3.0'); // Enabled in v1.3.0+
const experimentalApi = features.register('expApi', '1.5.0-beta.1'); // Enabled in v1.5.0-beta.1+

// Components for the examples
const NewHeader = ({ subtitle, showBeta = false }) => (
  <header className="new-header">
    <h1>New Header {showBeta && <span className="beta-badge">BETA</span>}</h1>
    <p>{subtitle}</p>
  </header>
);

const OldHeader = ({ title = "Legacy Header" }) => (
  <header className="old-header">
    <h1>{title}</h1>
  </header>
);

const NewDashboard = () => <div>New Dashboard</div>;
const LegacyDashboard = () => <div>Legacy Dashboard</div>;
const AnalyticsProvider = () => <div>Analytics Provider</div>;

// React component using feature toggles
export function Dashboard() {
  return (
    <div className="dashboard">
      {/* Method 1: Direct render with component references */}
      {newUI.render({
        enabled: <NewHeader subtitle="Direct render" />,
        disabled: <OldHeader />
      })}
      
      {/* Method 2: Using the FeatureToggle component */}
      <FeatureToggle 
        feature={newUI}
        enabled={<NewDashboard />}
        disabled={<LegacyDashboard />}
      />
      
      {/* Method 3: Using the FeatureEnabled component */}
      <FeatureEnabled feature={analyticsEngine}>
        <AnalyticsProvider />
      </FeatureEnabled>
      
      {/* Method 4: Using the FeatureDisabled component */}
      <FeatureDisabled feature={experimentalApi}>
        <div className="fallback">Experimental API not available in this version</div>
      </FeatureDisabled>
      
      {/* Method 5: Direct conditional rendering */}
      {analyticsEngine.isEnabled && <div>Analytics is enabled!</div>}
      
      {/* Method 6: Render function pattern (legacy API) */}
      {newUI.renderComponent({
        enabled: () => <NewHeader subtitle="Legacy render function API" />,
        disabled: () => <OldHeader />
      })}
      
      {/* Method 7: Select and map pattern (functional approach) */}
      {newUI
        .select({
          enabled: { subtitle: "Functional API", showBeta: true },
          disabled: "Old School Header"
        })
        .map({
          enabled: (config) => <NewHeader {...config} />,
          disabled: (title) => <OldHeader title={title} />
        }).value}
    </div>
  );
}
*/

/**
 * EXAMPLE USAGE SUMMARY
 * 
 * 1. Direct render method:
 *    feature.render({ enabled: enabledComponent, disabled: disabledComponent })
 * 
 * 2. FeatureToggle component:
 *    <FeatureToggle feature={feature} enabled={...} disabled={...} />
 * 
 * 3. FeatureEnabled component:
 *    <FeatureEnabled feature={feature}>
 *      <ComponentOnlyShownWhenEnabled />
 *    </FeatureEnabled>
 * 
 * 4. FeatureDisabled component:
 *    <FeatureDisabled feature={feature}>
 *      <ComponentOnlyShownWhenDisabled />
 *    </FeatureDisabled>
 * 
 * 5. Direct conditional rendering:
 *    {feature.isEnabled && <ComponentOnlyShownWhenEnabled />}
 * 
 * 6. Render function pattern:
 *    feature.renderComponent({
 *      enabled: () => <EnabledComponent />,
 *      disabled: () => <DisabledComponent />
 *    })
 * 
 * 7. Functional select/map pattern:
 *    feature
 *      .select({
 *        enabled: enabledValue,
 *        disabled: disabledValue
 *      })
 *      .map({
 *        enabled: (value) => <Component {...value} />,
 *        disabled: (value) => <OtherComponent {...value} />
 *      }).value
 */ 