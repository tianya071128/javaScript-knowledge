<script setup lang="ts" name="Setting">
import { EditUserInfo, getUserInfo, type UserInfoRsult } from '@/api';
import slHeader from '@/components/Header.vue';
import { removeToken } from '@/utils/localStore';
import { Toast } from 'vant';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref<Omit<UserInfoRsult, 'loginName'>>({
  nickName: '',
  introduceSign: '',
});

onMounted(async () => {
  form.value = await getUserInfo();
});

const save = async () => {
  await EditUserInfo(form.value);
  Toast.success('保存成功');
};

const handleLogout = () => {
  removeToken();

  router.replace('home');
};
</script>

<template>
  <div class="seting-box">
    <sl-header />
    <div class="input-item">
      <van-field v-model="form.nickName" label="昵称" />
      <van-field v-model="form.introduceSign" label="个性签名" />
    </div>
    <van-button
      round
      class="save-btn"
      color="#1baeae"
      type="primary"
      @click="save"
      block
    >
      保存
    </van-button>
    <van-button
      round
      class="save-btn"
      color="#1baeae"
      type="primary"
      @click="handleLogout"
      block
    >
      退出登录
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.seting-box {
  .save-btn {
    width: 80%;
    margin: 20px auto;
  }
}
</style>
