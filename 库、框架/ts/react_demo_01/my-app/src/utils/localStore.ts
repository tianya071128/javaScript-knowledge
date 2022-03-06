import { LoginResult } from '@/api';

function getLocalStore(key: string) {
  const data = localStorage.getItem(key);

  if (data === null) return null;
  return JSON.parse(data);
}

function setLocalStore(key: string, data: any): void {
  if (data === undefined || data === null) return; // 静默失败
  localStorage.setItem(key, JSON.stringify(data));
}

/** 封装存入 token 方法 */
export function setToken(token: string): void {
  setLocalStore('token', token);
}
export function getToken(): string | null {
  return getLocalStore('token');
}

/** 封装存入 userInfo 信息 */
export function setUserInfo(userInfo: LoginResult['userInfo']): void {
  setLocalStore('userInfo', userInfo);
}
export function getUserInfo(): LoginResult['userInfo'] | null {
  return getLocalStore('userInfo');
}
