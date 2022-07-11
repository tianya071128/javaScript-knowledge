<script setup lang="ts" name="Address">
import { getAddressList } from '@/api';
import slHeader from '@/components/Header.vue';
import { AddressListAddress } from 'vant';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const list = ref<AddressListAddress[]>([]);
const from = ref(route.query.from);
onMounted(async () => {
  const data = await getAddressList();
  list.value = data.map((item) => ({
    id: item.addressId,
    name: item.userName,
    tel: item.userPhone,
    address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
    isDefault: !!item.defaultFlag,
  }));
});
const onAdd = () => {
  router.push('/address-edit');
};
const onEdit = (item: AddressListAddress) => {
  router.push({
    path: 'address-edit',
    query: { type: 'edit', addressId: item.id },
  });
};
</script>

<template>
  <div
    class="address-box"
    :class="{ 'no-select': from === 'mine' || from?.includes('mine') }"
  >
    <sl-header />

    <div class="address-item">
      <van-address-list :list="list" @add="onAdd" @edit="onEdit" />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/common/style/mixin';
.address-box {
  &.no-select :deep(.van-radio__icon) {
    display: none;
  }
  .address-item {
    .van-button {
      background: @primary;
      border-color: @primary;
    }
  }
}
</style>
