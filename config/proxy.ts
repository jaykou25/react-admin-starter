module.exports = {
  dev: {
    "/api/": {
      target: "http://10.20.10.165:9200/", // 新测试环境
      // target: 'https://zyjy.wxmetro.net/', // 生产环境
      // target: 'http://10.80.5.146:9100/', // 陈建超
      changeOrigin: true,
    },
    "/auth/": {
      target: "http://10.20.10.165:9200/", // 新测试环境
      // target: 'https://zyjy.wxmetro.net/', // 生产环境
      // target: 'http://10.80.5.146:9100/', // 陈建超
      changeOrigin: true,
    },
  },
};
