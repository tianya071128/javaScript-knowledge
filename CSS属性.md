# CSS属性

## 2. box属性(盒子属性)

> 控制文档元素生成的容器外观, 包括尺寸, 边距,填充和边框

### 2.1 尺寸: 控制元素容器高度和宽度

#### 2.1.1 height(高度)

> height: { length| auto| inherit | percentage(百分比, 基于父元素高度) }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS1 |

#### 2.1.2 min-height(最小高度)

> min-height: {  length | prcentage | inherit }
>
> 保证了盒子的最小高度, 当height的值小于min-height时, height属性失效

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS2 |

#### 2.1.3 max-height(最大高度)

> max-height: { length | percentage | none | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS2 |

#### 2.1.4 width(宽度)

> width: { length | percentage | auto | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | auto   | CSS1 |

#### 2.1.5 min-width(最小宽度)

> min-width: { length | percentage | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS2 |

#### 2.1.6 max-width(最大宽度)

> max-width: { length | percentage | none | inherit }

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | none   | CSS2 |

### 2.2 边距

> 边距不会影响浮动元素 和 绝对定位元素, 因为浮动元素 和 绝对定位元素会从该文流程中删除

#### 2.2.1 margin-top

> margin-top: { length | percentage | auto | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值可以为负值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 2.2.2 margin-right

> margin-right: { length | percentage | auto | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值可以为负值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 2.2.3 margin-bottom

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

#### 2.2.4 margin-left

> margin-left: { length | percentage | auto | inherit }
>
> percentage: **百分比相对于包含块的宽度**
>
> length: 值可以为负值

| 继承 | 初始值 | 版本 |
| ---- | ------ | ---- |
| 否   | 0      | CSS1 |

#### 2.2.5 margin(连写属性)

> margin: { { length | percentage | auto }[^1 to 4 valuse] | inherit }

## 10 . 其他知识点

### 1. CSS三大特性: 层叠, 特性, 继承

> 层叠: 指来自多种样式表源的样式叠加到文档元素的方式
>
> 特性: CSS不同选择器的权重
>
> 继承: 样式可以继承父元素

### 2. inherit: 用来指代继承父元素的CSS属性值

> ```	scss
> p a {
>  // 表示继承父元素的文字颜色
>  color: inherit
> }
> ```

[^1 to 4 valuse]: 设置四个值