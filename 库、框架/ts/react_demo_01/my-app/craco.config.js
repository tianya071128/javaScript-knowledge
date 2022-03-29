const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig, { env, paths }) => {
      // 解决 svg loader 问题，这种方式似乎不太好，但也没有更好的办法
      // react 的脚手架不尽如意
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      if (oneOfRule) {
        oneOfRule.oneOf.splice(0, 0, {
          test: /\.svg$/,
          include: path.resolve(__dirname, 'src/icons/svg'),
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: 'icon-[name]',
              },
            },
          ],
        });
      }
      return webpackConfig;
    },
  },
  devServer: {
    port: 8080,
    open: false,
    // 代理
    proxy: {
      '/dev-api': {
        target: `http://127.0.0.1:3000`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/dev-api': '',
        },
      },
    },
  },
};
