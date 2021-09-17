module.exports = {
  tabWidth: 2, // 缩进字节数
  useTabs: false, // 缩进不使用tab，使用空格
  endOfLine: 'auto', // 结尾是 \n \r \n\r auto
  singleQuote: true, // true: 单引号, false: 双引号
  semi: true, // 末尾是否需要分号
  trailingComma: 'es5', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  bracketSameLine: true, // 文档显示为 html 结束标签不另起一行, 不起作用, 记录一下...
  jsxBracketSameLine: true,
  htmlWhitespaceSensitivity: 'ignore' // 解决包裹文字时候结束标签的结尾尖括号掉到了下一行 -- 虽然并没有碰到这个问题, 记录一下
};
