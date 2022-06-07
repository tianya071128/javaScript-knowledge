import request from '@/utils/request';
import { type FormDataType } from '@/views/routerConfig/EditRouter';

interface LoginParams {
  user_id: string;
  user_pwd: string;
}
export interface RouteInfo {
  /** 唯一标识 */
  id: string;
  /** 菜单名 */
  title: string;
  /** 菜单类型：A(子菜单) | B(路由菜单) */
  menuType: 'A' | 'B';
  /** 菜单跳转路径 */
  path?: string;
  /** 嵌套菜单 */
  children?: RouteInfo[];
  /** 是否不显示在菜单中 */
  hidden?: Boolean;
  /** 当不显示在菜单中，引用的菜单 id */
  activeMenu?: string;
  /** 组件 */
  element?: string;
  /** 图标 */
  icon?: string;
}
export interface LoginResult {
  token: string;
  userInfo: {
    [prop: string]: any;
  };
}

export const login = (params: LoginParams) => {
  return request<LoginResult>({
    url: '/login',
    method: 'POST',
    data: params,
  });
};

export const getRouterInfo = () => {
  return request<RouteInfo[]>({
    url: '/v1/routerInfo',
    method: 'GET',
  });
};

export const editRouterInfo = (params: FormDataType) => {
  return request<void>({
    url: '/v1/routerInfo',
    method: 'POST',
    data: params,
  });
};
