<script setup lang="ts" name="Home">
import { prefixUrl } from '@/utils';
import { onScroll } from '@/utils/DOMEvent';
import { getToken } from '@/utils/localStore';
import { onMounted, onUnmounted, ref } from 'vue';
import swiper from '@/components/Swiper.vue';
import { type CarouselsItem, type GoodsesItem, getHome } from '@/api';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';

/**
 * 导航栏登录后替换一下
 * 底部 tab 栏
 */

const token = getToken();
const isLogin = ref<boolean>(!!token);
const router = useRouter();

/**
 * 头部导航栏滚动逻辑：滚动至指定位置后添加导航栏背景颜色 and 组件销毁后不监听页面滚动事件
 */
const opacity = ref<number>(0);
const unScroll = onScroll(
  (n) => {
    const h = (175 * document.documentElement.clientWidth) / 375;
    opacity.value = n > h ? 1 : n / h;
  },
  { immediate: true }
);
onUnmounted(() => {
  unScroll();
});

/**
 * 轮播图逻辑：获取首页数据接口处赋值即可
 */
const swiperList = ref<CarouselsItem[]>([]); // 轮播图列表

/**
 * 类别：定义数据(不需要定义为响应数据)，以及点击回调
 */
const categoryList = [
  {
    name: '新蜂超市',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
    categoryId: 100001,
  },
  {
    name: '新蜂服饰',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
    categoryId: 100003,
  },
  {
    name: '全球购',
    imgUrl:
      'https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png',
    categoryId: 100002,
  },
  {
    name: '新蜂生鲜',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png',
    categoryId: 100004,
  },
  {
    name: '新蜂到家',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png',
    categoryId: 100005,
  },
  {
    name: '充值缴费',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png',
    categoryId: 100006,
  },
  {
    name: '9.9元拼',
    imgUrl: 'https://s.yezgea02.com/1604041127880/9.9%402x.png',
    categoryId: 100007,
  },
  {
    name: '领劵',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png',
    categoryId: 100008,
  },
  {
    name: '省钱',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png',
    categoryId: 100009,
  },
  {
    name: '全部',
    imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png',
    categoryId: 100010,
  },
];
const tips = () => {
  Toast('敬请期待');
};

/**
 * 新品上线：接口获取数据
 */
const newGoodses = ref<GoodsesItem[]>([]); // 新品上线列表
const hotGoodses = ref<GoodsesItem[]>([]); // 热门商品列表
const recommendGoodses = ref<GoodsesItem[]>([]); // 热门商品列表
const loading = ref<boolean>(true); // 是否正在加载数据
const goToDetail = (item: GoodsesItem) => {
  router.push({
    name: 'Product',
    params: {
      productId: item.goodsId,
    },
  });
};
/** 初始化首页数据 */
onMounted(async () => {
  const data = await getHome();

  swiperList.value = data.carousels;
  newGoodses.value = data.newGoodses;
  hotGoodses.value = data.hotGoodses;
  recommendGoodses.value = data.recommendGoodses;
  loading.value = false;
});
</script>

<template>
  <div class="sl-home">
    <header
      class="home-header wrap"
      :class="{ active: opacity === 1 }"
      :style="{ backgroundColor: `rgba(27, 174, 174, ${opacity})` }"
    >
      <router-link tag="i" to="./category">
        <i class="nbicon nbmenu2"></i>
      </router-link>
      <div class="header-search">
        <span class="app-name">新蜂商城</span>
        <i class="iconfont icon-search"></i>
        <router-link
          tag="span"
          class="search-title"
          to="./product-list?from=home"
        >
          山河无恙，人间皆安
        </router-link>
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!isLogin">
        登录
      </router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o" />
      </router-link>
    </header>
    <!-- 轮播图 -->
    <swiper :list="swiperList" />
    <!-- 类别 -->
    <div class="category-list">
      <div v-for="item in categoryList" :key="item.categoryId" @click="tips">
        <img :src="item.imgUrl" alt="" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 新品上线 -->
    <div class="good">
      <header class="good-header">新品上线</header>
      <!-- 骨架屏 -->
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in newGoodses"
            :key="item.goodsId"
            @click="goToDetail(item)"
          >
            <img :src="prefixUrl(item.goodsCoverImg)" alt="" />
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <!-- 热门商品 -->
    <div class="good">
      <header class="good-header">热门商品</header>
      <!-- 骨架屏 -->
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in hotGoodses"
            :key="item.goodsId"
            @click="goToDetail(item)"
          >
            <img :src="prefixUrl(item.goodsCoverImg)" alt="" />
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <!-- 最新推荐 -->
    <div class="good">
      <header class="good-header">最新推荐</header>
      <!-- 骨架屏 -->
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div
            class="good-item"
            v-for="item in recommendGoodses"
            :key="item.goodsId"
            @click="goToDetail(item)"
          >
            <img :src="prefixUrl(item.goodsCoverImg)" alt="" />
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../common/style/mixin';
.sl-home {
  padding-bottom: 100px;
}
.home-header {
  position: fixed;
  left: 0;
  top: 0;
  .wh(100%, 50px);
  .fj();
  line-height: 50px;
  padding: 0 15px;
  .boxSizing();
  font-size: 15px;
  color: #fff;
  z-index: 10000;
  background-color: rgba(27, 174, 174, 0);
  transition: background 0.3s;
  .nbmenu2 {
    color: @primary;
  }
  &.active {
    background: @primary;
    .nbmenu2 {
      color: #fff;
    }
    .login {
      color: #fff;
    }
  }

  .header-search {
    display: flex;
    .wh(74%, 20px);
    line-height: 20px;
    margin: 10px 0;
    padding: 5px 0;
    color: #232326;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    .app-name {
      padding: 0 10px;
      color: @primary;
      font-size: 20px;
      font-weight: bold;
      border-right: 1px solid #666;
    }
    .icon-search {
      padding: 0 10px;
      font-size: 17px;
    }
    .search-title {
      font-size: 12px;
      color: #666;
      line-height: 21px;
    }
  }
  .icon-iconyonghu {
    color: #fff;
    font-size: 22px;
  }
  .login {
    color: @primary;
    line-height: 52px;
    .van-icon-manager-o {
      font-size: 20px;
      vertical-align: -3px;
    }
  }
}
.category-list {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 13px;
  div {
    display: flex;
    flex-direction: column;
    width: 20%;
    text-align: center;
    img {
      .wh(36px, 36px);
      margin: 13px auto 8px auto;
    }
  }
}
.good {
  .good-header {
    background: #f9f9f9;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: @primary;
    font-size: 16px;
    font-weight: 500;
  }
  .good-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .good-item {
      box-sizing: border-box;
      width: 50%;
      border-bottom: 1px solid #e9e9e9;
      padding: 10px 10px;
      img {
        display: block;
        width: 120px;
        margin: 0 auto;
      }
      .good-desc {
        text-align: center;
        font-size: 14px;
        padding: 10px 0;
        .title {
          color: #222333;
        }
        .price {
          color: @primary;
        }
      }
      &:nth-child(2n + 1) {
        border-right: 1px solid #e9e9e9;
      }
    }
  }
}
.floor-list {
  width: 100%;
  padding-bottom: 50px;
  .floor-head {
    width: 100%;
    height: 40px;
    background: #f6f6f6;
  }
  .floor-content {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    .boxSizing();
    .floor-category {
      width: 50%;
      padding: 10px;
      border-right: 1px solid #dcdcdc;
      border-bottom: 1px solid #dcdcdc;
      .boxSizing();
      &:nth-child(2n) {
        border-right: none;
      }
      p {
        font-size: 17px;
        color: #333;
        &:nth-child(2) {
          padding: 5px 0;
          font-size: 13px;
          color: @primary;
        }
      }
      .floor-products {
        .fj();
        width: 100%;
        img {
          .wh(65px, 65px);
        }
      }
    }
  }
}
</style>
