## 线性渐变

**概念:** 向下/向上/向左/向右/对角方向. **为了创建一个线性渐变，必须至少定义两种颜色结点。颜色结点即想要平稳过渡的颜色。同时，可以设置一个起点和一个方向（或一个角度）**

* 语法

  `background-image: linear-gradient([ to <side-or-corner> | <angle> ]?, color-stop1, color-stop2, ...)`

* 渐变轴(梯度线)

  很重要, 详情见 [MDN-线形渐变的构成](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient#线形渐变的构成)

* 值

  * `<side-or-corner>` :  **描述渐变线的起始点位置。** 它包含to和两个关键词：第一个指出水平位置left or right，第二个指出垂直位置top or bottom。关键词的先后顺序无影响，且都是可选的。to top, to bottom, to left 和 to right这些值会被转换成角度0度、180度、270度和90度。其余值会被转换为一个以向顶部中央方向为起点顺时针旋转的角度。渐变线的结束点与其起点中心对称。

  * `<angle>`:  用角度值指定渐变的方向（或角度）。角度顺时针增加。 

    > 角度是指水平线和渐变线之间的角度，逆时针方向计算。换句话说，0deg 将创建一个从下到上的渐变，90deg 将创建一个从左到右的渐变。
    >
    > **但是，请注意很多浏览器（Chrome、Safari、firefox等）的使用了旧的标准，即 0deg 将创建一个从左到右的渐变，90deg 将创建一个从下到上的渐变。换算公式 90 - x = y 其中 x 为标准角度，y为非标准角度。**
    >
    >  ![img](https://www.runoob.com/wp-content/uploads/2014/07/7B0CC41A-86DC-4E1B-8A69-A410E6764B91.jpg) 

  * `<linear-color-stop>`:  由一个值`<color>`组成，并且跟随着一个可选的终点位置（可以是一个百分比值或者是沿着渐变轴的`<length>`）。 

  * `<color-hint>`:  颜色中转点是一个插值提示，它定义了在相邻颜色之间渐变如何进行。长度定义了在两种颜色之间的哪个点停止渐变颜色应该达到颜色过渡的中点。如果省略，颜色转换的中点是两个颜色停止之间的中点。  

* 实例

  ![image-20200320161524262](..\image\线性渐变.png)



## 径向渐变

**概念:**  创建了一个图片，其由一个从原点辐射开的在两个或者多个颜色之前的渐变组成。 

> 创建一个径向渐变，你也必须至少定义两种颜色结点。颜色结点即你想要呈现平稳过渡的颜色。同时，你也可以指定渐变的中心、形状（圆形或椭圆形）、大小。**默认情况下，渐变的中心是 center（表示在中心点），渐变的形状是 ellipse（表示椭圆形），渐变的大小是 farthest-corner（表示到最远的角落）。** 







































