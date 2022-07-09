import { RouteMeta } from '@/router';
import 'axios';
import 'vue-router';

/** 扩展第三方库的类型 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 隐藏业务层面接口报错 */
    hideBusinessError?: boolean;
    /** 隐藏接口报错 */
    hideError?: boolean;
    /** 不处理的 code 列表 */
    customCode?: string | string[];
  }
}

declare module 'vue-router' {
  // 扩展 vue-router 的 meta 定义
  export interface RouteMeta {
    /** 页面标题 */
    title: string;
    /** 路由等级，用于确定过渡效果 */
    index?: number;
    /** 过渡效果， */
    transition?: 'slide-right' | 'slide-left';
  }
}

/** 扩展第三方库的类型 end */
