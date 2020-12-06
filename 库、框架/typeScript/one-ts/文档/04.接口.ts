/**
 * 接口 - TS 的核心原则之一是对值所具有的结构进行类型检查
 * 接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约
 */

// 1. 定义接口 - 类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以
interface interfaceName {
  label: string;
}
const myObj: interfaceName = {
  label: "s"
};

// 2. 可选属性
interface interfaceName2 {
  color?: string;
  widht?: number;
}
const myObj2: interfaceName2 = {
  color: "#red"
};

// 3. 只读属性 - 在接口中定义 readonly 关键字
interface interfaceName3 {
  readonly x: number;
}
const myObj3: interfaceName3 = { x: 5 };
// myObj3.x = 6; // error
// 3.1 readonly VS const - 最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

// 4. 允许加入任意值
interface interfaceName4 {
  name: string;
  waistline?: number;
  [propname: string]: any; // 表示允许接口类型加入任意属性，并且属性值为任意类型
}
const myObj4: interfaceName4 = {
  name: "123",
  sex: "女"
};

// 5. 函数类型 - 不仅能够描述 js 中的对象，还可以用来描述函数类型
interface interfaceName5 {
  (source: string, subString: string): boolean;
}
// 与直接注解函数类型类似 - 在接口中定义的参数不需要与接口里定义的名字匹配
const myFn: interfaceName5 = function(src: string, sub: string): boolean {
  return src.search(sub) > -1;
};
// 或者通过类型推断，让 ts 推断出参数与返回值类型
const myFn2: interfaceName5 = function(src, sub) {
  return src.search(sub) > -1;
};
