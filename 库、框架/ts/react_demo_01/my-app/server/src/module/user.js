const users = [
  {
    user_id: 'admin',
    user_pwd: '123456',
    routeList: [
      {
        path: '/',
        id: '1',
        title: '首页',
        element: 'home',
      },
      {
        title: '嵌套路由',
        id: '6',
        children: [
          {
            id: '2',
            path: '/test',
            title: '嵌套路由1',
            element: 'test',
          },
        ],
      },
    ],
  },
];

module.exports = {
  getUsers(user_id, user_pwd) {
    const user = users.find((item) => {
      return (
        item.user_id === user_id && (!user_pwd || item.user_pwd || user_pwd)
      );
    });

    // 去除敏感信息
    if (user) {
      delete user.user_pwd;
    }

    return user;
  },
};
