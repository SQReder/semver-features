import sharedConfig from '@repo/shared-configs/tsup'
import { defineConfig } from 'tsup';

export default defineConfig({
  ...sharedConfig,
  entry: ['src/index.ts'],
  format: ['esm'],
});
