/*
 * @Descripttion: 
 * 1. 代码检测：./node_modules/.bin/eslint index.js --- npx eslint 文件名
 * 2. 代码修复：./node_modules/.bin/eslint index.js --fix --- npx eslint 文件名 --fix 
 * 		并不是所有的规则都能修复
 * 3. 如果同一个目录下有多个配置文件，ESlint只会使用一个。
 * 		优先级顺序如下：
 * 			.eslintrc.js
 * 			.eslintrc.yaml
 * 			.eslintrc.yml
 * 			.eslintrc.json
 * 			.eslintrc
 * 			package.json
 * 4. 完整的配置层次结构，从最高优先级最低的优先级，如下:
 * 		4.1 行内配置
 * 			eslint-disable 和 eslint-enable
 * 			global
 * 			eslint
 * 			eslint-env
 * 		4.2 命令行选项（或 CLIEngine 等价物）：
 * 			--global
 * 			--rule
 * 			--env
 * 			- c、--config
 * 		4.3 项目级配置：
 * 			与要检测的文件在同一目录下的.eslintrc.* 或 package.json 文件
 * 			继续在父级目录寻找.eslintrc 或 package.json文件，直到根目录（包括根目录）或直到发现一个有"root": true的配置。
 * 		4.4 如果不是（1）到（3）中的任何一种情况，退回到 ~/.eslintrc 中自定义的默认配置。
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
	/**
	* 一个配置文件可以被基础配置中的已启用的规则继承。 --- ESLint递归地扩展配置，因此基本配置也可以具有 extends 属性。extends 属性中的相对路径和可共享配置名从配置文件中出现的位置解析。
	* 也可以在 rules 属性中以扩展（或覆盖）规则
	* 属性值可以是：
	* 	1. 指定配置的字符串(配置文件的路径、可共享配置的名称、eslint:recommended 或 eslint:all)
	* 	2. 字符串数组：每个配置继承它前面的配置
	*/
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
	// 同一个目录下的文件需要有不同的配置 - overrides 中的配置项可以细粒化匹配不同的文件
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