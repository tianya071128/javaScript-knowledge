import { atom } from 'recoil';
import { getToken } from '@/utils/cookies';

export const user_token = atom<string>({
  key: 'user_token',
  default: getToken() || '123',
});
