/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-10 12:10:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-16 23:52:42
 */
const RouterInfo = require('../module/routerInfo');
const { getuuid, omitProp } = require('../utils');

// 'A' 超级管理员 | 'B' 管理员 | 'C' 游客

/**
 * 根据 id 查找菜单列表
 */
const getMenuRouteInfo = function (id, menus) {
  let result;
  const recursion = function () {
    for (const menu of menus) {
      if (id === menu.id) {
        // 取得结果，结束递归
        result = menu;
        throw new Error('抛出错误，提前结束递归，取巧');
      } else if (Array.isArray(menu.children)) {
        // 存在子菜单，继续递归
        recursion(menu.children);
      }
    }
  };

  try {
    recursion();
  } catch (e) {
    if (result) {
      return result;
    }
  }
};

module.exports = {
  // 获取路由
  async getRouterInfoController(ctx) {
    const res = await RouterInfo.findOne({
      user_type: ctx.userInfo?.user_type,
    });
    ctx.body = res?.router_info;
  },
  // 编辑路由
  async resolveRouterInfoController(ctx) {
    const res = await RouterInfo.findOne({
      user_type: 'A',
    });
    const { id, parent } = ctx.request.body;
    if (!id && !parent) {
      // 则是新增顶级路由
      res.router_info.push({
        id: getuuid(),
        ...ctx.request.body,
      });
      await res.save();
    } else if (!id && parent) {
      // 新增次级路由
      const parentMenu = getMenuRouteInfo(parent.id, res.router_info);
      if (parentMenu) {
        (parentMenu.children || (parentMenu.children = [])).push({
          ...omitProp(ctx.request.body, ['parent']),
          id: getuuid(),
        });
        parentMenu.title = '配置测试';
      }
      await RouterInfo.updateOne(
        { id: res._id },
        { router_info: res.router_info }
      );
    }
    ctx.body = {
      message: 'ok',
    };
  },
};
