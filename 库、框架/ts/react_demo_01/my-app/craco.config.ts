import path from 'path';

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
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
