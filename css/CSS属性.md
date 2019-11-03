# CSS属性

## 第一部分 box属性(盒子属性)

> 控制文档元素生成的容器外观, 包括尺寸, 边距,填充和边框

### 1.1 尺寸: 控制元素容器高度和宽度

#### 1.1.1 height(高度)

> 属性值: 
>
> * auto	默认。浏览器会计算出实际的高度。
> * length	使用 px、cm 等单位定义高度。
> * %	基于包含它的块级对象的百分比高度。
> * inherit	规定应该从父元素继承 height 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS1 |

#### 1.1.2 min-height(最小高度)

> ***保证了盒子的最小高度, 当height的值小于min-height时, height属性失效***
>
> 属性值: 
>
> * length	定义元素的最小高度。默认值是 0。
> * %	定义基于包含它的块级对象的百分比最小高度。
> * inherit	规定应该从父元素继承 min-height 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS2 |

#### 1.1.3 max-height(最大高度)

> 属性值: 
>
> * none	默认。定义对元素被允许的最大高度没有限制。
> * length	定义元素的最大高度值。
> * %	定义基于包含它的块级对象的百分比最大高度。
>   	inherit	规定应该从父元素继承 max-height 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS2 |

#### 1.1.4 width(宽度)

> 属性值: 
>
> * auto	默认值。浏览器可计算出实际的宽度。
> * length	使用 px、cm 等单位定义宽度。
> * %	定义基于包含块（父元素）宽度的百分比宽度。
> * inherit	规定应该从父元素继承 width 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS1 |

#### 1.1.5 min-width(最小宽度)

> 属性值: 
>
> * none	默认。定义对元素被允许的最大高度没有限制。
> * length	定义元素的最大高度值。
> * %	定义基于包含它的块级对象的百分比最大高度。
>   	inherit	规定应该从父元素继承 max-height 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS2 |

#### 1.1.6 max-width(最大宽度)

> 属性值: 
>
> * none	默认。定义对元素被允许的最大高度没有限制。
> * length	定义元素的最大高度值。
> * %	定义基于包含它的块级对象的百分比最大高度。
>   	inherit	规定应该从父元素继承 max-height 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS2 |

### 1.2 边距

> 边距不会影响浮动元素 和 绝对定位元素, 因为浮动元素 和 绝对定位元素会从该文流程中删除

#### 1.2.1 margin-top

> 属性值: 允许负值
>
> * auto	浏览器设置的上外边距。
> * length	定义固定的上外边距。默认值是 0
> * %	定义基于父对象总宽度的百分比上外边距。
> * inherit	规定应该从父元素继承上外边距。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.2 margin-right

> 属性值: 允许负值
>
> * auto	浏览器设置的上外边距。
> * length	定义固定的上外边距。默认值是 0
> * %	定义基于父对象总宽度的百分比上外边距。
> * inherit	规定应该从父元素继承上外边距。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.3 margin-bottom

> 属性值: 允许负值
>
> * auto	浏览器设置的上外边距。
> * length	定义固定的上外边距。默认值是 0, 
> * %	定义基于父对象总宽度的百分比上外边距。
> * inherit	规定应该从父元素继承上外边距。
>
> **与margin-top属性不同, 元素的底部边距会推开该元素下方的浮动元素, 因为浮动元素是从标准流中他们当前的位置获取它们的垂直位置**

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.4 margin-left

> 属性值:  允许负值
>
> * auto	浏览器设置的上外边距。
> * length	定义固定的上外边距。默认值是 0
> * %	定义基于父对象总宽度的百分比上外边距。
> * inherit	规定应该从父元素继承上外边距。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 1.2.5 margin(连写属性)

> margin: { { length | percentage | auto }[^1 to 4 valuse] | inherit }

### 1.3 填充

#### 1.3.1 padding-top

> 属性值:   负值是不允许的。 
>
> * length	规定以具体单位计的固定的上内边距值，比如像素、厘米等。默认值是 0px。
> * %	定义基于父元素宽度的百分比上内边距。此值不会如预期的那样工作于所有的浏览器中。
> * inherit	规定应该从父元素继承上内边距。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.2 padding-right

> 属性值:   负值是不允许的。 
>
> * length	规定以具体单位计的固定的上内边距值，比如像素、厘米等。默认值是 0px。
> * %	定义基于父元素宽度的百分比上内边距。此值不会如预期的那样工作于所有的浏览器中。
> * inherit	规定应该从父元素继承上内边距。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.3 padding-bottom

> 属性值:   负值是不允许的。 
>
> * length	规定以具体单位计的固定的上内边距值，比如像素、厘米等。默认值是 0px。
> * %	定义基于父元素宽度的百分比上内边距。此值不会如预期的那样工作于所有的浏览器中。
> * inherit	规定应该从父元素继承上内边距。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.4 padding-left

> 属性值:   负值是不允许的。 
>
> * length	规定以具体单位计的固定的上内边距值，比如像素、厘米等。默认值是 0px。
> * %	定义基于父元素宽度的百分比上内边距。此值不会如预期的那样工作于所有的浏览器中。
> * inherit	规定应该从父元素继承上内边距。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0      | CSS1, CSS2.1 |

#### 1.3.5 padding(连写属性)

> padding: { { length | percentage}[^1 to 4 valuse] | inherit }

### 1.4 边框 和 轮廓

#### 1.4.1 border-color

> 设置4个边框颜色值 -- 也可分别设置4个边框(border-left(top,bottom,right)-color
>
> 初始值为元素的color属性值, 若是border-style属性为none,  则边框不显示
>
> 属性值:  
>
> * color	指定背景颜色。在CSS颜色值查找颜色值的完整列表
> * transparent	指定边框的颜色应该是透明的。这是默认
> * inherit	指定边框的颜色，应该从父元素继承

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 见备注 | CSS1, CSS2.1 |

#### 1.4.2 border-style

> 设置4个边框样式 -- 也可分别设置4个边框(border-left(top,bottom,right)-style
>
> **只有设置border-style, 边框才会显示**
>
> 属性值: 
>
> * none	定义无边框。
> * hidden	与 "none" 相同。不过应用于表时除外，对于表，hidden 用于解决边框冲突。
> * dotted	定义点状边框。在大多数浏览器中呈现为实线。
> * dashed	定义虚线。在大多数浏览器中呈现为实线。
>   	solid	定义实线。
> * double	定义双线。双线的宽度等于 border-width 的值。
> * groove	定义 3D 凹槽边框。其效果取决于 border-color 的值。
> * ridge	定义 3D 垄状边框。其效果取决于 border-color 的值。
> * inset	定义 3D inset 边框。其效果取决于 border-color 的值。
> * outset	定义 3D outset 边框。其效果取决于 border-color 的值。
> * inherit	规定应该从父元素继承边框样式。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | none   | CSS1, CSS2.1 |

#### 1.4.3 border-width

> border-width:  { { thin | medium | thick | length}[^1 to 4 valuse] | inherit }
>
> 设置4个边框样式 -- 也可分别设置4个边框(border-left(top,bottom,right)-width
>
> 属性值: 
>
> * thin	定义细的边框。
> * medium	默认。定义中等的边框。
>   	thick	定义粗的边框。
> * length	允许您自定义边框的宽度。
> * inherit	规定应该从父元素继承边框宽度。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | medium | CSS1 |

#### 1.4.4 border(连写属性)

> border: { [border-width] [border-style] [border-color] | inherit }

| 继承 | 初始值               | 版本 |
| ---- | -------------------- | ---- |
| 否   | 依据连写属性的初始值 | CSS1 |

 #### 1.4.5 ouline-color

> 属性值: 
>
> * color	指定轮廓颜色。在 CSS颜色值寻找颜色值的完整列表。
> * invert	默认。执行颜色反转（逆向的颜色）。可使轮廓在不同的背景颜色中都是可见。
> * inherit	规定应该从父元素继承轮廓颜色的设置。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | invert | CSS2, CSS2.1 |

#### 1.4.6 outline-style

> **只有设置了outline-style, 轮廓才会生效**
>
> 属性值: 
>
> * none	默认。定义无轮廓。
> * dotted	定义点状的轮廓。
> * dashed	定义虚线轮廓。
> * solid	定义实线轮廓。
> * double	定义双线轮廓。双线的宽度等同于 outline-width 的值。
> * groove	定义 3D 凹槽轮廓。此效果取决于 outline-color 值。
> * ridge	定义 3D 凸槽轮廓。此效果取决于 outline-color 值。
> * inset	定义 3D 凹边轮廓。此效果取决于 outline-color 值。
> * outset	定义 3D 凸边轮廓。此效果取决于 outline-color 值。
> * inherit	规定应该从父元素继承轮廓样式的设置。

| 继承 | 初始值 | 版本        |
| ---- | ------ | ----------- |
| 否   | none   | CSS2 CSS2.1 |

#### 1.4.7 outline-width

> 属性值: 
>
> * thin	规定细轮廓。
> * medium	默认。规定中等的轮廓。
> * thick	规定粗的轮廓。
> * length	允许您规定轮廓粗细的值。
> * inherit	规定应该从父元素继承轮廓宽度的设置。

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



## 第二部分 背景属性

> ***元素的背景是元素的总大小，包括填充和边界（但不包括边距)***

### 2.1 background-color

> 属性值: 
>
> * color	指定背景颜色。在CSS颜色值近可能的寻找一个颜色值的完整列表。
> * transparent	指定背景颜色应该是透明的。这是默认
>   	inherit	指定背景颜色，应该从父元素继承
> * inherit	指定背景颜色，应该从父元素继承

| 继承 | 初始值      | 版本 |
| ---- | ----------- | ---- |
| 否   | transparent | CSS1 |

### 2.2 bakground-iamge

> 属性值: 
>
> * url('URL')	图像的URL
> * none	无图像背景会显示。这是默认
> * inherit	指定背景图像应该从父元素继承

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS1 |

### 2.3 background-repeat

> 控制是否背景图像是否重复显示
>
> 属性值: 
>
> * repeat	背景图像将向垂直和水平方向重复。这是默认
> * repeat-x	只有水平位置会重复背景图像
> * repeat-y	只有垂直位置会重复背景图像
> * no-repeat	background-image不会重复
> * inherit	指定background-repea属性设置应该从父元素继承

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | repeat | CSS1 |

### 2.4 background-position

> 设置背景图像的初始位置
>
> 属性值: 
>
> * left top
>   left center
>   left bottom
>   right top
>   right center
>   right bottom
>   center top
>   center center
>   center bottom: 如果仅指定一个关键字，其他值将会是"center"
> * x% y%	第一个值是水平位置，第二个值是垂直。左上角是0％0％。右下角是100％100％。如果仅指定了一个值，其他值将是50％。 。默认值为：0％0％
> * xpos ypos	第一个值是水平位置，第二个值是垂直。左上角是0。单位可以是像素（0px0px）或任何其他 CSS单位。如果仅指定了一个值，其他值将是50％。你可以混合使用％和positions
> * inherit	指定background-position属性设置应该从父元素继承

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | 0 0    | CSS1, CSS2.1 |

### 2.5 background-attachment: 背景图片是否滚动

> 定义背景图片是随文档一同滚动还是固定在显示区中
>
> ***定义是基于视口的, 但是只有background-iamge的background-position属性与应用该背景图像的元素的内容，填充和边框区域一致时， 背景图像才会可见***
>
> 属性值: 
>
> * scroll	背景图片随着页面的滚动而滚动，这是默认的。
> * fixed	背景图片不会随着页面的滚动而滚动。
> * local	背景图片会随着元素内容的滚动而滚动。
> * inherit	指定 background-attachment 的设置应该从父元素继承

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | scroll | CSS1, CSS2.1 |

### 2.6 background(连写属性)

> 语法: **bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit;**
>
> 顺序没有强制顺序, 但是还是需要按照上面顺序

| 继承 | 初始值               | 版本         |
| ---- | -------------------- | ------------ |
| 否   | 与各属性的初始值一致 | CSS1, CSS2.1 |



***************************



## 第三部分 字体属性

> 设置文本字体

### 3.1 font-family

> 有两种类型的字体系列名称：
>
> - **family-name** - 指定的系列名称：具体字体的名称，比如："times"、"courier"、"arial"。
> - **generic-family** - 通常字体系列名称：比如："serif"、"sans-serif"、"cursive"、"fantasy"、"monospace。
>
> 属性值: 
>
> * family-name
>   generic-family: 用于某个元素的字体族名称或/及类族名称的一个优先表。默认值：取决于浏览器。
> *  inherit: 规定应该从父元素继承字体系列。

| 继承 | 初始值       | 版本      |
| ---- | ------------ | --------- |
| 是   | 取决于浏览器 | CSS1,CSS2 |

### 3.2 font-size

> 属性值: 
>
> * xx-small
>   x-small
>   small
>   medium
>   large
>   x-large
>   	xx-large: 把字体的尺寸设置为不同的尺寸，从 xx-small 				到 xx-large。默认值：medium。
> * smaller	把 font-size 设置为比父元素更小的尺寸。
> * larger	把 font-size 设置为比父元素更大的尺寸。
> * length	把 font-size 设置为一个固定的值。
> * %	把 font-size 设置为基于父元素的一个百分比值。
> * inherit	规定应该从父元素继承字体尺寸。
> * 

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | medium | CSS1, CSS2 |

### 3.3 font-weight

> ***有些字体(还跟浏览器有一定关系)只支持有限的字体粗细(normal和bold)***
>
> 属性值: 
>
> * normal	默认值。定义标准的字符。
> * bold	定义粗体字符。
> * bolder	定义更粗的字符。
> * lighter	定义更细的字符。
> * 100-900   定义由粗到细的字符。400 等同于 normal，而 700 等同于 bold。
> * inherit	规定应该从父元素继承字体的粗细。

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | normal | CSS1, CSS2 |

### 3.4 font-style

> 属性值:
>
> * normal	默认值。浏览器显示一个标准的字体样式。
> * italic	浏览器会显示一个斜体的字体样式。
> * oblique	浏览器会显示一个倾斜的字体样式。
> * inherit	规定应该从父元素继承字体样式。

| 继承 | 初始值 | 版本      |
| ---- | ------ | --------- |
| 是   | normal | CSS1,CSS2 |

### 3.5 font-variant

> 设置元素文本小型大写字母文本 -- 很少见
>
> 属性值: 
>
> * normal	默认值。浏览器会显示一个标准的字体。
> * small-caps	浏览器会显示小型大写字母的字体。
> * inherit	规定应该从父元素继承 font-variant 属性的值。

| 继承 | 初始值 | 版本      |
| ---- | ------ | --------- |
| 是   | normal | CSS1,CSS2 |

### 3.6 font(连写属性)

> 可设置的属性是（按顺序）： "font-style font-variant font-weight font-size/line-height font-family"
>
> ***font-size 和 font-family是必须指定的***

| 继承 | 初始值               | 版本       |
| ---- | -------------------- | ---------- |
| 是   | 基于每个属性的初始值 | CSS1, CSS2 |



****



## 第四部分 文本属性

### 4.1 color

> 属性值: 
>
> * *color_name*: 规定颜色值为颜色名称的颜色（比如 red）
> * *hex_number*: 规定颜色值为十六进制值的颜色（比如 #ff0000）
> * *rgb_number*: 规定颜色值为 rgb 代码的颜色（比如 rgb(255,0,0)）
> * inherit: 规定应该从父元素继承颜色

| 继承 | 初始值             | 版本         |
| ---- | ------------------ | ------------ |
| 是   | 依照浏览器渲染不同 | CSS1, CSS2.1 |

### 4.2 line-height

> 属性值:
>
> *  normal:  默认。设置合理的行间距。 
> *  *number*:  设置数字,此数字会与当前的字体尺寸相乘来设置行间距。
> *  *length*: 设置固定的行间距。
> * %:  基于当前字体尺寸的百分比行间距。 
> *  inherit: 规定应该从父元素继承 line-height 属性的值。

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | normal | CSS1, CSS2 |



### 4.3 letter-spacing: 字符间距

> 属性值: 
>
> *  normal: 默认。规定字符间没有额外的空间。
> *  *length*: 定义字符间的固定空间(允许使用负值)。
> *  inherit: 规定应该从父元素继承 letter-spacing 属性的值。

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | normal | CSS1, CSS2 |

### 4.4 word-spacing: 单词的间距

> 属性值: 
>
> *  normal: 默认。规定字符间没有额外的空间。
> *  *length*: 定义字符间的固定空间(允许使用负值)。
> *  inherit: 规定应该从父元素继承 letter-spacing 属性的值。

### 4.5 text-align

> 属性值: 
>
> * left 把文本排列到左边。默认值：由浏览器决定。
> * right 	把文本排列到右边。
> * center 	把文本排列到中间。
> * justify 	实现两端对齐文本效果。
> * inherit 	规定应该从父元素继承 text-align 属性的值。

| 继承 | 初始值                | 版本       |
| ---- | --------------------- | ---------- |
| 是   | 跟direction属性值有关 | CSS1, CSS2 |

### 4.6 text-decoration: 下划线、上划线等

> 属性值: 
>
> * none	默认。定义标准的文本。
> * underline	定义文本下的一条线。
> * overline	定义文本上的一条线。
> * line-through	定义穿过文本下的一条线。
> * blink	定义闪烁的文本。
> * inherit	规定应该从父元素继承 text-decoration 属性的值。

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 否   | none   | CSS1, CSS2 |

### 4.7 text-indent: 第一个文本缩进量

> 属性值: 
>
> * length	定义固定的缩进, 允许负值
> * %	定义基于父元素宽度的百分比的缩进。
> * inherit	规定应该从父元素继承 text-indent 属性的值。

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | 0      | CSS1, CSS2 |

### 4.8 text-transform: 控制字母大小写

> 属性值: 
>
> * none	默认。定义带有小写字母和大写字母的标准的文本。
> * capitalize	文本中的每个单词以大写字母开头。
> * uppercase	定义仅有大写字母。
> * lowercase	定义无大写字母，仅有小写字母。
> *  inherit	规定应该从父元素继承 text-transform 属性的值。

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | none   | CSS1, CSS2 |

### 4.9 text-shadow

> 语法: text-shadow: h-shadow v-shadow blur color;
>
> 属性值: 
>
> * h-shadow	必需。水平阴影的位置。允许负值。
> * v-shadow	必需。垂直阴影的位置。允许负值。
> * blur	可选。模糊的距离。
> * color	可选。阴影的颜色

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 否   | none   | CSS2, CSS3 |

### 4.10 vertical-align: 文本垂直对齐方式

> 在表单元格中，这个属性会设置单元格框中的单元格内容的对齐方式。 
>
> 属性值: 
>
> * length: 使元素的基线对齐到父元素的基线之上的给定长度。可以是负数。
>* percentage:  使元素的基线对齐到父元素的基线之上的给定百分比，该百分比是line-height属性的百分比。可以是负数。 
> * baseline: ***将子box的基线与其父box的基线对齐. 如果该子box没有基线(例如图像), 那么会将该子box边距的底部边缘与其父元素的基线对齐.*** 
> * sub:  使元素的基线与父元素的下标基线对齐。 
> * super:  使元素的基线与父元素的上标基线对齐。 
> * text-top: 使元素的顶部与父元素的字体顶部对齐。
> * text-bottom: 使元素的底部与父元素的字体底部对齐。
> * middle: 使元素的中部与父元素的基线加上父元素x-height的一半对齐。
> * top: 使元素及其后代元素的顶部与整行的顶部对齐。
> * bottom: 使元素及其后代元素的底部与整行的底部对齐。

| 继承 | 初始值   | 版本       |
| ---- | -------- | ---------- |
| 否   | baseline | CSS1, CSS2 |

### 4.11 white-space: 控制对元素内部空白的处理

> white-space: { normal | nowrap | pre | pre-line | pre-wrap | inherit }
>
> 空白: 空白字符、制表符、换行、回车和换页的统称。 ***通常客户端会将连续的空白字符折叠为一个空白字符***
>
> 属性值:
>
> * normal: 将连续的空白折叠为一个空白字符
> * nowrap: 文本不会换行,文本会在在同一行上继续,直到遇到 \<br> 标签为止。
> * pre: 空白会被浏览器保留。其行为方式类似 HTML 中的\<pre> 标签。
> * pre-wrap: 保留空白符序列,但是正常地进行换行。
> * pre-line: 合并空白符序列,但是保留换行符。

| 继承 | 初始值 | 版本      |
| ---- | ------ | --------- |
| 是   | normal | CSS1,CSS2 |

### 4.12 direction:  文本方向/书写方向。 

> 属性值: 
>
> * ltr: 文本方向从左到右
> * rtl: 文本方向从右到左
> * inherit: 继承父元素
>
> 必须将unicode-bidi属性设置为embed值 或 override值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 是   | ltr    | CSS2 |

### 4.13 unicode-bidi

> 来设置或返回文本是否被重写，以便在同一文档中支持多种语言。 
>
> 属性值: 
>
> *  normal:  不使用附加的嵌入层面。 
> * embed: 创建一个附加的嵌入层面。
> *  bidi-override:  创建一个附加的嵌入层面。重新排序取决于 direction 属性。 
> * inherit: 继承父元素

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | normal | CSS2 |



****



## 第五部分 布局属性

> 控制盒子的可见性、位置、行为

### 5.1 display

> ***可以通过控制此属性控制元素的box类型(也就是说, div元素也可以通过改变display元素来具有tbale元素的特性)***
>
> 属性值: 
>
> * none: 此元素不会被显示
> * block: 块级元素, 独占一行
> * inline: 默认. 内联元素, 元素前后没有换行符
> * inline-block: 行内块元素(CSS2.1新增)
> * list-item: 此元素会作为列表显示
> * run-in: 此元素会根据上下文作为块级元素或内联元素显示
> * table	此元素会作为块级表格来显示（类似 \<table>），表格前后带有换行符。
> * inline-table	此元素会作为内联表格来显示（类似 \<table>），表格前后没有换行符。
> * table-row-group	此元素会作为一个或多个行的分组来显示（类似 \<tbody>）。
> * table-header-group	此元素会作为一个或多个行的分组来显示（类似\<thead>）。
> * table-footer-group	此元素会作为一个或多个行的分组来显示（类似\<tfoot>）。
> * table-row	此元素会作为一个表格行显示（类似 \<tr>）。
> * table-column-group	此元素会作为一个或多个列的分组来显示（类似\<colgroup>）。
> * table-column	此元素会作为一个单元格列显示（类似\<col>）
> * table-cell	此元素会作为一个表格单元格显示（类似 \<td> 和\<th>）
> * table-caption	此元素会作为一个表格标题显示（类似\<caption>）
> * inherit	规定应该从父元素继承 display 属性的值。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | inline | CSS1, 2, 2.1 |

### 5.2 position

> 控制元素的位置,***带有position值而非static值得box被称为定位box, 在堆叠内容中的垂直位置是由z-index属性决定的***
>
> 属性值: 
>
> * absolute: 绝对定位, 相对于static定位以外的第一个父元素进行定位
> * relative: 相对定位, 相对于其正常位置进行定位
> * fixed: 生成固定定位的元素, 相对于浏览器窗口进行定位
> * static: 默认值, 没有定位, 元素出现在正常的文档流中
> * ***sticky: 粘性定位，该定位基于用户滚动的位置。它的行为就像 position:relative; 而当页面滚动超出目标区域时，它的表现就像 position:fixed;，它会固定在目标位置。注意: Internet Explorer, Edge 15 及更早 IE 版本不支持 sticky 定位。 Safari 需要使用 -webkit- prefix (查看以下实例)。***
> * inherit: 父元素继承

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | static | CSS2 |

### 5.3 top

> 属性值: 
>
> * auto: 默认值. 通过浏览器计算上边缘的位置
> * %: 以包含元素(相对于static定位以外的第一个父元素进行定位)为基准. 可负值
> * length: 可负值
> * inherit: 父元素继承

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS2 |

### 5.4 bottom

> 属性值: 
>
> * auto: 默认值. 通过浏览器计算上边缘的位置
> * %: 以包含元素(相对于static定位以外的第一个父元素进行定位)为基准. 可负值
> * length: 可负值
> * inherit: 父元素继承

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS2 |

### 5.5 right

> 属性值: 
>
> * auto: 默认值. 通过浏览器计算上边缘的位置
> * %: 以包含元素(相对于static定位以外的第一个父元素进行定位)为基准. 可负值
> * length: 可负值
> * inherit: 父元素继承

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS2 |

### 5.6 left

> 属性值: 
>
> * auto: 默认值. 通过浏览器计算上边缘的位置
> * %: 以包含元素(相对于static定位以外的第一个父元素进行定位)为基准. 可负值
> * length: 可负值
> * inherit: 父元素继承

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS2 |

### 5.7 z-index

> **层叠级别是指box在z轴上的位置, 值越高, box距离用户就会越近**
>
> 属性值: 
>
> * auto: 默认, **堆叠顺序与父元素相等**
> * number: 设置元素的堆叠顺序
> * inherit: 继承父元素

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS2 |

### 5.8 float

> 属性值:
>
> * left: 向左浮动
> * right: 向右浮动
> * none: 默认值, 不浮动
> * inherit: 继承父元素

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS1 |

### 5.9 clear:  指定段落的左侧或右侧不允许浮动的元素。 

> 属性值: 
>
> * left: 在左侧不允许浮动元素
> * right: 在右侧不允许浮动元素
> * both: 左右两侧均不允许浮动元素
> * none: 默认值, 允许浮动元素出现在两侧
> * inherit: 继承父元素

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS1 |

### 5.10 visibility

> 指定元素是否可见, **即使在标准流中隐藏box, 仍会影响其他元素的布局, 这与通过将display属性设置为none来禁止生成box的行为不同**
>
> ***将隐藏box的子box的visibility属性设置为visible, 那么它们就会显示, 而display属性被设置为none的元素的子元素永远不会生成它们自己的box.***
>
> 属性值: 
>
> * visible: 默认值, 元素是可见的
> * hidden: 元素是不可见的
> * collapse:  当在表格元素中使用时，此值可删除一行或一列，但是它不会影响表格的布局。被行或列占据的空间会留给其他内容使用。如果此值被用在其他的元素上，会呈现为 "hidden"。 
> * inherit: 继承父元素

| 继承 | 初始值  | 版本         |
| ---- | ------- | ------------ |
| 是   | visible | CSS2, CSS2.1 |

### 5.11 overflow

> 指定元素内容溢出元素box时的行为
>
> 滚动栏占据的空间(客户端决定)应该从计算的宽度 和 高度中减去, 在padding外面
>
> 属性值: 
>
> * visible: 默认值. 内容不会被裁减, 会呈现在元素框之外
> * hidden: 内容被裁减, 并且其余内容是不可见的
> * scroll: 内容会被裁减, 显示滚动条(一定会显示)
> * auto: 如果内容被裁减, 才会显示滚动条
> * inherit: 父元素继承

| 继承 | 初始值  | 版本 |
| ---- | ------- | ---- |
| 否   | visible | CSS2 |

### 5.12 clip: 裁减区域

> 为绝对定位元素设置裁减区域
>
> 属性值:
>
> * shape	设置元素的形状。唯一合法的形状值是：rect (top, right, bottom, left)
> * auto	默认值。不应用任何剪裁。
> * inherit	规定应该从父元素继承 clip 属性的值。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | auto   | CSS2, CSS2.1 |



****



## 第六部分 列表属性

> 控制列表项标记的外观

### 6.1 list-style-type

> 指定列表中项目标记的类型
>
> ***列表标记的颜色与列表项color属性的计算值相同***
>
> 属性值: 
>
> * none	无标记。
> * disc	默认。标记是实心圆。
>   	circle	标记是空心圆。
> * square	标记是实心方块。
> * decimal	标记是数字。
> * decimal-leading-zero	0开头的数字标记。(01, 02, 03, 等。)
> * lower-roman	小写罗马数字(i, ii, iii, iv, v, 等。)
> * upper-roman	大写罗马数字(I, II, III, IV, V, 等。)
> * lower-alpha	小写英文字母The marker is lower-alpha (a, b, c, d, e, 等。)
> * upper-alpha	大写英文字母The marker is upper-alpha (A, B, C, D, E, 等。)
> * lower-greek	小写希腊字母(alpha, beta, gamma, 等。)
> * lower-latin	小写拉丁字母(a, b, c, d, e, 等。)
> * upper-latin	大写拉丁字母(A, B, C, D, E, 等。)
> * hebrew	传统的希伯来编号方式
> * armenian	传统的亚美尼亚编号方式
> * georgian	传统的乔治亚编号方式(an, ban, gan, 等。)
> * cjk-ideographic	简单的表意数字
> * hiragana	标记是：a, i, u, e, o, ka, ki, 等。（日文片假名）
> * katakana	标记是：A, I, U, E, O, KA, KI, 等。（日文片假名）
> * hiragana-iroha	标记是：i, ro, ha, ni, ho, he, to, 等。（日文片假名）
> * katakana-iroha	标记是：I, RO, HA, NI, HO, HE, TO, 等。（日文片假名）

| 继承 | 初始值 | 版本       |
| ---- | ------ | ---------- |
| 是   | disc   | CSS1, CSS2 |

### 6.2 list-style-position

> 指示如何相对于对象的内容绘制列表项标记。 
>
> 属性值: 
>
> * inside	列表项目标记放置在文本以内，且环绕文本根据标记对齐。
> * outside	默认值。保持标记位于文本的左侧。列表项目标记放置在文本以外，且环绕文本不根据标记对齐。
> * inherit	规定应该从父元素继承 list-style-position 属性的值。

| 继承 | 初始值  | 版本 |
| ---- | ------- | ---- |
| 是   | outside | CSS1 |

![list-style-position](./list-style-position.png 'list-style-position')

### 6.3 list-style-image

> ***将图像指定为列表(display属性值为list-item的元素)中项目的列表标记. 如果可以获取指定的图像, 那么该图像会代替所有由list-style-type属性指定的标记***
>
> 属性值:
>
> * URL	图像的路径。
> * none	默认。无图形被显示。
> * inherit	规定应该从父元素继承 list-style-image 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 是   | none   | CSS1 |

### 6.4 list-style

> 可以设置的属性（规范顺序, 但不强制顺序）： list-style-type, list-style-position, list-style-image.
>
> 可以不设置其中的某个值，比如 "list-style:circle inside;" 也是允许的。未设置的属性会使用其默认值。

| 继承 | 初始值       | 版本 |
| ---- | ------------ | ---- |
| 是   | 各属性初始值 | CSS1 |



****



## 第七部分 表属性

> 控制表元素的布局和外观

### 7.1 table-layout:  设置表格布局算法 

> **指定用于对表或内联表进行显示(display属性被指定为table或inline-table的元素)的布局算法.**
>
> 属性值: 
>
> * auto 默认。列宽度由单元格内容设定
> * fixed	列宽由表格宽度和列宽度设定。
> * inherit	规定应该从父元素继承 table-layout 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS2 |

### 7.2 border-collapse:   设置表格的边框是否被合并为一个单一的边框 

> **指定用于表或内联表(display属性被置顶位table 或 inline-table的元素)的边框模式**
>
> 属性值: 
>
> * collapse	如果可能，边框会合并为一个单一的边框。会忽略 border-spacing 和 empty-cells 属性
> * separate	默认值。边框会被分开。不会忽略 border-spacing 和 empty-cells 属性
> * inherit	规定应该从父元素继承 border-collapse 属性的值

| 继承 | 初始值   | 版本         |
| ---- | -------- | ------------ |
| 是   | separate | CSS2, CSS2.1 |

### 7.3 border-spacing:  设置相邻单元格的边框间的距离 

> 属性值: 
>
> * length length	规定相邻单元的边框之间的距离。使用 px、cm 等单位。不允许使用负值。
>   * 如果定义一个 length 参数，那么定义的是水平和垂直间距。
>   * 如果定义两个 length 参数，那么第一个设置水平间距，而第二个设置垂直间距。
> * inherit	指定应该从父元素继承border - spacing属性的值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 是   | 0      | CSS2 |

### 7.4 empty-cells:  是否显示表格中的空单元格 

> 属性值: 
>
> * hide	不在空单元格周围绘制边框。
> * show	在空单元格周围绘制边框。默认。
> * inherit	规定应该从父元素继承 empty-cells 属性的值。

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 是   | show   | CSS2 |

### 7.5 caption-side:  设置表格标题的位置

> 属性值: 
>
> * top	默认值。把表格标题定位在表格之上。
> * bottom	把表格标题定位在表格之下。
> * inherit	规定应该从父元素继承 caption-side 属性的值。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 否   | top    | CSS2, CSS2.1 |



****



## 第八部分 其他属性

### 8.1 cursor

> 属性值: 
>
> * url	需使用的自定义光标的 URL。注释：请在此列表的末端始终定义一种普通的光标，以防没有由 URL 定义的可用光标。
> * default	默认光标（通常是一个箭头）
> * auto	默认。浏览器设置的光标。
> * crosshair	光标呈现为十字线。
> * pointer	光标呈现为指示链接的指针（一只手）
> * move	此光标指示某对象可被移动。
> * e-resize	此光标指示矩形框的边缘可被向右（东）移动。
> * ne-resize	此光标指示矩形框的边缘可被向上及向右移动（北/东）。
> * nw-resize	此光标指示矩形框的边缘可被向上及向左移动（北/西）。
> * n-resize	此光标指示矩形框的边缘可被向上（北）移动。
> * se-resize	此光标指示矩形框的边缘可被向下及向右移动（南/东）。
> * sw-resize	此光标指示矩形框的边缘可被向下及向左移动（南/西）。
> * s-resize	此光标指示矩形框的边缘可被向下移动（北/西）。
> * w-resize	此光标指示矩形框的边缘可被向左移动（西）。
> * text	此光标指示文本。
> * wait	此光标指示程序正忙（通常是一只表或沙漏）。
> * help	此光标指示可用的帮助（通常是一个问号或一个气球）。

| 继承 | 初始值 | 版本         |
| ---- | ------ | ------------ |
| 是   | auto   | CSS2, CSS2.1 |

### 8.2 分页媒介属性: 可以控制在分页媒介(如印刷物)上内容的显示方式, 分页媒介与连续性媒介(如计算机的屏幕是相对的)

> * page-break-before属性
> * page-break-inside属性
> * page-break-after属性
> * orphans属性
> * widows属性







[^1 to 4 valuse]: 设置四个值
[^ 1 or 2 values]:设置两个值