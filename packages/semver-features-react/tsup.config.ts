import sharedConfig from '@repo/tsup-config'
import { defineConfig } from 'tsup';

export default defineConfig({
  ...sharedConfig,
  entry: ['src/index.ts'],
  format: ['esm'],
});
