/** @type {import('jest').Config} */
const config = {
  // 注意这条规则仅针对 pnpm. 因为 pnpm 的 node_moduels 里的包都是一个软链指向 node_moduels 下的 .pnpm
  // 如果是非 pnpm 的包管理器, 规则是 'node_modules\/(?!(lodash-es|bar))'
  transformIgnorePatterns: ['node_modules\/\.pnpm\/(?!(lodash-es|bar))'],
  testEnvironment: 'jsdom',
}

module.exports = config
