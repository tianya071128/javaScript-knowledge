import { defineConfig } from 'vite';
import * as path from 'path';

import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend()],
  server: {
    proxy: {
      '/v1': 'http://backend-api-01.newbee.ltd/api',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
