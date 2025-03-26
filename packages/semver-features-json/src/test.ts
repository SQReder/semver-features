import { createFeatureFlagSystem } from "./index";
import featureFlags from "./feature-flags.json" assert { type: "json" };

const featureFlagSystem = createFeatureFlagSystem(featureFlags.features, "1.3.0");

const isCoolFeatureEnabled = featureFlagSystem.isFeatureEnabled("coolFeature");

console.log(isCoolFeatureEnabled);
 

const enabledFeatures = featureFlagSystem.getEnabledFeatures();

console.log('enabledFeatures', enabledFeatures);

const expiredFeatures = featureFlagSystem.getExpiredFeatures();

console.log('expiredFeatures', expiredFeatures);
