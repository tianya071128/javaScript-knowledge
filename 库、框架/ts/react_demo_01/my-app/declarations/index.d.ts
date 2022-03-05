import { RouteMeta } from '@/router';
import 'axios';
import 'react-router-dom';

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

declare module 'react-router-dom' {
  export interface RouteObject {
    meta?: RouteMeta;
  }
}
/** 扩展第三方库的类型 end */
