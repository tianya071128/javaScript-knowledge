import { useUserStore } from '@/store';

export function getLocalStore(key: string) {
  const data = localStorage.getItem(key);

  if (data === null) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

function setLocalStore(key: string, data: any): void {
  if (data === undefined || data === null) return; // 静默失败
  localStorage.setItem(key, JSON.stringify(data));
}

function removeLocalStore(key: string) {
  localStorage.removeItem(key);
}

/** 封装存入 token 方法 */
export function setToken(token: string): void {
  const userSore = useUserStore();
  userSore.setToken(token);
  setLocalStore('token', token);
}
export function getToken(): string | null {
  return getLocalStore('token');
}
export function removeToken(): void {
  const userSore = useUserStore();
  userSore.removeToken();
  removeLocalStore('token');
}
