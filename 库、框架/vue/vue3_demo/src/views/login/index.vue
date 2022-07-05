<script setup lang="ts" name="Login">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast, type FieldRule } from 'vant';
import vueImgVerify from '@/components/VueImgVerify.vue';
import { login } from '@/api';
import md5 from 'js-md5';
import { setToken } from '@/utils/localStore';

/** 已登录情况下不要进入登录页 */
const router = useRouter();
const route = useRoute();

/** 导航栏 */
const goBack = () => {
  router.back();
};

/** 登录表单 */
type formType = {
  username: string;
  password: string;
  /** 验证码 - 前端校验 */
  verify: string;
};
const form = ref<formType>({
  username: '',
  password: '',
  verify: '',
});
const formRules: { [K in keyof formType]: FieldRule[] } = {
  username: [{ required: true, message: '请填写用户名' }],
  password: [{ required: true, message: '请填写密码' }],
  verify: [
    { required: true, message: '请输入验证码' },
    { pattern: /^[\da-zA-Z]{4}$/, message: '输入4位验证码', trigger: 'onBlur' },
  ],
};
const loading = ref<boolean>(false);
const imgCode = ref('');
const getImgCode = (_imgCode: string) => {
  imgCode.value = _imgCode;
};
// 表单提交
const onSubmit = async () => {
  if (
    form.value.verify.trim().toLocaleLowerCase() !==
    imgCode.value?.trim().toLocaleLowerCase()
  ) {
    Toast.fail('验证码有误');
    return;
  }

  try {
    loading.value = true;
    const data = await login({
      loginName: form.value.username,
      passwordMd5: md5(form.value.password),
    });
    setToken(data);
    // 跳转页面
    router.replace((route.query.from as string) || '/');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <header class="simple-header van-hairline--bottom">
      <i class="nbicon nbfanhui" @click="goBack"></i>
      <div class="simple-header-name">登录</div>
      <i class="nbicon nbmore"></i>
    </header>
    <div class="login-main">
      <img
        class="logo"
        src="https://s.yezgea02.com/1604045825972/newbee-mall-vue3-app-logo.png"
        alt=""
      />
      <!-- 登录表单 -->
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="formRules.username"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="formRules.password"
        />
        <van-field
          v-model="form.verify"
          name="verify"
          label="验证码"
          placeholder="验证码"
          :rules="formRules.verify"
          maxlength="4"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" @getImgCode="getImgCode" />
          </template>
        </van-field>
        <div style="margin: 16px">
          <van-button
            round
            block
            color="#1baeae"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style lang="less">
@import '@/common/style/mixin';
.simple-header {
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
  .simple-header-name {
    font-size: 14px;
  }
}
.login-main {
  padding-top: 44px;
  .logo {
    width: 120px;
    height: 120px;
    display: block;
    margin: 80px auto 20px;
  }
  .login-body {
    padding: 0 20px;
  }
  .login {
    .link-register {
      font-size: 14px;
      margin-bottom: 20px;
      color: #1989fa;
      display: inline-block;
    }
  }
  .register {
    .link-login {
      font-size: 14px;
      margin-bottom: 20px;
      color: #1989fa;
      display: inline-block;
    }
  }
  .verify-bar-area {
    margin-top: 24px;
    .verify-left-bar {
      border-color: #1baeae;
    }
    .verify-move-block {
      background-color: #1baeae;
      color: #fff;
    }
  }
  .verify {
    > div {
      width: 100%;
    }
    display: flex;
    justify-content: center;
    .cerify-code-panel {
      margin-top: 16px;
    }
    .verify-code {
      width: 40% !important;
      float: left !important;
    }
    .verify-code-area {
      float: left !important;
      width: 54% !important;
      margin-left: 14px !important;
      .varify-input-code {
        width: 90px;
        height: 38px !important;
        border: 1px solid #e9e9e9;
        padding-left: 10px;
        font-size: 16px;
      }
      .verify-change-area {
        line-height: 44px;
      }
    }
  }
}
</style>
