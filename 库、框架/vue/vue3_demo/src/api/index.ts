import request from '@/utils/request';

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
