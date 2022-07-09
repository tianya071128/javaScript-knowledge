// 为什么要放在这里而不是 index.d.ts 中？
// 猜测一下，应该是 index.d.ts 中导入了内容，而变成局部声明文件
declare module '*.svg' {
  const src: string;
  export default src;
}

/**
 * 自定义全局工具方法 -- 获取元祖项的类型
 *
 *  无意义，可以直接通过 TulpType[number] 获取
 *   e.g：
 *    type TulpType = [string, number];
 *
 *    type ceshi = TulpType[number]; // string | number
 *    type ceshi = GetTulpType<TulpType>; // string | number
 */
type GetTulpType<T extends Array<any>> = T extends (infer P)[] ? P : never;
