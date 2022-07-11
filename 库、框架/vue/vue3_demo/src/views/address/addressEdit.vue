<script setup lang="ts" name="AddressEdit">
import { addAddress } from '@/api';
import { getAreaList } from '@/common/js';
import slHeader from '@/components/Header.vue';
import { AddressEditInfo, Toast, type AreaList } from 'vant';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const areaList = ref<AreaList>(getAreaList());
const addressId = ref<string | undefined>(
  route.query.addressId as unknown as string | undefined
);
const addressInfo = ref<Partial<AddressEditInfo>>({
  name: '',
  tel: '',
  province: '',
  city: '',
  county: '',
  addressDetail: '',
  areaCode: '',
  isDefault: false,
});
const onSave = async (content: Required<AddressEditInfo>) => {
  const params = {
    userName: content.name,
    userPhone: content.tel,
    provinceName: content.province,
    cityName: content.city,
    regionName: content.county,
    detailAddress: content.addressDetail,
    defaultFlag: content.isDefault ? 1 : 0,
  };

  await addAddress(params);
  Toast({
    duration: 1000,
    message: '保存成功',
    onClose() {
      router.back();
    },
  });
};
const onDelete = () => {};
</script>

<template>
  <div class="address-edit-box">
    <sl-header />
    <van-address-edit
      :area-list="areaList"
      :show-delete="!!addressId"
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      :address-info="addressInfo"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<style lang="less" scoped>
@import '@/common/style/mixin';
.edit {
  .van-field__body {
    textarea {
      height: 26px !important;
    }
  }
}
.address-edit-box {
  .van-address-edit {
    .van-button--danger {
      background: @primary;
      border-color: @primary;
    }
    .van-switch--on {
      background: @primary;
    }
  }
}
</style>
