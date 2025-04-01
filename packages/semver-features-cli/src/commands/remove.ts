import { prompt } from 'enquirer';
import { Config, readFeaturesJson, writeFeaturesJson } from '../config';
import { findFeatureByName, displayFeatures } from '../utils';
import chalk from 'chalk';
import { FeatureConfig } from 'semver-features-json';

interface RemoveToggleAnswers {
  name: string;
  confirm: boolean;
}

export async function removeToggle(config: Config): Promise<void> {
  try {
    // Read current features
    const featuresData = await readFeaturesJson(config);
    const features: FeatureConfig[] = featuresData.features || [];
    
    if (features.length === 0) {
      console.log(chalk.yellow('No feature toggles found to remove.'));
      return;
    }
    
    // Display current features
    displayFeatures(features);
    
    // Prompt for feature to remove
    const featureNames = features.map(f => f.name);
    
    const { name } = await prompt<Pick<RemoveToggleAnswers, 'name'>>({
      type: 'select',
      name: 'name',
      message: 'Select the feature toggle to remove:',
      choices: featureNames,
    });
    
    const featureToRemove = findFeatureByName(features, name);
    
    if (!featureToRemove) {
      throw new Error(`Feature toggle "${name}" not found`);
    }
    
    // Confirm removal
    const { confirm } = await prompt<Pick<RemoveToggleAnswers, 'confirm'>>({
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to remove the feature toggle "${chalk.bold(name)}"?`,
      initial: false,
    });
    
    if (!confirm) {
      console.log(chalk.yellow('\nRemoval cancelled.'));
      return;
    }
    
    // Remove the feature
    const updatedFeatures = features.filter(f => f.name !== name);
    
    // Update features.json
    await writeFeaturesJson(config, {
      ...featuresData,
      features: updatedFeatures,
    });
    
    console.log(chalk.green('\n✓ Feature toggle removed successfully!'));
    console.log(`\nFeature toggle "${chalk.bold(name)}" has been removed.`);
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error removing feature toggle: ${error.message}`);
    }
    throw error;
  }
} 