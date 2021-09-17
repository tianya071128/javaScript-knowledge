/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-17 10:34:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-17 11:23:43
 */
import request from '@/utils/request';

export function test(params, config) {
  return request.get('http://localhost:3000/v1/test/get', {
    params,
    loading: true,
    ...config,
  });
}
