import { prompt } from 'enquirer';
import { Config, readFeaturesJson, writeFeaturesJson } from '../config';
import { findFeatureByName, displayFeatures } from '../utils';
import chalk from 'chalk';
import { FeatureConfig } from 'semver-features-json';

interface DeprecateToggleAnswers {
  name: string;
  confirm: boolean;
}

export async function deprecateToggle(config: Config): Promise<void> {
  try {
    // Read current features
    const featuresData = await readFeaturesJson(config);
    const features: FeatureConfig[] = featuresData.features || [];
    
    if (features.length === 0) {
      console.log(chalk.yellow('No feature toggles found to deprecate.'));
      return;
    }
    
    // Filter out already deprecated features
    const activeFeatures = features.filter(f => !f.deprecated);
    
    if (activeFeatures.length === 0) {
      console.log(chalk.yellow('All existing feature toggles are already deprecated.'));
      return;
    }
    
    // Display active features
    console.log(chalk.bold('Active features that can be deprecated:\n'));
    displayFeatures(activeFeatures);
    
    // Prompt for feature to deprecate
    const featureNames = activeFeatures.map(f => f.name);
    
    const { name } = await prompt<Pick<DeprecateToggleAnswers, 'name'>>({
      type: 'select',
      name: 'name',
      message: 'Select the feature toggle to deprecate:',
      choices: featureNames,
    });
    
    const featureToDeprecate = findFeatureByName(features, name);
    
    if (!featureToDeprecate) {
      throw new Error(`Feature toggle "${name}" not found`);
    }
    
    // Confirm deprecation
    const { confirm } = await prompt<Pick<DeprecateToggleAnswers, 'confirm'>>({
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to deprecate the feature toggle "${chalk.bold(name)}"?`,
      initial: false,
    });
    
    if (!confirm) {
      console.log(chalk.yellow('\nDeprecation cancelled.'));
      return;
    }
    
    // Deprecate the feature
    const updatedFeatures = features.map(f => {
      if (f.name === name) {
        return {
          ...f,
          deprecated: true,
        };
      }
      return f;
    });
    
    // Update features.json
    await writeFeaturesJson(config, {
      ...featuresData,
      features: updatedFeatures,
    });
    
    console.log(chalk.green('\n✓ Feature toggle deprecated successfully!'));
    console.log(`\nFeature toggle "${chalk.bold(name)}" has been marked as deprecated.`);
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error deprecating feature toggle: ${error.message}`);
    }
    throw error;
  }
} 