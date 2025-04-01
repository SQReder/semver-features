#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig } from './config';
import { addToggle } from './commands/add';
import { removeToggle } from './commands/remove';
import { deprecateToggle } from './commands/deprecate';
import chalk from 'chalk';

const program = new Command();

async function main() {
  try {
    // Load config
    const config = await loadConfig();

    program
      .name('semver-features')
      .description('CLI to manage feature toggles for semver-features-json')
      .version('0.0.0');

    program
      .command('add')
      .description('Add a new feature toggle')
      .action(async () => {
        await addToggle(config);
      });

    program
      .command('remove')
      .description('Remove an existing feature toggle')
      .action(async () => {
        await removeToggle(config);
      });

    program
      .command('deprecate')
      .description('Deprecate an existing feature toggle')
      .action(async () => {
        await deprecateToggle(config);
      });

    await program.parseAsync(process.argv);
  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
