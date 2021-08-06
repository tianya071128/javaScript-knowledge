/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime : 2020-01-13 17:20:51
 */
// 核心文件
import jQuery from "./core.js";

// selector.js => 主要是用于选择 DOM 元素的核心方法
import "./selector.js";
// traversing.js => 主要是 jQuery 对象的筛选功能, 并且初始化 jQuery 对象的 init 方法
import "./traversing.js";
// callbacks.js => 主要用于管理回调函数列表
import "./callbacks.js";

import "./deferred.js";
import "./deferred/exceptionHook.js";
import "./core/ready.js";
import "./data.js";
import "./queue.js";
import "./queue/delay.js";
import "./attributes.js";
import "./event.js";
import "./manipulation.js";
import "./manipulation/_evalUrl.js";
import "./wrap.js";
import "./css.js";
import "./css/hiddenVisibleSelectors.js";
import "./serialize.js";
import "./ajax.js";
import "./ajax/xhr.js";
import "./ajax/script.js";
import "./ajax/jsonp.js";
import "./core/parseHTML.js";
import "./ajax/load.js";
import "./event/ajax.js";
import "./effects.js";
import "./effects/animatedSelector.js";
import "./offset.js";
import "./dimensions.js";
import "./deprecated.js";
import "./exports/amd.js";
import "./exports/global.js";

export default jQuery;
