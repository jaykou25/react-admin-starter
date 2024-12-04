import { defineConfig } from 'umi'
const proxy = require('./proxy')

export default defineConfig({
  proxy: proxy['dev'],
  mako: {},
  npmClient: 'pnpm',
  plugins: [
    '@umijs/plugins/dist/initial-state.js',
    '@umijs/plugins/dist/model.js',
  ],
  model: {},
  initialState: {},
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//, /columns/i, /\.[jt]s$/],
  },
})
