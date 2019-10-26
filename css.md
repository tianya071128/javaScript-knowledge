# CSS

## 1. 选择器

### 1.1 元素选择器

| 选择器     | 名称        | 描述                             |
| ---------- | ----------- | -------------------------------- |
| *          | 通配符      | 选择所有的元素                   |
| element    | 元素选择器  | 选择指定的元素                   |
| #idName    | id选择器    | 选择id属性等于idName的元素       |
| .className | class选择器 | 选择class属性包含className的元素 |

### 1.2 关系选择器

| 选择器 | 名称       | 描述                                                         |
| ------ | ---------- | ------------------------------------------------------------ |
| E F    | 包含选择器 | 选择所有包含在E元素里面的F元素                               |
| E > F  | 子选择器   | 选择所有作为E元素的子元素F                                   |
| E + F  | 相邻选择器 | 选择紧贴在E元素之后的第一个F元素, 若之后不是F元素, 则选择器失效 |
| E ~ F  | 兄弟选择器 | 选择在E元素之后所有兄弟元素F                                 |

>  相邻选择符只会选中符合条件的相邻的兄弟元素；而兄弟选择符会选中所有符合条件的兄弟元素，不强制是紧邻的元素。 

### 1.3 属性选择器

| 选择器         | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| E[att]         | 选择具有att属性的E元素                                       |
| E[att="val"]   | 选择具有att属性且属性值等于val的E元素                        |
| E[att~="val"]  | 选择具有att属性且**属性值其中一个等于val**的E元素(包含只有一个值且该值等于val的情况) |
| E[att\|="val"] | 选择具有att属性且属性值为以val开头并用-分隔的字符串的E元素, 如果属性值仅为val, 也将被选择 |
| E[att^="val"]  | 选择具有att属性且属性值为以val开头的字符串的E元素            |
| E[att$="val"]  | 选择具有att属性且属性值为以val结尾的字符串的E元素            |
| E[att*="val"]  | 选择具有att属性且属性值为包含val的字符串的E元素              |

### 1.4 伪类选择器

| 选择器                      | 描述                                                         |      |
| --------------------------- | ------------------------------------------------------------ | ---- |
| ***E:not(s)***              | 匹配不含有s选择符的元素E                                     |      |
| ***E:focus***               | 设置元素在成为输入焦点(该元素的onfocus事件发生)时的样式.(一般用于表单元素) |      |
| **E:disabled**              | 匹配用户界面上处于禁用状态的元素E(一般用于表单元素)          |      |
| **E:enabled**               | 匹配用户界面上处于可用状态的元素E(一般用于表单元素)          |      |
| **E:checked**               | 匹配用户界面上处于选中状态的元素E(用于input type为radio与checkbox时) |      |
| ***E:hover***               | 设置元素鼠标在其悬停时的样式                                 |      |
| ***E:active***              | 设置元素在被用户激活(在鼠标点击和释放之间的发生的事件)时的样式 |      |
| E:link                      | 设置超链接a在未被访问前的样式                                |      |
| E:visited                   | 设置超链接a在其链接地址已被访问过时的样式                    |      |
| **E:first-child**           | 匹配父元素的第一个子元素E                                    |      |
| **E:last-child**            | 匹配父元素的最后一个子元素E                                  |      |
| *E:only-child*              | 匹配父元素仅有的一个子元素E                                  |      |
| ***E:nth-child(n)***        | 匹配父元素的第n个子元素E                                     |      |
| ***E:nth-last-child(n)***   | 匹配父元素的倒数第n个子元素E                                 |      |
| ***E:first-of-type***       | 匹配同类型中的第一个同级兄弟元素E                            |      |
| ***E:last-of-type***        | 匹配同类型中的最后一个同级兄弟元素E                          |      |
| ***E:only-of-type***        | 匹配同类型中的唯一的一个同级兄弟元素E                        |      |
| ***E:nth-of-type(n)***      | 匹配同类型中的第n个同级兄弟元素E                             |      |
| ***E:nth-last-of-type(n)*** | 匹配同类型中的倒数第n个同级兄弟元素E                         |      |
| E:empty                     | 匹配没有任何子元素( 包括text节点)的元素E                     |      |
| E:root                      | 匹配没E元素在文档的根元素。在HTML中， 根元素永远是HTML       |      |

> 超链接的四种状态, 需要按照特定的书写顺序才能生效: 访问前(link) - 已访问( visited) - 鼠标悬停(hover) - 被点击(active)

#### 关于 :not() 的用法

> ```css
> // 每个列表项都有一条底边线，但是最后一项不需要底边线。
> li:not(:last-child) {
>     border-bottom: 1px solid #ddd;
> }
> ```

#### 关于 :nth-child() 的用法

> ```css
> :nth-child(length) /*参数是具体数字 length为整数*/
> :nth-child(n) /*参数是n,n从0开始计算*/
> :nth-child(n*length) /*n的倍数选择，n从0开始算*/
> :nth-child(n+length) /*选择大于等于length后面的元素*/
> :nth-child(-n+length) /*选择小于等于length前面的元素*/
> :nth-child(n*length+1) /*表示隔几选一*/
> :nth-child(2n) / :nth-child(even) /*表示偶数*/
> :nth-child(2n+1) / :nth-child(odd) /*表示奇数*/
> ```

#### 关于 :...child 和 ...-of-type 的差异

> **`E:first-of-type `总是能命中父元素的第1个为E的子元素，不论父元素第1个子元素是否为E；而`E:first-child`里的E元素必须是它的兄弟元素中的第一个元素，否则匹配失效。`E:last-of-type `与`E:last-child`也是同理。**
>**`E:nth-of-type(n)`总是能命中父元素的第n个为E的子元素，不论父元素第n个子元素是否为E；而`E:nth-child(n)`会选择父元素的第n个子元素E，如果第n个子元素不是E，则是无效选择符，但n会递增。** 

### 1.5 伪元素选择器

| 选择器                         | 描述                                                   |
| ------------------------------ | ------------------------------------------------------ |
| E:before/E::before             | 在目标元素E的前面插入的内容.用来和content属性一起使用  |
| E:after`/`E::after             | 在目标元素E的后面插入的内容。用来和content属性一起使用 |
| E:first-letter/E::first-letter | 设置元素内的第一个字符的样式                           |
| E:first-line/E::first-line     | 设置元素内的第一行的样式                               |
| ***E::placeholder***           | 设置元素文字占位符的样式. 一般用于input输入框          |
| ***E::selection***             | 设置元素被选择时的字体颜色和背景颜色                   |

>  `::placeholder`在使用时需要加上各个浏览器的前缀；除了Firefox是 `::[prefix]placeholder`，其他浏览器都是使用 `::[prefix]input-placeholder`。 

> ```	css
> /*
> 	attr(desc1)可以获取到匹配元素的属性值内容
> 	<div class="g-wrap" desc1="商品描述AAA" desc2="商品描述BBB"></div>
> */
> [desc1]::before {
>     content: attr(desc1);
> }
> ```



****



## 2. CSS单位

> 长度单位包括: 相对单位 和 绝对单位
>
> 相对长度单位: em, ex, ch, rem vw, vh, vmax, vmin
>
> 绝对长度包括: cm, mm, q, in, pt, pc, px

### 2.1 长度 - 相对单位

> ***可用于多个属性, 不仅限于font-size***

* vm: 相对于视口的宽度, 视口被均分为100单位的vw

  > IE8 及 IE8以下不支持

* vh: 相对于视口的高度, 视口被均分为100单位的vh

  > IE8 及 IE8以下不支持

* vmax: 相对于视口的宽度或高度中较大的那个, 视口被均分为100单位的vmax

  > IE不支持, 浏览器支持度不够

* vmin: 相对于视口的宽度或高度中较小的那个, 视口被均分为100单位的vmin

  >  IE9仅支持使用 vm 代替vmin -- 浏览器支持度不够

* rem: 相对于根元素(即html元素)font-size计算值得倍数

  > IE8 及 IE8以下不支持

* em: 相对于**当前对象(自身)**内文本的字体尺寸.

  > 如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

* ex: 相对于字符"x"的高度, 通常为字体高度的一半

  >  如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。 

* ch: 相对于数字 "0" 的宽度

### 2.2 长度 - 绝对单位

> 转换单位: 1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px

* px: 像素

* cm: 厘米
* mm: 毫米
* q: 1/4毫米
* in: 英寸
* pt: 点
* pc: 派卡

### 2.3 百分比 和 数字(浮点数和整数)

* 百分比

  > 每个属性使用百分比的含义并不相同
  >
  > * width 和 height:  基于包裹它的父元素的宽和高来计算 
  >
  >   > 父元素高度不固定时, 子元素不再按照百分比来计算, 而是使用了auto值
  >
  > * margin 和 padding: 基于包裹它的父元素的宽来计算 
  >
  >   > ***不管是left,right, 还是top, bottom,都是基于宽度***
  >
  > * border-radius: 基于元素自身的宽度, 高度来计算
  >
  >   > 横轴上的百分比参考的是元素自身的宽度，纵轴上的百分比参考的是元素自身的高度，负值是无效的 
  >
  > * background-position:  (本身宽高-背景图片宽高)*百分比 
  >
  >   > 当(本身宽高-背景图片宽高)为负值时, 也是生效的
  >
  > * bottom、left、right、top: 基于父元素的宽高
  >
  >   > 所以可以配合margin来达到居中效果
  >
  > * transform: translate(): 基于自身的宽高
  >
  >   >  **参考的应该自身是`border-box`的尺寸** 
  >
  > * font-size: 基于 父元素的font-size
  >
  > * line-height: 基于  自身的font-size
  >
  > * vertical-align: 基于 自身的line-height

* 数字



**********



## 3 关键字 和 函数

### 3.1 关键字

* inherit: 指定属性值从父元素继承它的值.

  > IE8+兼容
  >
  > 可用于任何HTML元素上的任何CSS属性

* initial: 用于设置CSS属性为它的默认值

  > IE12+兼容
  >
  > 可用于任何HTML元素上的任何CSS属性

* unset:  擦除属性申明 

  > 如果**`unset`** 的CSS关键字从其父级继承，则将该属性重新设置为继承的值，如果没有继承父级样式，则将该属性重新设置为初始值。换句话说这个unset关键字会优先用 [`inherit`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/inherit) 的样式，其次会应该用[`initial`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/initial)的样式。它允许应用任意的CSS样式，包括CSS缩写 [`all`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/all) 关键字。 
  >
  > IE不支持

### 3.2 函数

* calc(): 用于动态计算长度值 -- width: calc(100% - 10px)

  > 运算符前后需要保留一个空格
  >
  > 支持 + - * / 运算
  >
  > 使用标准的数学运算优先级规则
  >
  > IE9+ 兼容

* attr(): 插入元素的属性值 -- content: attr(title) '还可以添加其他内容';

  > attr()理论上可以用于任何CSS属性, 但目前适用于伪元素
  >
  > IE8+兼容

* counter(): 插入计算器 -- content: counter(item)".";

  > 只能用在content属性上
  >
  > IE8+兼容

* counters(): 重复插入计数器

* toggle(): 用于设置子孙元素使用取值序列中的值循环使用

  > 例如: list-style-type: toggle(disk, circle, square, box)
  >
  > 在上述代码中，定义一个多级的ul，第一级使用disk markers，子孙级依次使用circle, square, box。 
  >
  > IE不支持