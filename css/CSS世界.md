

# CSS 世界 -- 电子书笔记

## 第一章: 概述

* CSS 全称是 Cascading Style Sheets，翻译成中文就是“层叠样式表”。所谓“层叠”，顾名
  思义，就是样式可以层层累加，比方说页面元素都继承了 12 像素的大小，某标题就可以设置成
  14 像素进行叠加。
* CSS 世界的诞生就是为图文信息展示服务的
* \</table>有着自己的世界，“流”的特性对\<table>并不适用，一些 CSS 属性的表现，如单元格的vertical-align，也和普通的元素不一样。本书并不会对\<table>进行专门的介绍，因为毕竟不是同一个世界的。

* 和 CSS2 相比 CSS3 就是一个全新的世界，更加丰富，更加规范，更加体系化，也更加复杂。本书不会深入 CSS3 的知识点。



****



## 第二章: 需提前了解的术语和概念

### 2.1 务必了解的CSS专业术语

```CSS
.vocabulary {
	height: 99px;
	color: transparent;
}
```

* 属性: 例子中的 height 和 color

* 值: 值的分类非常广泛，下面是一些常用的类型

  > * 整数值，如 z-index:1 中的 1，属于\<integer>，同时也属于\<number>。
  > * 数值，如 line-height:1.5 中的 1.5，属于<number>。
  > * 百分比值，如 padding:50%中的 50%，属于\<percent>。
  > * 长度值，如 99px。
  > * 颜色值，如#999。
  > * 还有字符串值、位置值等类型。在 CSS3 新世界中，还有角度值、频率值、时间值
  >   等类型，

* 关键字: 指的是 CSS 里面很关键的单词，示例 CSS 代码中的 transparent就是典型的关键字，还有常见的 solid、inherit 等都是关键字.

* 变量: CSS 中目前可以称为变量的比较有限，CSS3 中的 currentColor 就是变量，非常有用。

* 长度单位: 如 px、em 等.***诸如 2%后面的百分号%不是长度单位。再说一遍，%不是长度单位！因为 2%就是一个完整的值，就是一个整体***. \<number> + 长度单位 = \<length>

  > * 相对长度单位。相对长度单位又分为相对字体长度单位和相对视区长度单位。
  >
  >   > * 相对字体长度单位，如 em 和 ex，还有 CSS3 新世界的 rem 和 ch（字符 0 的宽度）。
  >   > * 相对视区长度单位，如 vh、vw、vmin 和 vmax。
  >
  > * 绝对长度单位：最常见的就是 px，还有 pt、cm、mm、pc 等了解一下就可以，它们实用性近乎零，

* 功能符: 值以函数的形式指定（就是被括号括起来的那种），主要用来表示颜色（rgba 和 hsla）、背景图片地址（url）、元素属性值、计算（calc）和过渡效果等

* 属性值: 属性冒号后面的所有内容统一称为属性值。例如，1px solid rgb(0,0,0)就可以称为属性值，它是由“值+关键字+功能符”构成的。属性值也可以由单一内容构成。例如，z-index:1的 1 也是属性值。

* 声明: 属性名加上属性值就是声明，例如：color: transparent;

* 声明块: 声明块是花括号（{}）包裹的一系列声明, 例如：
  {
    height: 99px;
    color: transparent;
  }

* 规则 或 规则集: 出现了选择器，而且后面还跟着声明块

  .vocabulary {
    height: 99px;
    color: transparent;
  }

* 选择器: 瞄准目标元素

* @规则: @规则指的是以@字符开始的一些规则，像@media、@font-face、@page 或者@support，诸如此类。



****



## 第三章: 流、元素与基本尺寸

### 3.1 块级元素

* 需要注意是，“块级元素”和“display 为 block 的元素”不是一个概念。 块级元素的基本特性: **一个水平流上只能单独显示一个元素，多个块级元素则换行显示**
* 对于非替换元素（见本书第 4 章），当 left/top 或 top/bottom 对立方位的属性值同时存在的时候，元素的宽度表现为“格式化宽度”，**其宽度大小相对于最近的具有定位特性（position 属性值不是 static）的祖先元素计算。**

### 3.2 width/height作用的具体细节

* 对于 height 属性，如果父元素height 为 auto，只要子元素在文档流中，其百分比值完全就被忽略了。
* ***绝对定位元素的百分比计算和非绝对定位元素的百分比计算是有区别的，区别在于绝对定位的宽高百分比计算是相对于 padding box 的，也就是说会把 padding 大小值计算在内，但是，非绝对定位元素则是相对于 content box 计算的。***

### 3.3 CSS min-width/max-width和min-height/max-height
* ```css
  // 通过max-height来实现展开收起动画技术
  .element {
  max-height: 0;
  overflow: hidden;
  transition: max-height .25s;
  }
  .element.active {
  max-height: 666px; /* 一个足够大的最大高度值 */
  }
  ```

### 3.4 内联元素

* inline-block 和 inline-table 都是“内联元素”，因为它们的
  “外在盒子”都是内联盒子。



****



## 第四章: 盒尺寸四大家族

> 盒尺寸中的 4 个盒子 content box、padding box、border box 和 margin box 分别对应 CSS 世界中的 content、padding、border 和 margin 属性

### 4.1 深入理解content

* 根据“外在盒子”是内联还是块级我们可以把元素分为内联元素和块级元素，而根据是否具有可替换内容，我们也可以把元素分为替换元素和非替换元素。

* 替换元素: 顾名思义，内容可以被替换。 例: img, object,video,iframe, 表单元素

  > 特性: 
  >
  > * **内容的外观不受页面上的 CSS 的影响**: 用专业的话讲就是在样式表现在 CSS 作用域之外。如何更改替换元素本身的外观？需要类似 appearance 属性，或者浏览器自身暴露的一些样式接口，例如::-ms-check{}可以更改高版本 IE 浏览器下单复选框的内
  > * **有自己的尺寸**: 在 Web 中，很多替换元素在没有明确尺寸设定的情况下，其默认的尺寸（不包括边框）是 300 像素×150 像素，如<video>、<iframe>或者<canvas>等，也有少部分替换元素为 0 像素，如<img>图片，而表单元素的替换元素的尺寸则和浏览器有关，没有
  >   明显的规律。
  > * **在很多 CSS 属性上有自己的一套表现规则**: 比较具有代表性的就是 vertical-align
  >   属性，对于替换元素和非替换元素，vertical-align 属性值的解释是不一样的。比方说
  >   vertical-align 的默认值的 baseline，很简单的属性值，基线之意，被定义为字符 x 的下边缘，在西方语言体系里近乎常识，几乎无人不知，但是到了替换元素那里就不适用了。为什么呢？因为替换元素的内容往往不可能含有字符 x，于是替换元素的基线就被硬生生定义成
  >   了元素的下边缘。

### 4.2 温和的padding属性

### 4.3 激进的margin属性

### 4.4 功勋卓越的 border 属性



****



## 第五章: 内联元素与流

###  5.1 字母 x ——CSS 世界中隐匿的举足轻重的角色

* 字母 x 的下边缘（线）就是我们的基线。

### 5.2 内联元素的基石line-height

### 5.3 vertical-align 家族基本认识

* 内联元素都是默认都是基线对齐, (图片的基线是下边缘), 设置vertical-align可以改变基线对齐的方式
* **vertical-align 起作用是有前提条件的，这个前提条件就是：只能应用于内联元素以及 display 值为 table-cell 的元素**



****



## 第六章: 流的破坏与保护

### 6.1 魔鬼属性float

* CSS 设计的初衷就是表现如水流，富有弹性，

* 浮动让元素块状化

### 6.2 float的天然克星clear

* clear 属性是让自身不能和前面的浮动元素相邻，注意这里“前面的”3 个字，也就是 clear 属性对“后面的”浮动元素是不闻不问的，直接使用 clear:both
* clear 属性只有块级元素才有效的，

### 6.3 CSS世界的结界——BFC

* BFC: 块级格式化上下文 -- IFC: 内联格式化上下文

* 如果一个元素具有 BFC，内部子元素再怎么翻江倒海、翻
  云覆雨，都不会影响外部的元素。所以，BFC 元素是不可能发生 margin 重叠的，因为 margin重叠是会影响外面的元素的；BFC 元素也可以用来清除浮动的影响，因为如果不清除，子元素浮动则父元素高度塌陷，必然会影响后面元素布局和定位，这显然有违 BFC 元素的子元素不会
  影响外部元素的设定。

* > 触发BFC的条件
  >
  > * \<html>根元素；
  > * float 的值不为 none；
  > * overflow 的值为 auto、scroll 或 hidden；
  > * display 的值为 table-cell、table-caption 和 inline-block 中的任何一个；
  > * position 的值不为 relative 和 static。

### 6.4 最佳结界overflow

* 清除浮动的选择 -- 触发BFC
* HTML 中有两个标签是默认可以产生滚动条的，一个是根元素\<html>，另一个是文本域\<textarea>。

### 6.5 float的兄弟position: absolute

* 包含块（containing block）这个概念实际上大家一直都有接触，就是元素用来计算和定位的一个框。比方说，width:50%，也就是宽度一半，那到底是哪个“元素”宽度的一半呢？注意，这里的这个“元素”实际上就是指的“包含块”。
* 普通元素的百分比宽度是相对于父元素的 content box 宽度计算的，而绝对定位元素的宽度是相对于第一个
  position 不为 static 的祖先元素计算的。***

* > absolute绝对定位元素的与文档流元素差异:
  >
  > * 内联元素也可以作为“包含块”所在的元素；
  > * “包含块”所在的元素不是父块级元素，而是最近的 position 不为 static 的祖先元素或根元素
  > * 边界是 padding box 而不是 content box。(**文档流是content box**)

* height:100%和 height:inherit 的区别。对于普通元素，两者确实没什么区别，但是对于绝对定位元素就不一样了。height:100%是第一个具有定位属性值的祖先元素的高度，而 height:inherit 则是单纯的父元素的高度继承，在某些场景下非常好用。

### 6.6 absolute与overflow

* **如果overflow 不是定位元素，同时绝对定位元素和 overflow 容器之间也没有定位元素，则overflow 无法对 absolute 元素进行剪裁**

### 6.7 absolute与clip

* clip属性: clip: rect(top,right, bottom, left), 用于将定位元素裁减(可用于固定定位的裁减)

![clip](./clip.png 'clip')

### 6.8 absolute的流体特性

### 6.9 position: relative才是大哥

### 6.10 position:fixed固定定位

* position:fixed 固定定位元素的“包含块”是根元素，我们可以将其近似看成\<html>元素。



****



## 第七章 CSS世界的层叠规则

