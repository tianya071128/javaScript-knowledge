/*
 * @Descripttion: 项目配置文件，导出一个 JS 对象
 * @Author: 温祖彪
 * @Date: 2020-05-03 10:13:15
 * @LastEditTime: 2020-05-05 20:03:06
 */

module.exports = {
  title: "API",
  description: "Just playing around",
  themeConfig: {
    nav: [
      {
        text: "ES",
        items: [
          { text: "ES", link: "/ES/ES/" },
          { text: "BOM", link: "/ES/BOM/" },
          { text: "DOM", link: "/ES/DOM/" }
        ]
      },
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
