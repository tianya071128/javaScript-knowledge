/*
 * @Descripttion: 项目配置文件，导出一个 JS 对象
 * @Author: 温祖彪
 * @Date: 2020-05-03 10:13:15
 * @LastEditTime: 2020-05-03 14:57:06
 */

module.exports = {
  title: "API",
  description: "Just playing around",
  themeConfig: {
    nav: [
      { text: "ES", link: "/" },
      {
        text: "Vue 系列",
        ariaLabel: "Language Menu",
        items: [
          { text: "Vue", link: "/Vue/Vue/" },
          { text: "VueRouter", link: "/Vue/VueRouter/" },
          { text: "Vuex", link: "/Vue/Vuex/" },
          { text: "axios", link: "/Vue/axios/" }
        ]
      }
    ],
    sidebar: "auto",
    sidebarDepth: 2
  }
};
