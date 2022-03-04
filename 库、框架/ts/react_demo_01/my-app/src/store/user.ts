import { atom } from 'recoil';
import { getUserInfo, type UserInfo } from '@/utils/localStore';

// 登录 token
export const user_info = atom<UserInfo>({
  key: 'user_info',
  default: getUserInfo(),
});
