/*
 * @Descripttion: 项目配置文件，导出一个 JS 对象
 * @Author: 温祖彪
 * @Date: 2020-05-03 10:13:15
 * @LastEditTime: 2020-05-06 22:18:24
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
          { text: "DOM", link: "/ES/DOM/" },
          { text: "DOMTwo", link: "/ES/DOMTwo/" }
        ]
      },
      {
        text: "CSS",
        items: [
          { text: "CSS基础", link: "/CSS/CSS基础/" },
          { text: "CSS属性", link: "/CSS/CSS属性/" },
          { text: "CSS3", link: "/CSS/CSS3/" }
        ]
      },
      {
        text: "Vue 系列",
        items: [
          { text: "Vue", link: "/Vue/Vue/" },
          { text: "VueRouter", link: "/Vue/VueRouter/" },
          { text: "Vuex", link: "/Vue/Vuex/" },
          { text: "axios", link: "/Vue/axios/" }
        ]
      },
      {
        text: "其他",
        items: [
          { text: "git", link: "/Other/git/" },
          { text: "npm", link: "/Other/npm/" }
        ]
      }
    ],
    sidebar: "auto",
    sidebarDepth: 2
  }
};
