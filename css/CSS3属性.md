# CSS3属性

## 第一部分 CSS3边框

### 1.1 border-radius

> 四个属性的连写: 
>
> *  border-top-left-radius 
> *  border-top-right-radius 
> *  border-bottom-right-radius 
> *  border-bottom-left-radius 
>
> ***每个半径的四个值的顺序是：左上角，右上角，右下角，左下角***
>
> 属性值: 
>
> * length	定义弯道的形状
> * %	使用%定义角落的形状(**水平半轴相对于盒模型的宽度；垂直半轴相对于盒模型的高度**)

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS3 |

### 1.2 box-shadow

>  **box-shadow以由逗号分隔的列表来描述一个或多个阴影效果。该属性可以让几乎所有元素的边框产生阴影**
>
>  语法: 
>
>  ```css
>  /* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
>  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
>  ```
>
>   属性值: 
>
>  * h-shadow	必需的。水平阴影的位置。允许负值
>  * v-shadow	必需的。垂直阴影的位置。允许负值
>  * blur	可选。模糊距离
>  * spread	可选。阴影的大小
>  * color	可选,阴影的颜色,在CSS颜色值寻找颜色值的完整列表
>  * inset	可选。从外层的阴影（开始时）改变阴影内侧阴影

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS3 |

### 1.3 border-image-source

> 作用: 指定图片边框所使用的图像
>
> 属性值: 
>
> * none: 没有图像被使用
> * image: 边框使用图像的路径

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS3 |

### 1.4 border-image-slice

> 作用: 指定图像的边界向内偏移
>
> 语法: border-image-slice: *number*|*%*|fill;
>
> **注意:** 此属性指定顶部，右，底部，左边缘的图像向内偏移，分为九个区域：四个角，四边和中间。图像中间部分将被丢弃（完全透明的处理），除非填写关键字。如果省略第四个数字/百分比，它和第二个相同的。如果也省略了第三个，它和第一个是相同的。如果也省略了第二个，它和第一个是相同的。
>
> 属性值: 
>
> * number	数字表示图像的像素（位图图像）或向量的坐标（如果图像是矢量图像）
> * %	百分比图像的大小是相对的：水平偏移图像的宽度，垂直偏移图像的高度
> * fill	保留图像的中间部分

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 100%   | CSS3 |

### 1.5 border-image-width

> 作用: 指定图像的边界的宽度
>
> 语法: border-image-width: *number*|*%*|auto;
>
>  **注意：** border-image -width的4个值指定用于把border图像区域分为九个部分。他们代表上，右，底部，左，两侧向内距离。如果第四个值被省略，它和第二个是相同的。如果也省略了第三个，它和第一个是相同的。如果也省略了第二个，它和第一个是相同的。负值是不允许的。 
>
> 属性值: 
>
> * number	表示相应的border-width 的倍数
> * %	边界图像区域的大小：横向偏移的宽度的面积，垂直偏移的高度的面积
> * auto	如果指定了，宽度是相应的image slice的内在宽度或高度

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 1      | CSS3 |

### 1.6 border-image-outset

> 作用: 指定在边框外部绘制 border-image-area的量
>
> 语法: border-image-outset: *length*|*number*;
>
> **注意：** border-image-outset用于指定在边框外部绘制 border-image-area 的量。包括上下部和左右部分。如果第四个值被省略，它和第二个是相同的。如果也省略了第三个，它和第一个是相同的。如果也省略了第二个，它和第一个是相同的。不允许border-im-outset拥有负值。
>
> 属性值: 
>
> * length	 设置边框图像与边框（border-image）的距离，默认为0
> * number	代表相应的 border-width 的倍数

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS3 |

### 1.7 border-image-repeat

> 作用:  用于图像边界是否应重复（repeated）、拉伸（stretched）或铺满（rounded）
>
>  **注意：** 该属性规定如何延展和铺排边框图像的边缘和中间部分。因此，您可以规定两个值。如果省略第二个值，则采取与第一个值相同的值。 
>
> 属性值: 
>
> * stretch	默认值。拉伸图像来填充区域	
> * repeat	平铺（repeated）图像来填充区域。
> * round	类似 repeat 值。如果无法完整平铺所有图像，则对图像进行缩放以适应区域。
> * space	类似 repeat 值。如果无法完整平铺所有图像，扩展空间会分布在图像周围	
> * initial	将此属性设置为默认值
> * inherit	从父元素中继承该属性

| 继承 | 默认值  | 版本 |
| ---- | ------- | ---- |
| 否   | stretch | CSS3 |

### 1.8 border-image

> 作用: 连写属性:  用于设置 [border-image-source](https://www.runoob.com/cssref/css3-pr-border-image-source.html), [border-image-slice](https://www.runoob.com/cssref/css3-pr-border-image-slice.html), [border-image-width](https://www.runoob.com/cssref/css3-pr-border-image-width.html), [border-image-outset](https://www.runoob.com/cssref/css3-pr-border-image-outset.html) 和[border-image-repeat](https://www.runoob.com/cssref/css3-pr-border-image-repeat.html) 的值。 
>
> 语法:
> border-image: source slice width outset repeat|initial|inherit;
>
> 此属性IE11+才支持

| 继承 | 默认值                | 版本 |
| ---- | --------------------- | ---- |
| 否   | none 100% 1 0 stretch | CSS3 |



****



## 第二部分 CSS3背景

### 2.1 background-image

> CSS3在以前基础上允许元素使用多个背景图像, 用逗号隔开
>
> 注意: 
>
> * **在绘制时，图像以 z 方向堆叠的方式进行。先指定的图像会在之后指定的图像上面绘制。因此指定的第一个图像“最接近用户”。**
> * **然后元素的边框 border 会在它们之上被绘制，而 background-color 会在它们之下绘制。图像的绘制与盒子以及盒子的边框的关系，需要在CSS属性background-clip 和 background-origin 中定义。**
> * **如果一个指定的图像无法被绘制 (比如，被指定的 URI 所表示的文件无法被加载)，浏览器会将此情况等同于其值被设为 none。**

### 2.2 background-size

> 作用: 指定背景图片大小
>
> 属性值: 
>
> * length	设置背景图片高度和宽度。第一个值设置宽度，第二个值设置的高度。如果只给出一个值，第二个是设置为 auto(自动)
> * percentage	**将计算相对于背景定位区域的百分比。**第一个值设置宽度，第二个值设置的高度。**如果只给出一个值，第二个是设置为"auto(自动)"**
> * cover	此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小。
> * contain	此时会保持图像的纵横比并将图像缩放成将适合背景定位区域的最大大小。
> * auto 以背景图片的比例缩放背景图片。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS3 |

### 2.3 background-origin

> 作用: 规定background-position属性相对于什么位置来定位
>
> 注意: 如果背景图像的 background-attachment属性为"fixed", 则该属性没有效果
>
> 属性值: 
>
> * padding-box	背景图像相对于内边距框来定位。
> * border-box	背景图像相对于边框盒来定位
> * content-box	背景图像相对于内容框来定位。	

| 继承 | 默认值      | 版本 |
| ---- | ----------- | ---- |
| 否   | padding-box | CSS3 |

### 2.4 background-clip

> 作用: 设置元素的背景(背景图片 或 颜色)是否延伸到边框下面
>
> 属性值: 
>
> * border-box	背景被裁剪到边框盒
> * padding-box	背景被裁剪到内边距框
> * content-box	背景被裁剪到内容框。

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
> - background-size只能紧接着 background-position 出现，以"/"分割，如： "center/80%".
> - \<box>可能出现 0 次、1 次或 2 次。 如果出现 1 次，它同时设定 background-origin 如果出现 2 次，第一次的出现设置 background-origin,  第二次的出现设置background-clip
> - background-color 只能被包含在最后一层。



****



## 第三部分 文本效果

### 3.1 text-wrap: 规定文本的换行规则

> 作用: 规定文本的换行(折行)规则
>
> 浏览器支持: 目前主流浏览器都不支持 text-wrap 属性。
>
> 属性值: 
>
> normal	只在允许的换行点进行换行。
>
> none	不换行。元素无法容纳的文本会溢出。
>
> unrestricted	在任意两个字符间换行。
>
> suppress	压缩元素中的换行。浏览器只在行中没有其他有效换行点时进行换行。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | normal | CSS3 |

### 3.2 word-break: 规定自动换行的处理方法

> 作用: 指定非CJK脚本(中日韩)的断行规则
>
> 属性: 
>
> * normal	使用浏览器默认的换行规则。
> * break-all	允许在单词内换行。
> * keep-all	只能在半角空格或连字符处换行。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | normal | CSS3 |

### 3.3 word-wrap: 允许长的内容可以自动换行

> 作用: 允许长的内容可以自动换行
>
> 属性: 
>
> * normal	只在允许的断字点换行（浏览器保持默认处理）。
> * break-word	在长单词或 URL 地址内部进行换行。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | normal | CSS3 |

### 3.4 text-shadow: 文字阴影

> 作用: 添加阴影, 可以添加多个, 用多个隔开
>
> 语法: text-shadow: h-shadow v-shadow blur color;
>
> 注意： text-shadow属性连接一个或更多的阴影文本。属性是阴影，指定的每2或3个长度值和一个可选的颜色值用逗号分隔开来。已失时效的长度为0。
>
> 值: 
>
> * h-shadow	必需。水平阴影的位置。允许负值。
> * v-shadow	必需。垂直阴影的位置。允许负值。
> * blur	可选。模糊的距离。
> * color	可选。阴影的颜色。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 是   | none   | CSS3 |



### 3.5 text-overflow: 处理文本溢出的部分

> 作用: 指定文本溢出时, 如何处理溢出的文字, 通常配合white-space: nowrap 和 overflow:hidden属性
>
> 属性值: 
>
> * clip	修剪文本。
> * ellipsis	显示省略符号来代表被修剪的文本。
> * string	使用给定的字符串来代表被修剪的文本。 只在 Firefox 浏览器下有效 

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | clip   | CSS3 |

### 3.6 其他属性: 支持度很差

> * hanging-punctuation	规定标点字符是否位于线框之外。
> * punctuation-trim	规定是否对标点字符进行修剪
> * text-align-last	设置如何对齐最后一行或紧挨着强制换行符之前的行
> * text-emphasis	向元素的文本应用重点标记以及重点标记的前景色
> * text-justify	规定当 text-align 设置为 "justify" 时所使用的对齐方法
> * text-outline	规定文本的轮廓。



****



## 第四部分 盒子box属性

### 4.1 box-sizing: 设置盒子的模型

> 作用: 定义了如何计算一个元素的宽度和高度.
>
> 属性值:
>
> * content-box: windth和height = 盒子content内容的宽高
> * border-box: windth和height = 盒子content内容的宽高 + padding + border
> * inherit: 继承父元素

| 继承 | 默认值      | 版本 |
| ---- | ----------- | ---- |
| 否   | content-box | CSS3 |

### 4.2 resize: 元素是否可以调整大小

> 作用: 指定一个元素是否可以由客户调整大小
>
> 注意:  兼容性问题－IE不支持
>
> 属性值: 
>
> * none	用户无法调整元素的尺寸。
> * both	用户可调整元素的高度和宽度。
> * horizontal	用户可调整元素的宽度。
> * vertical	用户可调整元素的高度。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS3 |

### 4.3 outline-offset: 轮廓线在border边缘外的偏移

> 作用: 设置轮廓线距离border的偏移
>
> 注意:  兼容性问题－IE不支持
>
> 属性值:
>
> * length	轮廓与边框边缘的距离。允许负值
>   inherit	规定应从父元素继承 outline-offset 属性的值。

| 继承 | 默认值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS3 |

### 4.4 其他属性: 支持度很差

> * appearance	允许您使一个元素的外观像一个标准的用户界面元素
> * icon	为创作者提供了将元素设置为图标等价物的能力。	
> * nav-down	指定在何处使用箭头向下导航键时进行导航
> * nav-index	指定一个元素的Tab的顺序
> * nav-left	指定在何处使用左侧的箭头导航键进行导航
> * nav-right	指定在何处使用右侧的箭头导航键进行导航
> * nav-up	指定在何处使用箭头向上导航键时进行导航