# CSS属性

## 1. box属性(盒子属性)

> 控制文档元素生成的容器外观, 包括尺寸, 边距,填充和边框

### 1.1 尺寸: 控制元素容器高度和宽度

#### 1.1.1 height(高度)

> height: { length| auto| inherit | percentage(百分比, 基于父元素高度) }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS1 |

#### 1.1.2 min-height(最小高度)

> min-height: {  length | prcentage | inherit }
>
> 保证了盒子的最小高度, 当height的值小于min-height时, height属性失效

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS2 |

#### 1.1.3 max-height(最大高度)

> max-height: { length | percentage | none | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS2 |

#### 1.1.4 width(宽度)

> width: { length | percentage | auto | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS1 |

#### 1.1.5 min-width(最小宽度)

> min-width: { length | percentage | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS2 |

#### 1.1.6 max-width(最大宽度)

> max-width: { length | percentage | none | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS2 |

### 1.2 边距

> 边距不会影响浮动元素 和 绝对定位元素, 因为浮动元素 和 绝对定位元素会从该文流程中删除

#### 1.2.1 margin-top

> margin-top: { length | percentage | auto | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值可以为负值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.2 margin-right

> margin-right: { length | percentage | auto | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值可以为负值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.3 margin-bottom

> margin-bottom: { length | percentage | auto | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值可以为负值
>
> **与margin-top属性不同, 元素的底部边距会推开该元素下方的浮动元素, 因为浮动元素是从标准流中他们当前的位置获取它们的垂直位置**

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.4 margin-left

> margin-left: { length | percentage | auto | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值可以为负值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.5 margin(连写属性)

> margin: { { length | percentage | auto }[^1 to 4 valuse] | inherit }

### 1.3 填充

#### 1.3.1 padding-top

> padding-top: { length | percentage | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值不可以为负值

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.2 padding-right

> padding-right: { length | percentage | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值不可以为负值

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.3 padding-bottom

> padding-bottom: { length | percentage | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值不可以为负值

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.4 padding-left

> padding-left: { length | percentage | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值不可以为负值

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.5 padding(连写属性)

> padding: { { length | percentage}[^1 to 4 valuse] | inherit }

### 1.4 边框 和 轮廓

#### 1.4.1 border-color

> padding: { { color| transparent}[^1 to 4 valuse] | inherit }
>
> 设置4个边框颜色值 -- 也可分别设置4个边框(border-left(top,bottom,right)-color
>
> 初始值为元素的color属性值, 若是border-style属性为none,  则边框不显示

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 见备注 | CSS1, CSS2.1 |

#### 1.4.2 border-style

> border-style:  { { 边框样式}[^1 to 4 valuse] | inherit }
>
> 设置4个边框样式 -- 也可分别设置4个边框(border-left(top,bottom,right)-style
>
> 属性值:　none(不显示) | dotted(点) | dashed(短线段) | solid(实线) | double(两条实线) |groove, ridge, inset, outset(实现三维效果) hidden(在表格中使用)
>
> **只有设置border-style, 边框才会显示**

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | none   | CSS1, CSS2.1 |

#### 1.4.3 border-width

> border-width:  { { thin | medium | thick | length}[^1 to 4 valuse] | inherit }
>
> 设置4个边框样式 -- 也可分别设置4个边框(border-left(top,bottom,right)-width
>
> 属性值: 关键字 thin <= medium <=thick. 根据用户客户端来显示, 没有显式定义

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | medium | CSS1 |

#### 1.4.4 border(连写属性)

> border: { [border-width] [border-style] [border-color] | inherit }

| 继承 | 初始值               | 版本 |
| ---- | -------------------- | ---- |
| 否   | 依据连写属性的初始值 | CSS1 |

 #### 1.4.5 ouline-color

> outline-color: { color | invert | inherit }
>
> 属性值: invert(关键字) -- 进行像素颜色倒置

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | invert | CSS2, CSS2.1 |

#### 1.4.6 outline-style

> outline-style: { 轮廓样式 }
>
> 属性值: 与border-style属性值一致
>
> **只有设置了outline-style, 轮廓才会生效**

| 继承 | 初始值 | 版本        |
| ---- | ------ | ----------- |
| 否   | none   | CSS2 CSS2.1 |

#### 1.4.7 outline-width

> outline-width: {  宽度 }
>
> 属性值: 与border-width属性值一致

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | Medium | CSS2, CSS2.1 |

#### 1.4.8 outline(连写属性)

> outline: { [outline-width]  [outline-style]  [outline-color] | inherit }
>
> 轮廓是不可以对每个边设置不同的宽度、颜色和样式
>
> ***轮廓不占据空间的， 也就是说不会影响其他元素的布局***

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | none   | CSS2, CSS2.1 |



****



## 2. 背景

### 2.1 background-color

> background-color: { color | transparent | inherit }
>
> 元素的背景包含填充 和 边框覆盖的区域

| 继承 | 初始值      | 版本 |
| ---- | ----------- | ---- |
| 否   | transparent | CSS1 |

### 2.2 bakground-iamge

> background-image: {  url | none | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS1 |

### 2.3 background-repeat

> background-repeat: {  repeat | repeat-x | repeat-y | no-repeat | inherit }
>
> 控制是否背景图像是否重复显示
>
> 属性值: repeat(从4个方向, 沿两个轴重复) | repeat-x(沿X轴重复) | repeat-y(沿Y轴重复) |no-repeat(不重复) | inherit(继承)

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | repeat | CSS1 |

### 2.4 background-position

> background-position: {{ percentage | length | left | center| right  [^ 1 or 2 values]} | inherit}
>
> 设置背景图像的初始位置

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0 0    | CSS1, CSS2.1 |

### 2.5 background-attachment: 背景图片是否滚动

> background-attachment: { scroll | fixed | inherit }
>
> 定义背景图片是随文档一同滚动还是固定在显示区中
>
> 定义是基于视口的, 但是只有background-iamge的background-position属性与应用该背景图像的元素的内容，填充和边框区域一致时， 背景图像才会可见

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | scroll | CSS1, CSS2.1 |

### 2.6 background(连写属性)

> background: { background-color background-image background-repeat background-attachment backgroun-position | inherit }
>
> 顺序没有强制顺序, 但是还是需要按照上面顺序

| 继承 | 初始值               | 版本         |
| ---- | -------------------- | ------------ |
| 否   | 与各属性的初始值一致 | CSS1, CSS2.1 |



***************************



## 3 排版属性

> 设置文本内容的外观和布局

### 3.1 font-family

> font-family: { family name, ... | inherit }

| 继承 | 初始值     | 版本      |
| ---- | ---------- | --------- |
| 是   | sans-serif | CSS1,CSS2 |

### 3.2 font-size

> font-size: { absolute-size | relative-size | length | percentage | inherit }
>
> absolute-size, relative-size都是系列关键字尺寸(绝对单位), 不建议使用

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | medium | CSS1, CSS2 |

### 3.3 font-weight

> font-weight: { 100-900 | bold |bolder | lighter | normal | inherit }
>
> ***有些字体(还跟浏览器有一定关系)只支持有限的字体粗细(normal和bold)***
>
> 属性值: 100-900(数值越大, 字体越粗) | bold(粗体, 约等于700) | normal(细体, 约等于400) | bolder(比继承来的要粗一些) | lighter(比继承要细一些)

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | normal | CSS1, CSS2 |

### 3.4 font-style

> font-style: { italic | normal | oblique | inherit }
>
> 属性值: italic,oblique(都是斜体的意思) | normal( 标准的字体样式)

| 继承 | 初始值 | 版本      |
| ---- | ------ | --------- |
| 是   | normal | CSS1,CSS2 |

### 3.5 font-variant

> font-variant: { normal | small-caps | inherit }
>
> 设置元素文本小型大写字母文本 -- 很少见
>
> small-caps: 显示小型大写字母的字体

| 继承 | 初始值 | 版本      |
| ---- | ------ | --------- |
| 是   | normal | CSS1,CSS2 |

### 3.6 line-height

> line-height: { length | number | percentage | normal | inherit }

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | normal | CSS1, CSS2 |

### 3.7 font(连写属性)

> font: { [font-style] [font-variant] [font-weight] [font-size]/[line-height] font-family(caption | icon | menu | message-box | small-caption | status-bar)| inherit }
>
> ***font-size 和 font-family是必须指定的***

| 继承 | 初始值               | 版本       |
| ---- | -------------------- | ---------- |
| 是   | 基于每个属性的初始值 | CSS1, CSS2 |

### 3.8 color

> color: { color | inherit }

| 继承 | 初始值             | 版本         |
| ---- | ------------------ | ------------ |
| 是   | 依照浏览器渲染不同 | CSS1, CSS2.1 |

### 3.9 letter-spacing: 字符间距

> letter-spacing: { length | normal | inherit }
>
> 属性值 接受负的长度值

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | normal | CSS1, CSS2 |

### 3.10 word-spacing: 单词的间距

> word-spacing: { length | normal | inherit }
>
> 属性值接受负的值

### 3.11 text-align

> text-align: { center | justify | left | right | inherit }

| 继承 | 初始值                | 版本       |
| ---- | --------------------- | ---------- |
| 是   | 跟direction属性值有关 | CSS1, CSS2 |

### 3.12 text-decoration: 下划线、上划线等

> text-decoration: { 文本装饰样式 | none | inherit }
>
> 属性值: line-through: 文本中间 | overline: 文本上方 | underline: 文本下方

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 否   | none   | CSS1, CSS2 |

### 3.12 text-indent: 第一个文本缩进量

> text-indent: { length | percentage | inherit }
>
> 可以使用负值

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | 0      | CSS1, CSS2 |

### 3.13 text-transform: 控制字母大小写

> text-transform: { 见下面 | none | inherit }
>
> 属性值: capitalize: 将首字母变成大写 | lowercase: 所有字母变成小写 | uppercase: 所有变成大写

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | none   | CSS1, CSS2 |













[^1 to 4 valuse]: 设置四个值
[^ 1 or 2 values]:设置两个值