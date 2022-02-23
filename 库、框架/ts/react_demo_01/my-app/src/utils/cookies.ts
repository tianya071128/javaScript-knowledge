import Cookies from 'js-cookie';

/** 登录 token */
const TOKEN_KEY = 'Admin-Token';
// 获取 token
export function getToken() {
  return Cookies.get(TOKEN_KEY);
}
// 设置 token
export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token);
}
// 删除 token
export function removeToken() {
  Cookies.remove(TOKEN_KEY);
}
