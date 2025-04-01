import { prompt } from 'enquirer';
import { Config, readFeaturesJson, writeFeaturesJson } from '../config';
import { validateFeatureName, createFeature, featureNameSchema, versionRangeSchema, findFeatureByName } from '../utils';
import chalk from 'chalk';
import { FeatureConfig } from 'semver-features-json';

interface AddToggleAnswers {
  name: string;
  description: string;
  versionRange: string;
}

export async function addToggle(config: Config): Promise<void> {
  try {
    // Read current features
    const featuresData = await readFeaturesJson(config);
    const features: FeatureConfig[] = featuresData.features || [];
    
    // Prompt for feature information
    const answers = await prompt<AddToggleAnswers>([
      {
        type: 'input',
        name: 'name',
        message: 'Enter feature toggle name:',
        validate: (value) => {
          if (!validateFeatureName(value)) {
            return 'Feature name must start with a letter and contain only alphanumeric characters, underscores, or hyphens';
          }
          
          // Check if the feature already exists
          if (findFeatureByName(features, value)) {
            return `A feature with name "${value}" already exists`;
          }
          
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter feature description:',
        validate: (value) => value.trim().length > 0 || 'Description is required',
      },
      {
        type: 'input',
        name: 'versionRange',
        message: 'Enter version range (e.g., ">=1.0.0", "1.x", etc.):',
        validate: (value) => {
          const result = versionRangeSchema.safeParse(value);
          return result.success || 'Version range is required';
        },
      },
    ]);
    
    // Create new feature
    const newFeature = createFeature(
      answers.name,
      answers.description,
      answers.versionRange
    );
    
    // Add to features list
    features.push(newFeature);
    
    // Update features.json
    await writeFeaturesJson(config, {
      ...featuresData,
      features,
    });
    
    console.log(chalk.green('\n✓ Feature toggle added successfully!'));
    console.log(`\nFeature toggle "${chalk.bold(newFeature.name)}" has been added.`);
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error adding feature toggle: ${error.message}`);
    }
    throw error;
  }
} 