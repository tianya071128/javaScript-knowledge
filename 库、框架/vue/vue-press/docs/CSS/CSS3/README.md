# CSS3 属性

## 第一部分 CSS3 边框

### 1.1 border-radius

> 四个属性的连写:
>
> - border-top-left-radius
> - border-top-right-radius
> - border-bottom-right-radius
> - border-bottom-left-radius
>
> **_每个半径的四个值的顺序是：左上角，右上角，右下角，左下角_**
>
> 属性值:
>
> - length 定义弯道的形状
> - % 使用%定义角落的形状(**水平半轴相对于盒模型的宽度；垂直半轴相对于盒模型的高度**)

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS3 |

### 1.2 box-shadow

> **box-shadow 以由逗号分隔的列表来描述一个或多个阴影效果。该属性可以让几乎所有元素的边框产生阴影**
>
> 语法:
>
> ```css
> /* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
> box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
> ```
>
> 属性值:
>
> - h-shadow 必需的。水平阴影的位置。允许负值
> - v-shadow 必需的。垂直阴影的位置。允许负值
> - blur 可选。模糊距离
> - spread 可选。阴影的大小
> - color 可选,阴影的颜色,在 CSS 颜色值寻找颜色值的完整列表
> - inset 可选。从外层的阴影（开始时）改变阴影内侧阴影

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS3 |

### 1.3 border-image-source

> 作用: 指定图片边框所使用的图像
>
> 属性值:
>
> - none: 没有图像被使用
> - image: 边框使用图像的路径

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS3 |

### 1.4 border-image-slice

> 作用: 指定图像的边界向内偏移
>
> 语法: border-image-slice: _number_|_%_|fill;
>
> **注意:** 此属性指定顶部，右，底部，左边缘的图像向内偏移，分为九个区域：四个角，四边和中间。图像中间部分将被丢弃（完全透明的处理），除非填写关键字。如果省略第四个数字/百分比，它和第二个相同的。如果也省略了第三个，它和第一个是相同的。如果也省略了第二个，它和第一个是相同的。
>
> 属性值:
>
> - number 数字表示图像的像素（位图图像）或向量的坐标（如果图像是矢量图像）
> - % 百分比图像的大小是相对的：水平偏移图像的宽度，垂直偏移图像的高度
> - fill 保留图像的中间部分

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 100%   | CSS3 |

### 1.5 border-image-width

> 作用: 指定图像的边界的宽度
>
> 语法: border-image-width: _number_|_%_|auto;
>
> **注意：** border-image -width 的 4 个值指定用于把 border 图像区域分为九个部分。他们代表上，右，底部，左，两侧向内距离。如果第四个值被省略，它和第二个是相同的。如果也省略了第三个，它和第一个是相同的。如果也省略了第二个，它和第一个是相同的。负值是不允许的。
>
> 属性值:
>
> - number 表示相应的 border-width 的倍数
> - % 边界图像区域的大小：横向偏移的宽度的面积，垂直偏移的高度的面积
> - auto 如果指定了，宽度是相应的 image slice 的内在宽度或高度

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 1      | CSS3 |

### 1.6 border-image-outset

> 作用: 指定在边框外部绘制 border-image-area 的量
>
> 语法: border-image-outset: _length_|_number_;
>
> **注意：** border-image-outset 用于指定在边框外部绘制 border-image-area 的量。包括上下部和左右部分。如果第四个值被省略，它和第二个是相同的。如果也省略了第三个，它和第一个是相同的。如果也省略了第二个，它和第一个是相同的。不允许 border-im-outset 拥有负值。
>
> 属性值:
>
> - length 设置边框图像与边框（border-image）的距离，默认为 0
> - number 代表相应的 border-width 的倍数

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS3 |

### 1.7 border-image-repeat

> 作用: 用于图像边界是否应重复（repeated）、拉伸（stretched）或铺满（rounded）
>
> **注意：** 该属性规定如何延展和铺排边框图像的边缘和中间部分。因此，您可以规定两个值。如果省略第二个值，则采取与第一个值相同的值。
>
> 属性值:
>
> - stretch 默认值。拉伸图像来填充区域
> - repeat 平铺（repeated）图像来填充区域。
> - round 类似 repeat 值。如果无法完整平铺所有图像，则对图像进行缩放以适应区域。
> - space 类似 repeat 值。如果无法完整平铺所有图像，扩展空间会分布在图像周围
> - initial 将此属性设置为默认值
> - inherit 从父元素中继承该属性

| 继承 | 默认值  | 版本 |
| ---- | ------- | ---- |
| 否   | stretch | CSS3 |

### 1.8 border-image

> 作用: 连写属性: 用于设置 [border-image-source](https://www.runoob.com/cssref/css3-pr-border-image-source.html), [border-image-slice](https://www.runoob.com/cssref/css3-pr-border-image-slice.html), [border-image-width](https://www.runoob.com/cssref/css3-pr-border-image-width.html), [border-image-outset](https://www.runoob.com/cssref/css3-pr-border-image-outset.html) 和[border-image-repeat](https://www.runoob.com/cssref/css3-pr-border-image-repeat.html) 的值。
>
> 语法:
> border-image: source slice width outset repeat|initial|inherit;
>
> 此属性 IE11+才支持

| 继承 | 默认值                | 版本 |
| ---- | --------------------- | ---- |
| 否   | none 100% 1 0 stretch | CSS3 |

---

## 第二部分 CSS3 背景

### 2.1 background-image

> CSS3 在以前基础上允许元素使用多个背景图像, 用逗号隔开
>
> 注意:
>
> - **在绘制时，图像以 z 方向堆叠的方式进行。先指定的图像会在之后指定的图像上面绘制。因此指定的第一个图像“最接近用户”。**
> - **然后元素的边框 border 会在它们之上被绘制，而 background-color 会在它们之下绘制。图像的绘制与盒子以及盒子的边框的关系，需要在 CSS 属性 background-clip 和 background-origin 中定义。**
> - **如果一个指定的图像无法被绘制 (比如，被指定的 URI 所表示的文件无法被加载)，浏览器会将此情况等同于其值被设为 none。**

### 2.2 background-size

> 作用: 指定背景图片大小
>
> 属性值:
>
> - length 设置背景图片高度和宽度。第一个值设置宽度，第二个值设置的高度。如果只给出一个值，第二个是设置为 auto(自动)
> - percentage **将计算相对于背景定位区域的百分比。**第一个值设置宽度，第二个值设置的高度。**如果只给出一个值，第二个是设置为"auto(自动)"**
> - cover 此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小。
> - contain 此时会保持图像的纵横比并将图像缩放成将适合背景定位区域的最大大小。
> - auto 以背景图片的比例缩放背景图片。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS3 |

### 2.3 background-origin

> 作用: 规定 background-position 属性相对于什么位置来定位
>
> 注意: 如果背景图像的 background-attachment 属性为"fixed", 则该属性没有效果
>
> 属性值:
>
> - padding-box 背景图像相对于内边距框来定位。
> - border-box 背景图像相对于边框盒来定位
> - content-box 背景图像相对于内容框来定位。

| 继承 | 默认值      | 版本 |
| ---- | ----------- | ---- |
| 否   | padding-box | CSS3 |

### 2.4 background-clip

> 作用: 设置元素的背景(背景图片 或 颜色)是否延伸到边框下面
>
> 属性值:
>
> - border-box 背景被裁剪到边框盒
> - padding-box 背景被裁剪到内边距框
> - content-box 背景被裁剪到内容框。

| 继承 | 默认值     | 版本 |
| ---- | ---------- | ---- |
| 否   | border-box | CSS3 |

### 2.5 background

> 语法:
>
> `background` 属性被指定多个背景层时，使用逗号分隔每个背景层。
>
> 每一层的语法如下：
>
> - 在每一层中，下列的值可以出现 0 次或 1 次：
>   - background-attachment
>   - background-image
>   - background-position
>   - background-size
>   - background-repeat
> - background-size 只能紧接着 background-position 出现，以"/"分割，如： "center/80%".
> - \<box>可能出现 0 次、1 次或 2 次。 如果出现 1 次，它同时设定 background-origin 如果出现 2 次，第一次的出现设置 background-origin, 第二次的出现设置 background-clip
> - background-color 只能被包含在最后一层。

---

## 第三部分 文本效果

### 3.1 text-wrap: 规定文本的换行规则

> 作用: 规定文本的换行(折行)规则
>
> 浏览器支持: 目前主流浏览器都不支持 text-wrap 属性。
>
> 属性值:
>
> normal 只在允许的换行点进行换行。
>
> none 不换行。元素无法容纳的文本会溢出。
>
> unrestricted 在任意两个字符间换行。
>
> suppress 压缩元素中的换行。浏览器只在行中没有其他有效换行点时进行换行。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | normal | CSS3 |

### 3.2 word-break: 规定自动换行的处理方法

> 作用: 指定非 CJK 脚本(中日韩)的断行规则
>
> 属性:
>
> - normal 使用浏览器默认的换行规则。
> - break-all 允许在单词内换行。
> - keep-all 只能在半角空格或连字符处换行。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | normal | CSS3 |

### 3.3 word-wrap: 允许长的内容可以自动换行

> 作用: 允许长的内容可以自动换行
>
> 属性:
>
> - normal 只在允许的断字点换行（浏览器保持默认处理）。
> - break-word 在长单词或 URL 地址内部进行换行。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | normal | CSS3 |

### 3.4 text-shadow: 文字阴影

> 作用: 添加阴影, 可以添加多个, 用多个隔开
>
> 语法: text-shadow: h-shadow v-shadow blur color;
>
> 注意： text-shadow 属性连接一个或更多的阴影文本。属性是阴影，指定的每 2 或 3 个长度值和一个可选的颜色值用逗号分隔开来。已失时效的长度为 0。
>
> 值:
>
> - h-shadow 必需。水平阴影的位置。允许负值。
> - v-shadow 必需。垂直阴影的位置。允许负值。
> - blur 可选。模糊的距离。
> - color 可选。阴影的颜色。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | none   | CSS3 |

### 3.5 text-overflow: 处理文本溢出的部分

> 作用: 指定文本溢出时, 如何处理溢出的文字, 通常配合 white-space: nowrap 和 overflow:hidden 属性
>
> 属性值:
>
> - clip 修剪文本。
> - ellipsis 显示省略符号来代表被修剪的文本。
> - string 使用给定的字符串来代表被修剪的文本。 只在 Firefox 浏览器下有效

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | clip   | CSS3 |

### 3.6 其他属性: 支持度很差

> - hanging-punctuation 规定标点字符是否位于线框之外。
> - punctuation-trim 规定是否对标点字符进行修剪
> - text-align-last 设置如何对齐最后一行或紧挨着强制换行符之前的行
> - text-emphasis 向元素的文本应用重点标记以及重点标记的前景色
> - text-justify 规定当 text-align 设置为 "justify" 时所使用的对齐方法
> - text-outline 规定文本的轮廓。

---

## 第四部分 盒子 box 属性

### 4.1 box-sizing: 设置盒子的模型

> 作用: 定义了如何计算一个元素的宽度和高度.
>
> 属性值:
>
> - content-box: windth 和 height = 盒子 content 内容的宽高
> - border-box: windth 和 height = 盒子 content 内容的宽高 + padding + border
> - inherit: 继承父元素

| 继承 | 默认值      | 版本 |
| ---- | ----------- | ---- |
| 否   | content-box | CSS3 |

### 4.2 resize: 元素是否可以调整大小

> 作用: 指定一个元素是否可以由客户调整大小
>
> 注意: 兼容性问题－IE 不支持
>
> 属性值:
>
> - none 用户无法调整元素的尺寸。
> - both 用户可调整元素的高度和宽度。
> - horizontal 用户可调整元素的宽度。
> - vertical 用户可调整元素的高度。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS3 |

### 4.3 outline-offset: 轮廓线在 border 边缘外的偏移

> 作用: 设置轮廓线距离 border 的偏移
>
> 注意: 兼容性问题－IE 不支持
>
> 属性值:
>
> - length 轮廓与边框边缘的距离。允许负值
>
>   inherit 规定应从父元素继承 outline-offset 属性的值。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS3 |

### 4.4 其他属性: 支持度很差

> - appearance 允许您使一个元素的外观像一个标准的用户界面元素
> - icon 为创作者提供了将元素设置为图标等价物的能力。
> - nav-down 指定在何处使用箭头向下导航键时进行导航
> - nav-index 指定一个元素的 Tab 的顺序
> - nav-left 指定在何处使用左侧的箭头导航键进行导航
> - nav-right 指定在何处使用右侧的箭头导航键进行导航
> - nav-up 指定在何处使用箭头向上导航键时进行导航

---

## 第五部分 2D 转换 和 3D 转换

### 5.1 transform: 转换属性

#### 1. 位移

> 支持百分比: 百分比是基于自身的

- translate(_x_,_y_)

  > 当只填写一个值时, 为 X 轴位移

- translate3d(_x_,_y_,_z_): 定义 3D 位移

  > 需配合 perspective 属性使用

- translateX(_x_)

- translateY(_y_)

- translateZ(_z_)

#### 2. 旋转

> 角度单位, 详情见 CSS 基础.md, 主要为 deg

- rotate(_angle_): 定义 2D 旋转，在参数中规定角度。

  > 2d 旋转就是定义一个值
  >
  > 沿着原点旋转

- rotate3d(x,y,z,angle) 定义 3D 旋转。

  > 需配合 perspective 属性使用

- rotateX(angle) 定义沿着 X 轴的 3D 旋转。

  > 当单独设置时, 就是相当于沿着 X 轴直接 3D 旋转
  >
  > 如果 rotateX(90deg)的话, 就相当于隐藏元素

- rotateY(angle) 定义沿着 Y 轴的 3D 旋转。

- rotateZ(angle) 定义沿着 Z 轴的 3D 旋转。

#### 3. 缩放

> 单位一般为 number 类型

- scale(x[,y]?) 定义 2D 缩放转换。

  > 设置一个值: 宽高同时变化. 设置两个值: 第一个值为宽, 第二个值为高

- scale3d(x,y,z) 定义 3D 缩放转换。

  > 需配合 perspective 属性使用

- scaleX(x) 通过设置 X 轴的值来定义缩放转换。

- scaleY(y) 通过设置 Y 轴的值来定义缩放转换。

- scaleZ(z) 通过设置 Z 轴的值来定义 3D 缩放转换。

#### 4. 倾斜

> 角度单位, 详情见 CSS 基础.md, 主要为 deg
>
> **_没有 3d 倾斜_**

- skew(x-angle,y-angle) 定义沿着 X 和 Y 轴的 2D 倾斜转换。
- skewX(angle) 定义沿着 X 轴的 2D 倾斜转换。
- skewY(angle) 定义沿着 Y 轴的 2D 倾斜转换。

#### 5. 其他

- none 定义不进行转换。
- matrix(n,n,n,n,n,n) 定义 2D 转换，使用六个值的矩阵。
- matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n) 定义 3D 转换，使用 16 个值的 4x4 矩阵。
- perspective(n) 为 3D 转换元素定义透视视图。

### 5.2 transform-origin: 调整原点

> 更改一个元素变形的原点
>
> 2D 转换元素可以改变元素的 X 和 Y 轴. 3D 转换元素, 可以更改元素的 Z 轴
>
> 注意: **_使用此属性必须先使用 transform 属性_**
>
> 默认值: 50% 50% 0
>
> 属性值: 方位值(left, center, right)、length、%（相对自身)

### 5.3 backface-visibility: 背面是否可见

> 定义当元素不面向屏幕时是否可见(例如 3d 旋转 90 度背面就会呈现在屏幕上)
>
> 属性值:
>
> - visible 背面是可见的。
> - hidden 背面是不可见的。

### 5.4 3d 变形相关属性

- transform-style 规定被嵌套元素如何在 3D 空间中显示
- perspective 规定 3D 元素的透视效果
- perspective-origin 规定 3D 元素的底部位置。

---

## 第六部分 过渡

### 6.1 transition-property: 应用过渡的属性

> 必须结合 transition-duration(过渡时间)属性, 否则持续时间为 0
>
> **不要在 auto 属性上做动画**
>
> **插入元素(appendChild)或设置 display:none/display:block 后立即使用过渡,元素将视为没有开始状态，始终处于结束状态，解决办法：使用 window.setTimeout,延迟执行**
>
> 属性值:
>
> - none: 没有属性会获得过渡效果
> - all: 所有属性都将获得过渡效果
> - property: 应用过渡效果的 CSS 属性名称列表, 列表以逗号分隔(transition-property:width,height -- 这样会应用一样的过度时间,运动曲线等) -- **可应用的属性非常多**

### 6.2 transition-duration: 过渡时间

> 定义过渡时间
>
> 属性值:
>
> - time: 秒(s) 或 毫秒(ms)

### 6.3 transition-timing-function: 过渡的速度函数

> 指定切换效果的速度(过渡函数)
>
> 属性值:
>
> - linear 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。
> - ease 规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）-- 默认值
> - ease-in 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。
> - ease-out 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。
> - ease-in-out 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。
> - cubic-bezier(n,n,n,n) 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。

### 6.4 transition-delay: 过渡开始需要等待的时间

> 规定了过渡效果开始作用之前需要等待的时间
>
> 属性值:
>
> - time: 秒(s) 或 毫秒(ms)

### 6.5 transition: 过渡

> 语法:
>
> transition: _property duration timing-function delay_;
>
> 注意: **_transition-duration 属性必须指定, 否则持续时间为 0, transition 不会有任何效果_**
>
> 可以指定多个 CSS 属性的过渡效果, 多个属性之间用逗号分隔

---

## 第七部分 动画

### 7.1 animation-name: 动画名

> 指定应用一系列的动画, 每个名称代表一个由@keyframes 定义的动画序列
>
> 属性值:
>
> - none: 特殊关键字, 表示无关键帧
> - name: 动画名称

### 7.2 animation-duration: 完成时间

> 指定一个动画周期的时长, 默认值为 0, 表示无动画
>
> 属性值:
>
> - time: 时间, 单位为 s 或者 ms, 无单位值无效, 不能为负值

### 7.3 animation-timing-function: 执行速度

> 定义动画在每一个动画周期中执行的节奏
>
> 属性值:
>
> - linear 动画从头到尾的速度是相同的
> - ease 默认。动画以低速开始，然后加快，在结束前变慢
> - ease-in 动画以低速开始
> - ease-out 动画以低速结束
> - ease-in-out 动画以低速开始和结束
> - cubic-bezier(n,n,n,n) 在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。

### 7.4 animation-fill-mode: 在执行之前和之后如何将样式应用于其目标

> 设置 CSS 动画在执行之前和之后如何将样式应用于其目标
>
> 属性值:
>
> - none 当动画未执行时，动画将不会将任何样式应用于目标，而是已经赋予给该元素的 CSS 规则来显示该元素。这是默认值
> - forwards 在动画结束后（由 animation-iteration-count 决定），动画将应用该属性值。
> - backwards 动画将在应用于目标时立即应用第一个关键帧中定义的值，并在 animation-delay 期间保留此值。
> - both 动画将遵循 forwards 和 backwards 的规则，从而在两个方向上扩展动画属性。

### 7.5 animation-delay: 动画延迟时间

> 定义动画于何时开始, 即从动画应用在元素上到动画开始的这段时间的长度
>
> **允许负值, 定义负值会让动画立即开始. 但是会在它的动画序列中某位置开始。 例如，如果设定值为-1s，动画会从它的动画序列的第 1 秒位置处立即开始**
>
> 如果为动画延迟指定了一个负值，但起始值是隐藏的，则从动画应用于元素的那一刻起就获取起始值。
>
> 属性值:
>
> - time: 秒(s) 或 毫秒(ms), 未设置单位, 定义无效值

### 7.6 animation-iteration-count: 执行次数

> 定义动画的执行次数
>
> 属性值:
>
> - infinite: 无限次播放
> - \<number>: 默认为 1, 可以用小数定义循环, 来播放动画周期的一部分, 不允许为负值. 例如: 0.5 表示播放到动画周期的一半

### 7.7 animation-direction: 是否反向播放

> 定义动画是否反向播放
>
> **_往返当次数为 1 次以上才有效, 并且一次往返相当于执行两次动画_**
>
> 属性值:
>
> - normal: 默认值, 每个循环内动画向前循环，换言之，每个动画循环结束，动画重置到起点重新开始，
> - reverse: 动画反向播放
> - alternate 动画交替反向运行，反向运行时，动画按步后退，同时，带时间功能的函数也反向，比如，ease-in 在反向时成为 ease-out。计数取决于开始时是奇数迭代还是偶数迭代
> - alternate-reverse 反向交替， 反向开始交替 动画第一次运行时是反向的，然后下一次是正向，后面依次循环。决定奇数次或偶数次的计数从 1 开始。

### 7.8 animation-play-state: 是否运行 或 暂停

> 定义一个动画是否运行 或者 暂停. **_可以通过查询它来确定动画是否在运行, 也可以通过设置它来暂停动画 或 播放动画_**
>
> **_恢复一个已暂停的动画, 将从它开始暂停的时候, 而不是从动画序列的起点开始在动画_**
>
> 属性值:
>
> - running: 当前动画正在运行
> - paused: 当前动画以被停止

### 7.9 animation: 动画属性

> 语法:
>
> animation: name(名称) duration(完成时间) timing-function(速度) delay(延迟时间) iteration-count(次数) direction(是否反向播放) fill-mode(开始和结束的样式) play-state(状态)
>
> **每个动画定义中的属性值的顺序很重要：可以被解析为 \<time> 的第一个值被分配给 animation-duration， 第二个分配给 animation-delay。**
>
> **每个动画定义中的值的顺序，对于区分 animation-name 值与其他关键字也很重要。解析时，对于除 animation-name 之外的有效的关键字，必须被前面的简写中没有找到值的属性所接受。此外，在序列化时，animation-name 与以及其他属性值做区分等情况下，必须输出其他属性的默认值**

### 7.10 @keyframes: 定义动画关键帧

> 通过在动画序列中定义关键帧（或 waypoints）的样式来控制 CSS 动画序列中的中间步骤。这比转换更能控制动画序列的中间步骤。

- 名称规则

  > 标识动画的字符串，由大小写敏感的字母 a-z、数字 0-9、下划线(\_)和/或横线(-)组成。第一个非横线字符必须是字母，数字不能在字母前面，不允许两个横线出现在开始位置。

- 单位

  > 可以使用百分比值 或者 from(开始), to(结束)关键字

- 让关键帧序列生效

  > 如果一个关键帧规则中没有指定动画的开始 或 结束状态(没有定义 0%/from 和 100%/to), 将使用元素的现有样式作为起始/结束状态. 这可以用来从初始状态开始元素动画，最终返回初始状态。
  >
  > **_如果使用了不能用作动画的属性, 那么这些属性会被忽略掉, 支持的属性仍然是有效的_**

- 重复定义(针对整体而言)

  > **如果多个关键帧使用同一个名称(即动画名称), 以最后一个为主, 不存在层叠样式的情况**
  >
  > **如果一个@keyframes 里的关键帧的百分比存在重复的情况, 以最后一次定义的关键帧为准. 不存在层叠样式的情况, 即使多个关键帧设置相同的百分值也不会全部执行**
  >
  > ```css
  > /* 此动画无效, 全部无效 */
  > @keyframes identifier {
  > 0% { top: 0; left: 0px}
  > 100% { top: 0; left: 30px;}
  > }
  > @keyframes identifier {
  > 0% { top: 0; left: 20px}
  > 50% { top: 10px, left: 30px }
  > 100% { top: 0; left: 50px;}
  > }
  > ```

- 当关键帧被重复定义

  > 如果某一个关键帧出现了重复的定义，且重复的关键帧中的 css 属性值不同，以最后一次定义的属性为准。 => 针对属性, 重复定义时, 同属性最后一个定义的覆盖前面的属性
  >
  > ```css
  > @keyframes identifier {
  >   0% {
  >     top: 0;
  >     left: 0px;
  >   }
  >   /* top属性无效, left属性生效 */
  >   50% {
  >     top: 30px;
  >     left: 20px;
  >   }
  >   50% {
  >     top: 10px;
  >   }
  >   100% {
  >     top: 0;
  >     left: 30px;
  >   }
  > }
  > ```

- 属性个数不定

  > 如果一个关键帧中没有出现其他关键帧中的属性, 那么这个属性将使用插值(不能使用插值的属性除外, 这些属性会被忽略掉).
  >
  > ```css
  > @keyframes identifier {
  >   0% {
  >     top: 0;
  >     left: 0;
  >   }
  >   30% {
  >     top: 50px;
  >   }
  >   68%,
  >   72% {
  >     left: 50px;
  >   }
  >   100% {
  >     top: 100px;
  >     left: 100%;
  >   }
  > }
  > ```

- 关键帧中的!import 关键词

  > !import 关键词会被忽略

---

## 第八部分 弹性布局

### 8.1 flex

> display: flex(块级弹性盒子) | display: inline-flex(行内弹性盒子)
>
> **_设为 Flex 布局以后, 子元素的 float, clear, vertical-align 属性将失效_**

> 基本概念:
>
> 容器: 采用了 flex 布局的元素, 成为 flex 容器, 它的所有子元素自动成为 flex 项目, 简称项目
>
> 容器默认有两根轴, 水平的主轴 和 垂直的交叉轴

### 8.2 容器属性

#### 1. flex-direction:设置主轴方向

> 属性值:
>
> - row: 默认值, 主轴为水平方向, 起点在左端
>
> - row-reverse：主轴为水平方向，起点在右端。
> - column：主轴为垂直方向，起点在上沿。
> - column-reverse：主轴为垂直方向，起点在下沿。

#### 2. flex-wrap: 设置换行规则

> 默认情况下, 项目都排在一条线(又称轴线)上. flex-wrap 属性定义, 如果一条轴线排不下, 如何换行
>
> 属性值:
>
> - nowrap: 默认值, 不换行
> - wrap: 换行, 第一行在上方
> - wrap-reverse: 换行, 第一行在下方

#### 3. flex-flow: 设置主轴 和 换行规则 简写属性

> 语法: flex-flow: \<flex-direction> | \<flex-wrap>

#### 4. justify-content: 项目在主轴上的对齐方式

> 属性值:
>
> - flex-start（默认值）：左对齐
> - flex-end：右对齐
> - center： 居中
> - space-between：两端对齐，项目之间的间隔都相等。
> - space-around：每个项目两侧的间隔相等。所以，**_项目之间的间隔比项目与边框的间隔大一倍。_**

#### 5. align-items: 定义项目在交叉轴上如何对齐

> 属性值:
>
> - flex-start：交叉轴的起点对齐。
> - flex-end：交叉轴的终点对齐。
> - center：交叉轴的中点对齐。
> - baseline: 项目的第一行文字的基线对齐。
> - stretch（默认值）：如果项目未设置高度或设为 auto，将占满整个容器的高度。

#### 6. align-content: 多根轴线的对齐方式.

> **_属性定义了多根轴线的对齐方式. 如果项目只有一根轴线, 该属性不起作用_**
>
> 属性值:
>
> - flex-start：与交叉轴的起点对齐。
> - flex-end：与交叉轴的终点对齐。
> - center：与交叉轴的中点对齐。
> - space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
> - space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
> - stretch（默认值）：轴线占满整个交叉轴。

### 8.3 项目属性

#### 1. order: 项目的排列顺序

> 定义项目的排列顺序. 数值越小, 排列越靠前, 相同数值则按照元素先后顺序. 默认为 0
>
> 属性值:
>
> - number: 数值

#### 2. flex-grow: 项目的放大比例

> 定义项目的放大比例, 默认为 0, 即存在剩余空间, 也不放大
>
> **数值越大, 占据的剩余空间比例越大**
>
> 属性值:
>
> - number: 数值

#### 3. flex-shrink: 项目的缩小比例

> 定义了项目的缩小比例, 默认为 1(均等缩小), 即如果空间不足, 该项目将缩小, 数值越大, 缩小比例越大
>
> **_利用这个属性就可以解决项目缩小的问题_**
>
> 属性值;
>
> - number: 数值

#### 4. flex-basis: 定义了在分配多余空间之前, 项目占据的主轴空间

> 定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。
>
> 属性值:
>
> - lengt: 可以设为跟 width 和 height 属性一样的值(如 350px), 则项目将占据固定空间
> - auto: 默认值,**_长度等于灵活项目的长度。如果该项目未指定长度，则长度将根据内容决定。_**

#### 5. flex: 连写属性

> 语法:
>
> flex: none | \<flex-grow> \<flex-shrink> \<flex-basis>
>
> 即: 项目的放大比例, 项目的缩小比例, 项目的固定空间
>
> **_建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值_**

#### 6. align-self: 设置单个项目在交叉轴的排列

> align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。
>
> **_该属性可能取 6 个值，除了 auto，其他都与 align-items 属性完全一致_**
>
> 属性值:
>
> - auto 默认值。元素继承了它的父容器的 align-items 属性。如果没有父容器则为 "stretch"
> - stretch 元素被拉伸以适应容器。如果指定侧轴大小的属性值为'auto'，则其值会使项目的边距盒的尺寸尽可能接近所在行的尺寸，但同时会遵照'min/max-width/height'属性的限制。
> - center 元素位于容器的中心。弹性盒子元素在该行的侧轴（纵轴）上居中放置。（如果该行的尺寸小于弹性盒子元素的尺寸，则会向两个方向溢出相同的长度）。
> - flex-start 元素位于容器的开头。弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴起始边界。
> - flex-end 元素位于容器的结尾。弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴结束边界。
> - baseline 元素位于容器的基线上。如弹性盒子元素的行内轴与侧轴为同一条，则该值与'flex-start'等效。其它情况下，该值将参与基线对齐。
