#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

async function promptUser() {
  const featureFlag = {};
  
  featureFlag.name = await question('Feature name (camelCase): ');
  featureFlag.description = await question('Description: ');
  featureFlag.versionRange = await question('Version range (e.g. ">=1.2.0 <2.0.0"): ');
  
  const enabledByDefault = await question('Enabled by default? (y/N): ');
  featureFlag.enabledByDefault = enabledByDefault.toLowerCase() === 'y';
  
  const tags = await question('Tags (comma-separated, e.g. "beta,ui"): ');
  featureFlag.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
  
  const owners = await question('Owners (comma-separated, e.g. "team-ui"): ');
  featureFlag.owners = owners ? owners.split(',').map(owner => owner.trim()) : [];
  
  featureFlag.createdAt = new Date().toISOString();
  
  const expiry = await question('Expiry date (YYYY-MM-DD, leave empty for none): ');
  if (expiry) {
    featureFlag.expiresAt = new Date(expiry).toISOString();
  }
  
  return featureFlag;
}

async function main() {
  console.log('🚩 Feature Flag Creator 🚩');
  
  try {
    const configPath = path.resolve(__dirname, 'feature-flags.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    const featureFlag = await promptUser();
    
    // Validate new feature flag name doesn't already exist
    if (config.features.some(f => f.name === featureFlag.name)) {
      console.error(`Error: Feature flag "${featureFlag.name}" already exists!`);
      process.exit(1);
    }
    
    // Add new feature flag
    config.features.push(featureFlag);
    
    // Write updated config back to file
    fs.writeFileSync(
      configPath,
      JSON.stringify(config, null, 2),
      'utf8'
    );
    
    console.log(`✅ Successfully added new feature flag: ${featureFlag.name}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main(); 