/**
 * 数据类型：
 * 1. 布尔类型：boolean
 * 2. 数字类型：number
 * 3. 字符串类型：string
 * 4. 数组类型：array
 * 5. 元祖类型：tuple
 * 6. 枚举类型：enum
 * 7. 任意类型：any
 * 8. null 和 undefined
 * 9. void 类型
 * 10. never 类型
 */

//  !布尔类型： true false
let flag: boolean = true;

// !数字类型
let num2: number = 123;

// !字符串类型
let str: string = "123";

// !数组类型
// !1.1 使用 [] 表示
let arr: number[] = [1, 2];

// !1.2 数组泛型
let arr2: Array<string> = ['1', '2', '3'];

// !元祖类型(tuple) 数组的一种 - 用来在单个变量中存储不同类型的值
let arr3: [string, number, boolean] = ["ts", 3, true];

// !枚举类型 - 用于标识状态或者
enum Flag { success = '成功', error = '错误' }; // 定义一个枚举类型
let f: Flag = Flag.success;

// !任意类型 - any 其实是相当于放弃了类型检查
let oBox: any = document.getElementById('box');

// !null 和 undefined 其他(never 类型) 数据类型的子类型
let un: undefined;

console.log(f, un);

// !void 类型：表示没有任何类型：一般用于定义方法的时候没有返回值
function fun(): void {
  console.log('run');
}

// !never 类型：是其他类型（null 和 undefined）的子类型，代表从不会出现的值
// !这就意味着声明 never 的变量只能被 never 类型所赋值
// ！很少会用到
