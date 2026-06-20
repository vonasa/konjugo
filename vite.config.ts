import { defineConfig } from 'vitest/config';

// On GitHub Pages this is served from https://<owner>.github.io/konjugo/,
// so the production base must be the repo subpath. Dev serves from root.
// NOTE: if you name the repo something other than "konjugo", change this.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/konjugo/' : '/',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
