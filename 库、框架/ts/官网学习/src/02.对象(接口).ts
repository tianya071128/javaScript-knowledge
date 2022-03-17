/**
 * 可以使用类型别名(type)和接口(interface)来定义对象类型：
 * 1. 可选属性: 与函数的可选参数类似, 可以通过在其名称末尾添加问号(?)来标记
 * 2. 只读属性: 可以使用 readonly 标识为只读属性(ts 特性) -- 它不会在运行时更改任何行为，但在类型检查(ts 编译)期间无法修改属性
 *             注意: readonly 标识与 es 中的 const 类似, 它只会意味着属性不能重写, 而属性值是一个引用类型的话, 改变属性值的属性是可以的
 */
{
  interface Person {
    name: string; // 常规属性, 必须要包含这个属性
    age?: number; // 可选参数
    readonly sex: string; // 只读属性
    readonly resident: { name: string; age: number }; // 只读属性, 改变 resident 内部属性的话是可以的
  }
  const obj: Person = {
    name: 'shuli',
    sex: '男',
    resident: {
      name: 'shuli',
      age: 18,
    },
  };
  obj.resident.age++; // 改变只读属性内部属性是合法的 -- 但不推荐
  obj.sex = '女'; // error -- 无法分配到 "sex" ，因为它是只读属性。
}

/**
 * 索引签名: 有时您并不提前知道类型属性的所有名称，但您确实知道值的形状。在这些情况下，您可以使用索引签名来描述可能值的类型, 格式为: [propName: number(string)]: type
 *          注意: 索引签名类型必须是字符串或数字, 也可以同时支持字符串或数字类型的索引签名
 */
// 数字类型的索引签名: 此时需要用数字来访问属性, 一般就是数组
interface StringArray {
  [index: number]: string;
}
const myArray: StringArray = ['1', '2', '3'];
const secondItem = myArray[1]; // const secondItem: string
// 字符串类型的索引签名 -- 可以用来是对象任意扩展属性
// 注意一: 可以添加其他属性, 但是它们还强制所有属性与其返回类型匹配
// 注意二: 可以添加 readonly 标识设置为只读属性
interface TestString {
  readonly [prop: string]: number;
  length: number; // ok
  // 因为定义了字符串索引签名, 那么属性类型应该与索引签名类型兼容, 此时可以将索引签名设置为联合类型或any: [prop: string]: number | string;
  name: string; // error - 类型“string”的属性“name”不能赋给“string”索引类型“number”。
}
const testString: TestString = {
  x: 100,
  length: 200,
};
testString.x = 2300; // 索引索引的属性不能进行修改
testString.length = 2300; // 其他定义的属性就可以修改

// 当同时使用数字签名和索引签名时, 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型
// 这是因为当使用 number来索引时，JavaScript会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

interface NotOkay {
  [x: number]: Animal;
  [x: string]: Dog;
}

interface Okay {
  [x: number]: Dog;
  [x: string]: Animal;
}
