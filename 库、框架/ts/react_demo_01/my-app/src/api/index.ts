import request from '@/utils/request';

interface LoginParams {
  user_id: string;
  user_pwd: string;
}
interface LoginResult {
  token: string;
  userInfo: object;
}

export const login = (params: LoginParams) => {
  return request<LoginResult>({
    url: '/public/login',
    method: 'POST',
    data: params,
  });
};
