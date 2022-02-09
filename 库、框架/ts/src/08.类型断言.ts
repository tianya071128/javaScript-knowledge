// 类型断言: 有时 ts 无法得到具体的值类型, 此时可以使用类型断言来指定更具体的类型
/**
 * 下面这种, 抛出错误: 不能将类型“HTMLElement | null”分配给类型“HTMLCanvasElement” or 不能将类型“null”分配给类型“HTMLCanvasElement”。
 * 因为 document.getElementById 方法 ts 只知道返回值为 HTMLElement | null, 无法得知更具体的值, 此时可由用户断言更具体的类型
 */
// const myCanvas: HTMLCanvasElement = document.getElementById('main_canvas');

// 下列两种语法等效的
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement;
const myCanvas2 = <HTMLCanvasElement>document.getElementById('main_canvas');

// 注意: TypeScript 只允许类型断言转换为更具体或更不具体的类型版本
// const xx = 'hello' as number; // 类型 "string" 到类型 "number" 的转换可能是错误的，因为两种类型不能充分重叠。如果这是有意的，请先将表达式转换为 "unknown"。
const xx = 'hello' as any as number; // 可以先断言至 any(或 unknown),断言为更不具体的类型, 然后再断言为 number, 断言为更具体的类型
