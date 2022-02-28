import request from '@/utils/request';

export const login = (params: { user_id: string; user_pwd: string }) => {
  // return request.post('/public/login', params, { hideBusinessError: true });
  return request<number>({
    url: '/public/login',
    method: 'POST',
    params,
    // hideBusinessError: true,
  });
};
