// 该文件仅仅是一个示例文件.
// 请在当前目录下新建一个 proxy.ts 文件.
// 由于 ip 敏感, proxy.ts 文件已添加到 gitignore 中, 不提交.
module.exports = {
  dev: {
    '/api/': {
      target: 'http://0.0.0.0:9100/',
      changeOrigin: true,
    },
    '/auth/': {
      target: 'http://0.0.0.0:9100/',
      changeOrigin: true,
    },
  },
}
