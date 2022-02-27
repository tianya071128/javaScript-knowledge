import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig<D = any> {
    hideBusinessError?: boolean;
  }
}
