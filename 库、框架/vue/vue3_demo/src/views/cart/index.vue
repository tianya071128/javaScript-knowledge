<script setup lang="ts" name="Cart">
import { deleteCartItem, getCart, modifyCart, type CartItem } from '@/api';
import slHeader from '@/components/Header.vue';
import NavBar from '@/components/NavBar.vue';
import { useCartStore } from '@/store';
import { prefixUrl } from '@/utils';
import { Toast } from 'vant';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const getCartData = async () => {
  const data = await getCart({ isLoading: true });
  list.value = data;
};

/**==== 购物车列表 start ====*/
const list = ref<CartItem[]>([]);
onMounted(async () => {
  await getCartData();

  result.value = list.value.map((item) => item.cartItemId);
});

// 添加商品数量
const onChange = (id: number) => {
  return async (value: number) => {
    if (value > 5) {
      Toast.fail('超出单个商品的最大购买数量');
      return false;
    }
    if (value < 1) {
      Toast.fail('商品不得小于0');
      return false;
    }
    if (
      list.value.filter((item) => item.cartItemId === id)[0]?.goodsCount ===
      value
    )
      return false;

    await modifyCart({
      cartItemId: id,
      goodsCount: value,
    });

    for (const item of list.value) {
      if (item.cartItemId === id) {
        item.goodsCount = value;
        break;
      }
    }
    return true;
  };
};

// 删除商品
const cartStore = useCartStore();
const deleteGood = async (id: number) => {
  await deleteCartItem(id);
  cartStore.updateCount('update');
  getCartData();
};

const result = ref<number[]>([]);
const total = computed(() => {
  return list.value
    .filter((item) => result.value.includes(item.cartItemId))
    .reduce((total, item) => {
      return total + item.goodsCount * item.sellingPrice;
    }, 0);
});
const onSubmit = () => {
  if (result.value.length === 0) {
    Toast.fail('请选择商品进行结算');
    return;
  }

  router.push({
    name: 'CreateOrder',
    query: {
      cartItemIds: JSON.stringify(result.value),
    },
  });
};
const checkAll = computed<boolean>({
  get() {
    return list.value.every((item) => result.value.includes(item.cartItemId));
  },
  set(val: boolean) {
    if (val) {
      result.value = list.value.map((item) => item.cartItemId);
    } else {
      result.value = [];
    }
  },
});
/** 购物车列表 end */

const goTo = () => {
  router.push({ path: '/home' });
};
</script>

<template>
  <div class="cart-box">
    <sl-header />
    <!-- 购物车列表 -->
    <div class="cart-body">
      <van-checkbox-group v-model="result">
        <van-swipe-cell
          :right-width="50"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="good-item">
            <van-checkbox :name="item.cartItemId" />
            <div class="good-img">
              <img :src="prefixUrl(item.goodsCoverImg)" alt="" srcset="" />
            </div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.goodsName }}</span>
                <span>x{{ item.goodsCount }}</span>
              </div>
              <div class="good-btn">
                <div class="price">￥{{ item.sellingPrice }}</div>
                <van-stepper
                  integer
                  disable-input
                  :min="1"
                  :max="5"
                  :model-value="item.goodsCount"
                  :before-change="onChange(item.cartItemId)"
                />
              </div>
            </div>
          </div>
          <template #right>
            <van-button
              square
              icon="delete"
              type="danger"
              class="delete-button"
              @click="deleteGood(item.cartItemId)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <!-- 结算栏 -->
    <van-submit-bar
      v-if="list.length > 0"
      class="submit-all van-hairline--top"
      :price="total * 100"
      button-text="结算"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <!-- 购物车没有商品 -->
    <div class="empty" v-if="!list.length">
      <img
        class="empty-cart"
        src="https://s.yezgea02.com/1604028375097/empty-car.png"
        alt="空购物车"
      />
      <div class="title">购物车空空如也</div>
      <van-button round color="#1baeae" type="primary" @click="goTo" block>
        前往选购
      </van-button>
    </div>
    <!-- 底部栏 -->
    <nav-bar />
  </div>
</template>

<style lang="less" scoped>
@import '@/common/style/mixin';

.cart-box {
  .cart-header {
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

    .cart-name {
      font-size: 14px;
    }
  }

  .cart-body {
    margin: 16px 0 100px 0;
    padding-left: 10px;

    .good-item {
      display: flex;

      .good-img {
        img {
          .wh(100px, 100px);
        }
      }

      .good-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;

        .good-title {
          display: flex;
          justify-content: space-between;
        }

        .good-btn {
          display: flex;
          justify-content: space-between;

          .price {
            font-size: 16px;
            color: red;
            line-height: 28px;
          }

          .van-icon-delete {
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }

    .delete-button {
      width: 50px;
      height: 100%;
    }
  }

  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;

    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }

    .van-icon-smile-o {
      font-size: 50px;
    }

    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }

  .submit-all {
    margin-bottom: 50px;

    .van-checkbox {
      margin-left: 10px;
    }

    .van-submit-bar__text {
      margin-right: 10px;
    }

    .van-submit-bar__button {
      background: @primary;
    }
  }

  .van-checkbox__icon--checked .van-icon {
    background-color: @primary;
    border-color: @primary;
  }
}
</style>
