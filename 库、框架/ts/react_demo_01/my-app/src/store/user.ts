import { atom } from 'recoil';
import { getLocalStore } from '@/utils/localStore';

// 登录 token
export const user_info = atom<string>({
  key: 'user_info',
  default: getLocalStore('user_info') || '',
});
