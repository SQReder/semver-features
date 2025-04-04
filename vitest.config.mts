import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['packages/**/src/*'],
      exclude: [
        'packages/**/src/**/index.ts',
        '**/*.d.ts'
      ]
    },
    workspace: ['packages/*'],
  },
})