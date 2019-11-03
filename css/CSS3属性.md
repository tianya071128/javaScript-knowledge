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

