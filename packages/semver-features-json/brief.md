I want to make strong typed feature toggling library based on semver-features from one side, but with strong typed features registration based on json file

somewhat like

```ts
import featuresData from 'features.json' asserts 'json';

const features = SemverFeatures(featuresData)

const feature =  features.get('Feature1') // feature name is strong typed by json file data
```