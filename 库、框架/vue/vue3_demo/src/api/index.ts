import request from '@/utils/request';
import { AxiosRequestConfig } from 'axios';

export interface CarouselsItem {
  /** 轮播图图片地址 */
  carouselUrl: string;
  /** 跳转地址 */
  redirectUrl: string;
}

export interface GoodsesItem {
  /** id */
  goodsId: number;
  /** 产品图片地址 */
  goodsCoverImg: string;
  /** 标题 */
  goodsName: string;
  /** 金额 */
  sellingPrice: number;
}

interface HomeResult {
  /** 首页轮播图数据 */
  carousels: CarouselsItem[];
  /** 首页新品上线推荐 */
  newGoodses: GoodsesItem[];
  /** 首页热门商品 */
  hotGoodses: GoodsesItem[];
  /** 首页最新推荐 */
  recommendGoodses: GoodsesItem[];
}

export const getHome = () => {
  return request<HomeResult>({
    url: '/index-infos',
    method: 'GET',
  });
};

export interface LoginParams {
  /** 用户名 */
  loginName: string;
  /** 密码 */
  passwordMd5: string;
}

export const login = (data: LoginParams) => {
  return request<string>({
    url: '/user/login',
    method: 'POST',
    data,
  });
};

export interface ProductDetailResult {
  goodsCarouselList: string[];
  goodsName: string;
  sellingPrice: number;
  goodsDetailContent: string;
}

export const getDetail = (id: string) => {
  return request<ProductDetailResult>({
    url: `/goods/detail/${id}`,
    method: 'GET',
  });
};

export interface CartItem {
  /** id */
  goodsId: number;
  /** 产品图片地址 */
  goodsCoverImg: string;
  /** 标题 */
  goodsName: string;
  /** 金额 */
  sellingPrice: number;
  /** 购物项 id */
  cartItemId: number;
  /**  */
  goodsCount: number;
}

export const getCart = (config?: AxiosRequestConfig) => {
  return request<CartItem[]>({
    url: `shop-cart`,
    method: 'GET',
    ...config,
  });
};

interface AddCartParams {
  goodsCount: number;
  goodsId: string;
}
export const addCart = (data: AddCartParams, config?: AxiosRequestConfig) => {
  return request<any[]>({
    url: `shop-cart`,
    method: 'POST',
    data,
    ...config,
  });
};

interface ModifyCartParams {
  /** 购物车 id */
  cartItemId: number;
  /** 购物车商品数量 */
  goodsCount: number;
}
export const modifyCart = (data: ModifyCartParams) => {
  return request<any[]>({
    url: `shop-cart`,
    method: 'PUT',
    data,
    isLoading: '修改中...',
  });
};

export const deleteCartItem = (id: number) => {
  return request<any[]>({
    url: `/shop-cart/${id}`,
    method: 'DELETE',
    isLoading: '删除中...',
  });
};

export interface UserInfoRsult {
  /** 个性签名 */
  introduceSign: string;
  /** 登录名 */
  loginName: string;
  /** 昵称 */
  nickName: string;
}
export const getUserInfo = () => {
  return request<UserInfoRsult>({
    url: '/user/info',
    method: 'GET',
  });
};

export const EditUserInfo = (data: {
  introduceSign: string;
  nickName: string;
}) => {
  return request<void>({
    url: '/user/info',
    method: 'PUT',
    data,
    isLoading: '保存中...',
  });
};

interface AddressItem {
  /** id */
  addressId: number;
  /** 收件人姓名 */
  userName: string;
  /** 收件人电话 */
  userPhone: string;
  /** 省 */
  provinceName: string;
  /** 市 */
  cityName: string;
  /** 区 */
  regionName: string;
  /** 详细地址 */
  detailAddress: string;
  /** 是否为默认地址 0(否) | 1(是) */
  defaultFlag: 0 | 1;
}
export const getAddressList = () => {
  return request<AddressItem[]>({
    url: 'address',
    method: 'GET',
    params: { pageNumber: 1, pageSize: 1000 },
  });
};

export interface AddressParams {
  userName: string;
  userPhone: string;
  provinceName: string;
  cityName: string;
  regionName: string;
  detailAddress: string;
  defaultFlag: number;
}
export const addAddress = (data: AddressParams) => {
  return request<AddressItem[]>({
    url: 'address',
    method: 'POST',
    data,
    isLoading: '保存中...',
  });
};
