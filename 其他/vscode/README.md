

## 1. 界面优化

* Chinese (Simplified) Language Pack for Visual Studio Code

  > 中文语言包
  >
  > 使用方法：安装重启即可

* 翻译(英汉词典)

  > 本地翻译
  >
  > 使用方法：安装重启，
  >
  > - 在状态栏中显示选中词的释义，支持驼峰和下划线命名查询
  > - 运行“批量翻译标识符”，批量翻译当前文件中被识别出的标识符，打开并列编辑器并显示翻译后内容

* background

  > 为你的编辑器添加一个背景图片（支持 gif 格式）。
  >
  > 配置：
  >
  > ```json
  > {
  >  "background.useDefault": false, // 是否使用默认图片
  >  "background.customImages": [    // 自定义图片地址，可使用网络图片
  >      "C:/Users/images/1.png",
  >      "C:/Users/images/2.png",
  >      "C:/Users/images/3.png"
  >  ],
  >  "background.style": {           // css 样式
  >      "opacity": 0.4
  >  }
  > }
  > ```

* vscode-icons

  > 将项目中不同类型的文件或文件夹通过图标区分出来。
  >
  > 使用： 
  >
  > `Linux`＆`Windows` `=>` **文件>首选项>文件图标主题>VSCode Icons**

* Bracket Pair ColorZer 2（相较于 Bracket Pair Colorizer，Bracket Pair Colorizer 2 的性能更优）

  > 颜色识别匹配括号, 
  >
  > ![image-20201101102005642](.\image\01.png)
  >
  > 配置：
  >
  > ```json
  > /* Bracket Pair ColorZer 2(颜色匹配括号) 插件配置 */
  > "bracket-pair-colorizer-2.showBracketsInGutter": true,
  > /* End */
  > ```

* indent-rainbow

  > 高亮显示文本前面的缩进，交替使用四种不同的颜色。
  >
  > 配置：
  >
  > ```json
  > "indentRainbow.colors": [ // 高亮颜色
  >     "rgba(40,140,160,0.3)",
  >     "rgba(40,160,140,0.3)",
  >     "rgba(60,140,140,0.3)",
  >     "rgba(60,160,160,0.3)"
  > ],
  > // tabSize 错误时的高亮颜色
  > "indentRainbow.errorColor": "rgba(128,32,32,0.6)",
  > // 混用空格和 tab 缩进时的高亮颜色
  > "indentRainbow.tabmixColor": "rgba(128,32,96,0.6)",
  > // 需要高亮显示的文件类型
  > "indentRainbow.includedLanguages": [
  >     "vue",
  >     "html"
  > ],
  > ```
  >
  > 

* Guides

  > 代码的标签对齐线。
  >

* One Dark Pro

  > 黑暗主题

* Settings Sync

  > 同步 vscode 配置插件
  >




## 2. 前端开发插件

* Auto Close Tag - 必备

  > 自动添加HTML/XML关闭标签

* Auto Rename Tag - 必备

  > 自动重命名配对的标签
  >

* CSS Peek

  > 鼠标放在类名，id上的时候，显示出此类型下的css样式，并可以直接跳转到css文件
  >
  > 使用方法：
  >
  > 1. ctrl + 鼠标移入类名(id 名)：弹框显示类定义
  > 2. 右键单击，显示快捷方式

* px to rem

  > px转rem

* Path Intellisense

  > 路径自动补全
  >

* Live Server

  > 类似搭建本地服务器页面，修改直接生效。
  >
  > 使用方法：html页面下鼠标右键 `open with Live Server`打开的页面就是。
  >



## 3. vue

* vetur

  > - 语法高亮
  > - 片段
  > - Emmet
  > - 整理/错误检查
  > - 格式化
  > - 自动完成
  > - 调试
  >
  > 文档：https://marketplace.visualstudio.com/items?itemName=octref.vetur

* Vue 2 Snippets

  > 提示Vue 2 的 API
  >
  > 文档：https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets



## 4. 工程化

* Git History

  > 查看和搜索git日志以及图形和详细信息。
  >

* GitLens

  > 查看代码作者的身份，无缝地导航和浏览 Git存储库。
  >
  > 文档： https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
  >
  > 使用说明：https://www.cnblogs.com/xiaojianliu/p/12739905.html

* Eslint

  > https://marketplace.visualstudio.com/items?itemName=manuth.eslint-language-service














参考：

* https://juejin.im/post/6856695988518993927#heading-47