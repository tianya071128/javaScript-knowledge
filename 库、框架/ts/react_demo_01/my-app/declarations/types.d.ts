// 为什么要放在这里而不是 index.d.ts 中？
// 猜测一下，应该是 index.d.ts 中导入了内容，而变成局部声明文件
declare module '*.svg' {
  const src: string;
  export default src;
}

type TulpType<T extends Array<any>> = T extends (infer P)[] ? P : never;
