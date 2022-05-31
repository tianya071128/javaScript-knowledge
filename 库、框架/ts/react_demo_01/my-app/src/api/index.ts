import request from '@/utils/request';

interface LoginParams {
  user_id: string;
  user_pwd: string;
}
export interface RouteInfo {
  /** 唯一标识 */
  id: string;
  /** 菜单名 */
  title: string;
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
    // routeList: RouteInfo[];
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
