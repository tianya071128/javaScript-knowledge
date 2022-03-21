/**
 * 模块：目前一般使用 ES 模块语法和 CommonJS 模块语法 -- 见：https://www.typescriptlang.org/docs/handbook/2/modules.html
 *
 * 任何包含顶级 import 或者 export 的文件都被当成一个模块，此时类型都是在模块内部可见
 * 如果一个文件不带有顶级的import或者export声明，那么它的内容被视为全局可见的（因此对模块也是可见的）。
 */

// 导出声明
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
export const a = 2;

// 导入声明
import type { module } from './07.类型别名';
