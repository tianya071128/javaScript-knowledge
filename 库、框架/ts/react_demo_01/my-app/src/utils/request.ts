import axios, { AxiosRequestConfig } from 'axios';
import { getRecoil } from 'recoil-nexus';

import { user_token } from '@/store/user';

const service = axios.create({
  baseURL: '/dev-api', // baseURL
  timeout: 5000, // 5秒超时
});

// 请求拦截器
service.interceptors.request.use((config: AxiosRequestConfig) => {
  // 从 Recoil 状态库中读取 token
  const token = getRecoil(user_token);
  if (token) {
    config.headers!['X-Token'] = token;
  }
  return config;
});
