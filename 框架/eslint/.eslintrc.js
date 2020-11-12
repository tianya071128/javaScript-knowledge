/*
 * @Descripttion: 
 * 1. 代码检测：./node_modules/.bin/eslint index.js --- npx eslint 文件名
 * 2. 代码修复：./node_modules/.bin/eslint index.js --fix --- npx eslint 文件名 --fix 
 * 		并不是所有的规则都能修复
 * @Author: 温祖彪
 * @Date: 2020-11-08 21:29:02
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-11-12 23:41:35
 */
module.exports = {
	// ESLint 将自动在要检测的文件目录里寻找它们，紧接着是父级目录，一直到文件系统的根目录（除非指定 root: true）
	"root": true,
	// 解析器配置项，会被传入至解析器中，eslint 默认为 Espree，但使用 babel 时需要使用 “babel-eslint”
	"parserOptions": {
		"parser": "babel-eslint", // 配置解析器 - 也可在根部设置 "parser": "babel-eslint"
		"sourceType": "module", // 支持类型 - script（默认） | module（模块）
		"ecmaVersion": 6, // 支持es6语法，但并不意味着同时支持新的 ES6 全局变量或类型（比如 Set 等新类型）
		"ecmaFeatures": { // 这是个对象，表示你想使用的额外的语言特性
			"jsx": true, // 启用 JSX
			"globalReturn": true, // 允许在全局作用域下使用 return 语句
			"impliedStrict": true, // 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
			"experimentalObjectRestSpread": true, // 启用实验性的 object rest/spread properties 支持。(重要：这是一个实验性的功能,在未来可能会有明显改变。 建议你写的规则 不要 依赖该功能，除非当它发生改变时你愿意承担维护成本。)
		}
	},
	// 预定义的全局变量 - 这些环境并不是互斥的，所以你可以同时定义多个。
	"env": {
		"browser": true, // 浏览器环境中的全局变量。
		"es2021": true,
		"node": true,
	},
	// 配置全局变量 - 这样就可以在文件中访问在文件中未定义的全局变量
	"globals": {
		"var1": "readonly", // writable: 允许重写变量 | readonly: 不允许重写变量 => 由于历史原因，布尔值 false 和字符串值 "readable" 等价于 "readonly"。类似地，布尔值 true 和字符串值 "writeable" 等价于 "writable"。但是，不建议使用旧值。
	},
	// 使用第三方插件 - 插件名称可以省略 eslint-plugin- 前缀。
	// 在使用插件之前，必须使用 npm 安装它。
	"plugins": [
		// "plugin1",
		// "eslint-plugin-plugin2"
	],
	"extends": "eslint:recommended",
	// 修改项目中的规则，可以在这里配置，同时也可以在文件中配置
	/**
	* "off" 或 0 - 关闭规则
	* "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
	* "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
	*/
	"rules": {
		// 当为数组时，第一个表示规则的严重等级，后面的表示传递给规则的参数
		// 'indent': [2, "tab"], // 强制使用一致的缩进
	},
	// 禁用一组文件的配置文件中的规则
	"overrides": [
		{
			"files": ["*-test.js", "*.spec.js"],
			"rules": {
				"no-unused-expressions": "off"
			}
		}
	],
	// 将提供给每一个将被执行的规则 - 在自定义规则的时候，可以访问到以下配置信息
	"settings": {
		"sharedData": "Hello"
	}
}