import { defineConfig } from 'umi'
const proxy = require('./proxy')
const { SITE } = require('../src/utils/constants')

export default defineConfig({
  proxy: proxy['dev'],
  mako: {},
  npmClient: 'pnpm',
  plugins: [
    '@umijs/plugins/dist/initial-state.js',
    '@umijs/plugins/dist/model.js',
    './plugins/modify-html-plugin',
  ],
  model: {},
  title: SITE.name,
  initialState: {},
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//, /columns/i, /\.[jt]s$/],
  },
  base: '/pv',
  publicPath: '/pv/',
})
