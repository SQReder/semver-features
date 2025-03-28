import { createSemverFeaturesJson, getSchema } from './index';

// Sample features.json content
const featuresData = {
  "features": [
    {
      "name": "newUI",
      "description": "New user interface components",
      "versionRange": "1.2.0",
      "enabledByDefault": false
    },
    {
      "name": "analytics",
      "description": "Enhanced analytics engine",
      "versionRange": "1.3.0",
      "tags": ["performance", "tracking"]
    },
    {
      "name": "experimentalApi",
      "description": "Experimental API features",
      "versionRange": "1.5.0-beta.1",
      "deprecated": false
    }
  ]
};

// Demonstrate direct schema usage
const schema = getSchema();
const validationResult = schema.safeParse(featuresData);

if (!validationResult.success) {
  console.error("Validation failed:", validationResult.error.format());
} else {
  console.log("Config is valid!");
}

// Create and initialize
const features = createSemverFeaturesJson(featuresData, { 
  version: '1.3.5'  // Current application version
});

// With our implementation, TypeScript knows which feature names are valid
const newUI = features.get('newUI');  
const analytics = features.get('analytics');

// This would produce a TypeScript error (uncomment to see):
// const invalid = features.get('nonExistentFeature');

// Check if a feature is enabled
console.log('New UI enabled:', newUI?.isEnabled);  // true (1.3.5 >= 1.2.0)
console.log('Analytics enabled:', analytics?.isEnabled);  // true (1.3.5 >= 1.3.0)

// Use with the standard semver-features API
if (newUI) {
  // Execute different code based on feature status
  newUI.execute({
    enabled: () => console.log('Using new UI'),
    disabled: () => console.log('Using classic UI')
  });

  // Select different values based on feature status
  const config = newUI.select({
    enabled: { maxItems: 20, showPreview: true },
    disabled: { maxItems: 10, showPreview: false }
  });

  console.log('Max items:', config.value.maxItems);
}

// Multiple feature combination
if (newUI && analytics) {
  // Execute code when both features are enabled
  console.log('Using new UI with analytics');
}

// List all features
console.log('All features:');
features.dumpFeatures().forEach(feature => {
  console.log(`- ${feature.name}: ${feature.enabled ? 'enabled' : 'disabled'}`);
}); 