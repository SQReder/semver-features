import { format } from 'date-fns';
import { validateAndAssertConfig } from 'semver-features-json';
import { FeatureConfig } from 'semver-features-json';
import { z } from 'zod';
import chalk from 'chalk';

// Feature name validation schema
export const featureNameSchema = z
  .string()
  .min(1)
  .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, {
    message: 'Feature name must start with a letter and contain only alphanumeric characters, underscores, or hyphens',
  });

// Version range validation schema
export const versionRangeSchema = z.string().min(1);

// Utils for feature name validation
export function validateFeatureName(name: string): boolean {
  const result = featureNameSchema.safeParse(name);
  return result.success;
}

// Utils for features JSON validation
export function validateFeaturesJson(data: unknown): boolean {
  try {
    validateAndAssertConfig(data);
    return true;
  } catch (error) {
    return false;
  }
}

// Create a new feature object
export function createFeature(
  name: string,
  description: string,
  versionRange: string,
  deprecated = false
): FeatureConfig {
  return {
    name,
    description,
    versionRange,
    deprecated,
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  };
}

// Find feature by name
export function findFeatureByName(features: FeatureConfig[], name: string): FeatureConfig | undefined {
  return features.find((feature) => feature.name === name);
}

// Format feature for display
export function formatFeature(feature: FeatureConfig): string {
  const deprecatedTag = feature.deprecated ? ` ${chalk.red('(DEPRECATED)')}` : '';
  
  return [
    `${chalk.bold(feature.name)}${deprecatedTag}`,
    `  ${chalk.dim('Description:')} ${feature.description}`,
    `  ${chalk.dim('Version Range:')} ${feature.versionRange}`,
    feature.createdAt ? `  ${chalk.dim('Created:')} ${feature.createdAt}` : '',
  ].filter(Boolean).join('\n');
}

// Display features list
export function displayFeatures(features: FeatureConfig[]): void {
  if (features.length === 0) {
    console.log(chalk.yellow('No features found.'));
    return;
  }
  
  console.log(chalk.bold(`Found ${features.length} feature(s):\n`));
  features.forEach((feature, index) => {
    console.log(formatFeature(feature));
    if (index < features.length - 1) {
      console.log('');
    }
  });
} 