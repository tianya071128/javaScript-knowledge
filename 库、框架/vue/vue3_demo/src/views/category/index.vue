<script setup lang='ts' name="Category">
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();

/**==== 导航栏逻辑 start ====*/
// 跳转首页
const goHome = () => {
  router.push({ path: 'home' })
}
/**==== 导航栏逻辑 end ====*/
</script>

<template>
  <div class="categray">
    <header class="category-header wrap van-hairline--bottom">
      <i class="nbicon nbfanhui" @click="goHome"></i>
      <div class="header-search">
        <i class="nbicon nbSearch"></i>
        <router-link tag="span" class="search-title" to="./product-list?from=category">全场50元起步</router-link>
      </div>
      <i class="iconfont icon-More"></i>
    </header>
    <div class="search-wrap">
      1
    </div>
    <!-- 底部栏 -->
    <nav-bar />
  </div>
</template>

<style lang='less' scoped>
@import '@/common/style/mixin';

.categray {
  .category-header {
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    .fj();
    .wh(100%, 50px);
    line-height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 15px;
    color: #656771;
    z-index: 10000;

    &.active {
      background: @primary;
    }

    .icon-left {
      font-size: 25px;
      font-weight: bold;
    }

    .header-search {
      display: flex;
      width: 80%;
      height: 20px;
      line-height: 20px;
      margin: 10px 0;
      padding: 5px 0;
      color: #232326;
      background: #F7F7F7;
      border-radius: 20px;

      .nbSearch {
        padding: 0 10px 0 20px;
        font-size: 17px;
      }

      .search-title {
        font-size: 12px;
        color: #666;
        line-height: 21px;
      }
    }

    .icon-More {
      font-size: 20px;
    }
  }
}

.search-wrap {
  .fj();
  width: 100%;
  margin-top: 50px;
  background: #F8F8F8;

  .nav-side-wrapper {
    width: 28%;
    height: 100%;
    overflow: hidden;

    .nav-side {
      width: 100%;
      .boxSizing();
      background: #F8F8F8;

      li {
        width: 100%;
        height: 56px;
        text-align: center;
        line-height: 56px;
        font-size: 14px;

        &.active {
          color: @primary;
          background: #fff;
        }
      }
    }
  }

  .search-content {
    width: 72%;
    height: 100%;
    padding: 0 10px;
    background: #fff;
    overflow-y: scroll;
    touch-action: pan-y;

    * {
      touch-action: pan-y;
    }

    .boxSizing();

    .swiper-container {
      width: 100%;

      .swiper-slide {
        width: 100%;

        .category-main-img {
          width: 100%;
        }

        .category-list {
          display: flex;
          flex-wrap: wrap;
          flex-shrink: 0;
          width: 100%;

          .catogory-title {
            width: 100%;
            font-size: 17px;
            font-weight: 500;
            padding: 20px 0;
          }

          .product-item {
            width: 33.3333%;
            margin-bottom: 10px;
            text-align: center;
            font-size: 15px;

            .product-img {
              .wh(30px, 30px);
            }
          }
        }
      }
    }
  }
}
</style>