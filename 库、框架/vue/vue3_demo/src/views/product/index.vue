<script setup lang="ts" name="Product">
import slHeader from '@/components/Header.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetail, addCart, type ProductDetailResult } from '@/api';
import { useCartStore } from '@/store';
import { ErrorObj } from '@/utils/request';
import { Toast } from 'vant';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const id = route.params.productId as unknown as string;

onMounted(async () => {
  detail.value = await getDetail(id);
});

const detail = ref<ProductDetailResult>();
const count = computed(() => cartStore.count);
const goTo = () => {
  router.push('/cart');
};
// 加入购物车
const addCartLoading = ref(false);
const handleAddCart = async () => {
  addCartLoading.value = true;
  try {
    await addCart({
      goodsCount: 1,
      goodsId: id,
    });

    cartStore.updateCount('update');
  } finally {
    addCartLoading.value = false;
  }
};
// 点击立即购买
const toCartLoaing = ref(false);
const goToCart = async () => {
  toCartLoaing.value = true;
  try {
    await addCart(
      {
        goodsCount: 1,
        goodsId: id,
      },
      {
        customCode: '500',
      }
    );

    cartStore.updateCount('update');
    router.push('/cart');
  } catch (e: any) {
    const _e = e as ErrorObj;
    if (_e?.msg?.includes('已存在')) {
      router.push('/cart');
    } else {
      Toast.fail(_e.msg);
    }
  } finally {
    toCartLoaing.value = false;
  }
};
</script>

<template>
  <div class="product-detail">
    <sl-header />
    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" indicator-color="#1baeae">
          <van-swipe-item
            v-for="(item, index) in detail?.goodsCarouselList"
            :key="index"
          >
            <img :src="item" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="product-title">
          {{ detail?.goodsName ?? '' }}
        </div>
        <div class="product-desc">免邮费 顺丰快递</div>
        <div class="product-price">
          <span>¥{{ detail?.sellingPrice || '' }}</span>
        </div>
      </div>
      <div class="product-intro">
        <ul>
          <li>概述</li>
          <li>参数</li>
          <li>安装服务</li>
          <li>常见问题</li>
        </ul>
        <div
          class="product-content"
          v-html="detail?.goodsDetailContent || ''"
        ></div>
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon
        icon="cart-o"
        :badge="!count ? '' : count"
        @click="goTo()"
        text="购物车"
      />
      <van-action-bar-button
        type="warning"
        @click="handleAddCart"
        text="加入购物车"
        :loading="addCartLoading"
        loading-text="加入购物车"
      />
      <van-action-bar-button
        type="danger"
        @click="goToCart"
        text="立即购买"
        :loading="toCartLoaing"
        loading-text="立即购买"
      />
    </van-action-bar>
  </div>
</template>

<style lang="less" scoped>
@import '@/common/style/mixin';
.product-detail {
  .detail-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .fj();
    .wh(100%, 44px);
    line-height: 44px;
    padding: 0 10px;
    .boxSizing();
    color: #252525;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    .product-name {
      font-size: 14px;
    }
  }
  .detail-content {
    height: calc(100vh - 50px);
    overflow: hidden;
    overflow-y: auto;
    .detail-swipe-wrap {
      .my-swipe .van-swipe-item {
        img {
          width: 100%;
          // height: 300px;
        }
      }
    }
    .product-info {
      padding: 0 10px;
      .product-title {
        font-size: 18px;
        text-align: left;
        color: #333;
      }
      .product-desc {
        font-size: 14px;
        text-align: left;
        color: #999;
        padding: 5px 0;
      }
      .product-price {
        .fj();
        span:nth-child(1) {
          color: #f63515;
          font-size: 22px;
        }
        span:nth-child(2) {
          color: #999;
          font-size: 16px;
        }
      }
    }
    .product-intro {
      width: 100%;
      padding-bottom: 50px;
      ul {
        .fj();
        width: 100%;
        margin: 10px 0;
        li {
          flex: 1;
          padding: 5px 0;
          text-align: center;
          font-size: 15px;
          border-right: 1px solid #999;
          box-sizing: border-box;
          &:last-child {
            border-right: none;
          }
        }
      }
      .product-content {
        padding: 0 20px;
        img {
          width: 100%;
        }
      }
    }
  }
  .van-action-bar-button--warning {
    background: linear-gradient(to right, #6bd8d8, @primary);
  }
  .van-action-bar-button--danger {
    background: linear-gradient(to right, #0dc3c3, #098888);
  }
}
</style>
