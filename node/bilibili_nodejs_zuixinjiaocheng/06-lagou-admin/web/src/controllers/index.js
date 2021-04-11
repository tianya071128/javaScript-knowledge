/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-04-11 17:15:54
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-11 23:02:50
 */
import indexTpl from '../views/index.art';
import signinTpl from '../views/signin.art';
import usersTpl from '../views/users.art';

const htmlIndex = indexTpl({});
const htmlSignin = signinTpl({});

const getRouter = (function () {
  const router = null;
  return function () {
    if (!router) return require('../router').default;

    return router;
  }
})();

const _handleSubmit = () => {
  getRouter().go('/index');
}

// 添加用户回调
const _signup = function () {
  const $btnClose = $('#users-close');

  // 提交表单
  const data = $('#users-form').serialize();
  console.log(data);
  $.ajax({
    url: '/api/users/signup',
    type: 'post',
    data,
    success(res) {
      console.log(res);
    }
  })

  $btnClose.click();
}

export const index = (req, res, next) => {
  res.render(htmlIndex);

  $(window, '.wrapper').resize();

  // 填充用户列表
  $('#content').html(usersTpl());

  // 点击保存, 添加用户
  $('#users-save').on('click', _signup);
}


export const signin = (req, res, next) => {
  console.log('测试');
  res.render(htmlSignin);

  $('#signin').on('click', _handleSubmit)
}