/**
 * 交叉类型: 主要用于组合现有的对象类型, 使用 & 运算符定义交叉类型
 */
interface Colorful {
  color: string;
}
type Circle = {
  radius: number;
};

type ColorfulCircle = Colorful & Circle; // 交叉类型可以是 interface 接口或 type 类型别名

// 或者使用匿名方式定义类型
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}
