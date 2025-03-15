/**
 * Basic usage example for the SemVer-based feature toggle library
 */
import { SemverFeatures } from '../src';

// Initialize the feature manager with current app version
const features = new SemverFeatures({ version: '1.3.5' });

// Register features with minimum version requirements
const newUI = features.register('newUI', '1.2.0');          // Enabled in v1.2.0+
const analyticsEngine = features.register('analytics', '1.3.0'); // Enabled in v1.3.0+
const experimentalApi = features.register('expApi', '1.5.0-beta.1'); // Enabled in v1.5.0-beta.1+

// Check feature status
console.log('Current version:', features.currentVersion);
console.log('New UI enabled:', newUI.isEnabled);             // true (1.3.5 >= 1.2.0)
console.log('Analytics enabled:', analyticsEngine.isEnabled); // true (1.3.5 >= 1.3.0)
console.log('Experimental API enabled:', experimentalApi.isEnabled); // false (1.3.5 < 1.5.0-beta.1)

// Feature conditional execution
newUI.execute({
  enabled: () => console.log('Using new UI'),
  disabled: () => console.log('Using legacy UI')
});

// Feature conditional execution with async
async function fetchData() {
  const data = await experimentalApi.executeAsync({
    enabled: async () => {
      console.log('Using experimental API');
      return { version: 'experimental', data: [1, 2, 3] };
    },
    disabled: async () => {
      console.log('Using stable API');
      return { version: 'stable', data: [1, 2] };
    }
  });
  
  console.log('Fetched data:', data);
}

// Execute a function only when feature is enabled
newUI.when(() => {
  console.log('Setting up new UI components');
  
  // Feature checks can be nested
  analyticsEngine.when(() => {
    console.log('Initializing analytics for new UI');
  });
});

// Value selection and transformation
const config = newUI
  .select({
    enabled: { theme: 'dark', maxItems: 20 },
    disabled: { theme: 'light', maxItems: 10 }
  })
  .map({
    enabled: (config) => ({ ...config, version: 'new' }),
    disabled: (config) => ({ ...config, version: 'legacy' })
  });

console.log('Config:', config.value);

// Run the async example
fetchData().catch(console.error); 