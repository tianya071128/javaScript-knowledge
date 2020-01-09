/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime: 2020-01-09 22:51:30
 */
import document from "../var/document.js";

var preservedScriptAttributes = {
  type: true,
  src: true,
  nonce: true,
  noModule: true
};

function DOMEval(code, node, doc) {
  doc = doc || document;

  var i,
    val,
    script = doc.createElement("script");

  // code: 脚本内部
  script.text = code;
  if (node) {
    // 向 script 添加 type, src, nonce, noModule 等 HTML 属性
    for (i in preservedScriptAttributes) {
      // 支持：Firefox<=64-66+，Edge<=18+
      // 有些浏览器不支持脚本上的 “nonce” 属性.
      // 另一方面，仅仅使用 “getAttribute” 还不够
      // “nonce” 属性在任何时候都重置为空字符串
      // 连接浏览上下文.
      // See https://github.com/whatwg/html/issues/2369
      // See https://html.spec.whatwg.org/#nonce-attributes
      // 添加“node.getAttribute”检查是为了
      // `jQuery.globalEval`以便它可以伪造包含nonce的节点
      // 通过一个对象.
      val = node[i] || (node.getAttribute && node.getAttribute(i));
      if (val) {
        script.setAttribute(i, val);
      }
    }
  }
  // 在 <head></head> 内部添加 script 标签 ==> 这样就会执行 script.text = code 的 代码
  // 随后删除这个 script 标签
  doc.head.appendChild(script).parentNode.removeChild(script);
}

export default DOMEval;
