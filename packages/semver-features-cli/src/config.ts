import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';
import path from 'path';
import fs from 'fs-extra';

// Config schema
const configSchema = z.object({
  featuresJsonPath: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

// Default config
const defaultConfig: Config = {
  featuresJsonPath: 'features.json',
};

export async function loadConfig(): Promise<Config> {
  try {
    // Initialize cosmiconfig
    const explorer = cosmiconfig('semver-features');
    
    // Search for configuration
    const result = await explorer.search();
    
    // If no config found, use default
    if (!result || result.isEmpty) {
      return defaultConfig;
    }
    
    // Validate config
    const validated = configSchema.safeParse(result.config);
    
    if (!validated.success) {
      throw new Error(
        `Invalid configuration: ${validated.error.errors.map(e => e.message).join(', ')}`
      );
    }
    
    // Merge with defaults
    return {
      ...defaultConfig,
      ...validated.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading configuration: ${error.message}`);
    }
    throw error;
  }
}

export function getFeaturesJsonPath(config: Config): string {
  const featuresPath = config.featuresJsonPath || defaultConfig.featuresJsonPath!;
  return path.resolve(process.cwd(), featuresPath);
}

export async function readFeaturesJson(config: Config): Promise<any> {
  const featuresPath = getFeaturesJsonPath(config);
  
  try {
    const exists = await fs.pathExists(featuresPath);
    
    if (!exists) {
      return { features: [] };
    }
    
    const content = await fs.readJson(featuresPath);
    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error reading features.json: ${error.message}`);
    }
    throw error;
  }
}

export async function writeFeaturesJson(config: Config, data: any): Promise<void> {
  const featuresPath = getFeaturesJsonPath(config);
  
  try {
    await fs.writeJson(featuresPath, data, { spaces: 2 });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error writing features.json: ${error.message}`);
    }
    throw error;
  }
} 