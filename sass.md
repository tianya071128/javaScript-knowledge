# SASS语法

## 1. CSS功能扩展

### 1.1  嵌套规则

> 内层的样式将它外层的选择器作为父选择器

### 1.2 父选择器 &

> 用 `&` 代表嵌套规则外层的父选择器

### 1.3 属性嵌套

> ```scss
> font: {
>     family: fantasy;
>     size: 30em;
>     weight: bold;
>   }
> ```
>
> 命名空间也可以包含自己的属性值
>
> ```scss
> .funky {
>   font-family: fantasy;
>   font-size: 30em;
>   font-weight: bold; }
> ```

## 2 注释

> 多行注释 `/* */`: 会被完整编译到CSS文件中
>
> 单行注释`//`: 不会编译

## 3 变量

### 3.1 变量声明

> 变量声明: $highlight-color(变量名): #F90(变量值)
>
> 当变量定义在`css`规则块内，那么该变量只能在此规则块内使用. (有作用域的区别)

### 3.2 变量引用

> border: 1px solid #变量名
>
> 在声明变量时，变量值也可以引用其他变量
>
> > $highlight-border: 1px solid $highlight-color;

### 3.3 变量名用中划线和下划线的区别

> 这两种用法相互兼容,用中划线声明的变量可以使用下划线的方式引用，反之亦然。

## 4. 导入SASS文件

> 使用`sass`的`@import`规则并不需要指明被导入文件的全名。
>
> @import 'sidebar'

### 4.1 使用SASS部分文件

> `sass`局部文件的文件名以下划线开头。这样，`sass`就不会在编译时单独编译这个文件输出`css`，而只把这个文件用作导入。当你`@import`一个局部文件时，还可以不写文件的全名，即省略文件名开头的下划线。

### 4.2 默认变量值

> 一般情况下，你反复声明一个变量，只有最后一处声明有效且它会覆盖前边的值。
>
> `!default`标签: 如果这个变量被声明赋值了，那就用它声明的值，否则就用这个默认值.

### 4.3 嵌套导入

> ```scss
> .blue-theme {@import "blue-theme"}
> //生成的结果跟你直接在.blue-theme选择器内写_blue-theme.scss文件的内容完全一样。
> 
> .blue-theme {
>   aside {
>     background: blue;
>     color: #fff;
>   }
> }
> ```

### 4.4 原生导入

> ```scss
> @import "foo.css";
> @import "foo" screen;
> @import "http://foo.com/bar";
> @import url(foo);
> // 编译为 css
> @import "foo.css";
> @import "foo" screen;
> @import "http://foo.com/bar";
> @import url(foo);
> ```

## 5. 混入

### 5.1 定义混入

> ```scss
> // 不传参定义
> @mixin 混入名称 {
>   	list-style: none;
>     // 混入中可以嵌套CSS
>   	li {
>     	list-style-image: none;
>     	list-style-type: none;
>     	margin-left: 0px;
>   	}
> }
> // 传参定义 -- 还可以在这里面进行逻辑判断, 这里不深究了 -- 还可以设置默认值
> @mixin link-colors($normal: red, $hover, $visited) {
>   color: $normal;
>   &:hover { color: $hover; }
>   &:visited { color: $visited; }
> }
> ```

### 5.2 使用混入

> ```scss
> // 直接使用 @include
> ul.plain {
>   color: #444;
>   @include no-bullets;
> }
> // 传参方式: 直接传递(此时要注意参数顺序) 和 通过语法$name: value(不需要参数顺序)
> @include link-colors(
>       $normal: blue,
>       $visited: green,
>       $hover: red
>   );
> ```

## 6. 指令(语句)

### 6.1 @if

> 注意: 经测试, 不能对属性@if ... @else

> ```scss
> $type: monster;
> p {
>   @if $type == ocean {
>     color: blue;
>   } @else if $type == matador {
>     color: red;
>   } @else if $type == monster {
>     color: green;
>   } @else {
>     color: black;
>   }
> }
> ```

### 6.2 @for、@while、@each

> 暂不研究

## 7 后续

> 暂时先看这些, 已经足够在项目中实践了, 其余以后慢慢学习

