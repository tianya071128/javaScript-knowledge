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
const getMenuRouteInfo = function (id, menus, flag) {
  let result;
  const recursion = function (menus, parentMenu) {
    let i = 0;
    for (const menu of menus) {
      if (id === menu.id) {
        // 取得结果，结束递归
        result = flag ? { index: i, parentMenu, menu } : menu;
        throw new Error('抛出错误，提前结束递归，取巧');
      } else if (Array.isArray(menu.children)) {
        // 存在子菜单，继续递归
        recursion(menu.children, menu);
      }
      i++;
    }
  };

  try {
    recursion(menus, menus);
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
      }
      await RouterInfo.updateOne(
        { id: res._id },
        { router_info: res.router_info }
      );
    } else if (id) {
      // 编辑菜单
      // console.log(ctx.request.body);
      const { index, parentMenu, menu } =
        getMenuRouteInfo(id, res.router_info, true) || {};

      if (parentMenu) {
        (Array.isArray(parentMenu) ? parentMenu : parentMenu.children).splice(
          index,
          1,
          { ...menu, ...omitProp(ctx.request.body, ['children']) }
        );
        await RouterInfo.updateOne(
          { id: res._id },
          { router_info: res.router_info }
        );
      }
    }
    // await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve();
    //   }, 2000);
    // });
    ctx.body = {
      router_info: res.router_info,
    };
  },
  // 删除路由
  async deleteRouterInfoController(ctx) {
    const res = await RouterInfo.findOne({
      user_type: 'A',
    });
    const { id } = ctx.request.body;
    const { index, parentMenu } =
      getMenuRouteInfo(id, res.router_info, true) || {};

    if (parentMenu) {
      (Array.isArray(parentMenu) ? parentMenu : parentMenu.children).splice(
        index,
        1
      );
      await RouterInfo.updateOne(
        { id: res._id },
        { router_info: res.router_info }
      );
    }
    ctx.body = {
      router_info: res.router_info,
    };
  },
};
