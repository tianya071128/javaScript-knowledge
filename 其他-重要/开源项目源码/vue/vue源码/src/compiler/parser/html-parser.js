/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-31 09:27:29
 */
/**
 * 文件作用: 词法分析 --  通过读取字符流配合正则一点一点的解析字符串, 直到整个字符串都被解析完毕为止.
 */
/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson (MPL-1.1 OR Apache-2.0 OR GPL-2.0-or-later)
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

import { makeMap, no } from "shared/util";
import { isNonPhrasingTag } from "web/compiler/util";
import { unicodeRegExp } from "core/util/lang";

// Regular Expressions for parsing tags and attributes 用于分析标记和属性的正则表达式
// 作用是用来匹配标签的属性(attributes)的
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 定义了 ncname 的合法组成
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
// 由可选项的 前缀、冒号 以及 名称 组成, 将来会用在 new RegExp() 中
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 匹配开始标签的一部分，这部分包括：< 以及后面的 标签名称
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 匹配开始标签的 < 以及标签的名字，但是并不包括开始标签的闭合部分
const startTagClose = /^\s*(\/?)>/;
// 用来匹配结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 用来匹配文档的 DOCTYPE 标签
const doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
// 匹配注释节点
const comment = /^<!\--/;
// 匹配条件注释节点
const conditionalComment = /^<!\[/;

// Special Elements (can contain anything) 特殊元素（可以包含任何内容）
// 用来检测给定的标签名字是不是纯文本标签（包括：script、style、textarea）。
export const isPlainTextElement = makeMap("script,style,textarea", true);
const reCache = {};

// key 是一些特殊的 html 实体，值则是这些实体对应的字符
// 常量 decodingMap 以及两个正则 encodedAttr 和 encodedAttrWithNewLines 作用就是用来完成对 html 实体进行解码的
const decodingMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&amp;": "&",
  "&#10;": "\n",
  "&#9;": "\t",
  "&#39;": "'"
};

const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

// #5992
const isIgnoreNewlineTag = makeMap("pre,textarea", true);
// 用来判断是否应该忽略标签内容的第一个换行符的，如果满足：标签是 pre 或者 textarea 且 标签内容的第一个字符是换行符，则返回 true，否则为 false。
const shouldIgnoreFirstNewline = (tag, html) =>
  tag && isIgnoreNewlineTag(tag) && html[0] === "\n";

// 解码 html 实体的
function decodeAttr(value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, match => decodingMap[match]);
}

/**
 * 每当遇到一个开始标签时会调用的 options.start 钩子函数，
 * 每当遇到一个结束标签时会调用的 options.end 钩子函数等等
 */
export function parseHTML(html, options) {
  // 遇到一个 非一元标签(必须要有闭合标签的元素)，都会将该开始标签 push 到该数组, 用来检测是否缺少闭合标签
  const stack = [];
  const expectHTML = options.expectHTML;
  // 用来检测一个标签是否是一元标签。
  // no: 始终返回 false 的函数
  const isUnaryTag = options.isUnaryTag || no;
  // 来检测一个标签是否是可以省略闭合标签的非一元标签
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no;
  // 标识着当前字符流的读入位置
  let index = 0;
  // last 存储剩余还未 parse 的 html 字符串
  // lastTag 则始终存储着位于 stack 栈顶的元素。
  let last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style 确保我们不在脚本/样式这样的纯文本内容元素中
    if (!lastTag || !isPlainTextElement(lastTag)) {
      // 确保即将 parse 的内容不是在纯文本标签里 (script,style,textarea)

      // html 字符串中左尖括号(<)第一次出现的位置
      let textEnd = html.indexOf("<");

      // 当 textEnd === 0 时，说明 html 字符串的第一个字符就是左尖括号，
      // 比如 html 字符串为：<div>asdf</div>，那么这个字符串的第一个字符就是左尖括号(<)。
      if (textEnd === 0) {
        // Comment: 有可能是注释节点
        if (comment.test(html)) {
          // 完整的注释节点不仅仅要以 <!-- 开头，还要以 --> 结尾
          const commentEnd = html.indexOf("-->");

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(
                // 截取注释内容
                html.substring(4, commentEnd),
                index,
                index + commentEnd + 3
              );
            }
            // 将已经 parse 完毕的字符串剔除
            advance(commentEnd + 3);
            continue;
          }
        }

        // 有可能是条件注释节点
        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          // 查找条件注释的结尾标签
          const conditionalEnd = html.indexOf("]>");

          if (conditionalEnd >= 0) {
            // Vue 模板永远都不会保留条件注释节点的内容，所以直接调用 advance 函数以及执行 continue 语句结束此次循环。
            advance(conditionalEnd + 2);
            continue;
          }
        }

        // Doctype: doctype 节点
        const doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          // Vue 不会保留 Doctype 节点的内容。
          advance(doctypeMatch[0].length);
          continue;
        }

        // End tag: 结束标签
        /**
         * <div></div>
         * endTagMatch = ['</div>', 'div']
         */
        const endTagMatch = html.match(endTag);
        if (endTagMatch) {
          const curIndex = index;
          // 将已经 parse 完毕的字符串剔除
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        }

        // Start tag: 开始标签
        const startTagMatch = parseStartTag();
        if (startTagMatch) {
          // 解析 startTagMatch
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue;
        }
      }

      // 用来处理那些第一个字符是 < 但没有成功匹配标签，或第一个字符不是 < 的字符串。
      let text, rest, next;
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        // 条件保证了只有截取后的字符串不能匹配标签的情况下才会执行, 这说明符号 < 存在于普通文本中
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text 在纯文本中，请原谅并将其视为文本
          // 寻找下一个符号 < 的位置，并将位置索引存储在 next 变量中
          next = rest.indexOf("<", 1);
          if (next < 0) break;
          textEnd += next;
          // 使用新的 textEnd 对原始字符串 html 进行截取，并将新截取的字符串赋值给 rest 变量，
          // 如此往复直到遇到一个能够成功匹配标签的 < 符号为止，
          // 或者当再也遇不到下一个 < 符号时，while 循环会 break，此时循环也会终止
          rest = html.slice(textEnd);
        }
        // 获取开始标签和结束标签中间的文本
        text = html.substring(0, textEnd);
      }

      if (textEnd < 0) {
        // 将整个 html 字符串作为文本处理就好了。
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {
      // 即将 parse 的内容是在纯文本标签里 (script,style,textarea)
      // 用来保存纯文本标签闭合标签的字符长度
      let endTagLength = 0;
      // 纯文本标签的小写版
      const stackedTag = lastTag.toLowerCase();
      // reCache[stackedTag] 做了缓存
      // reStackedTag正则 用来匹配纯文本标签的内容以及结束标签的。
      const reStackedTag =
        reCache[stackedTag] ||
        (reCache[stackedTag] = new RegExp(
          "([\\s\\S]*?)(</" + stackedTag + "[^>]*>)",
          "i"
        ));
      // html.replace 用来将匹配字符串 html 并将其替换为空字符串,
      // 常量 rest 将保存剩余的字符
      const rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== "noscript") {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, "$1") // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1");
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return "";
      });
      index += html.length - rest.length;
      html = rest;
      // 调用 parseEndTag 函数解析纯文本标签的结束标签，
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    // 将整个字符串作为文本对待
    // 如果两者相等，则说明字符串 html 在经历循环体的代码之后没有任何改变，此时会把 html 字符串作为纯文本对待。
    if (html === last) {
      options.chars && options.chars(html);
      if (
        process.env.NODE_ENV !== "production" &&
        !stack.length &&
        options.warn
      ) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, {
          start: index + html.length
        });
      }
      break;
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  // 将已经 parse 完毕的字符串剔除
  function advance(n) {
    // index 变量存储着字符流的读入位置，该位置是相对于原始 html 字符串的，所以每次都要更新。
    index += n;
    html = html.substring(n);
  }

  // 判断是否为开始标签, 并对其进行处理
  /** <div v-if="isSucceed" v-for="v in map"></div>
   * 返回值: 注意 match.start 和 match.end 是不同的
   *  match = {
   *    tagName: 'div',
   *    attrs: [
   *      [
   *        ' v-if="isSucceed"',
   *        'v-if',
   *        '=',
   *        'isSucceed',
   *        undefined,
   *        undefined
   *      ],
   *      [
   *        ' v-for="v in map"',
   *        'v-for',
   *        '=',
   *        'v in map',
   *        undefined,
   *        undefined
   *      ]
   *    ],
   *    start: index,
   *    unarySlash: undefined,
   *    end: index
   *  }
   */
  function parseStartTag() {
    // 匹配开始标签
    /**
     * <div></div>
     * start = ['<div', 'div']
     */
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        // 值为 start[1] 即标签的名称。
        tagName: start[1],
        // 开始标签是可能拥有属性的，而这个数组就是用来存储将来被匹配到的属性
        attrs: [],
        // index，也就是当前字符流读入位置在整个 html 字符串中的相对位置。
        start: index
      };
      advance(start[0].length);
      let end, attr;
      // 第一个条件是：没有匹配到开始标签的结束部分
      // 第二个条件是：匹配到了属性
      // 没有匹配到开始标签的结束部分，并且匹配到了开始标签中的属性
      // 直到 匹配到开始标签的结束部分 或者 匹配不到属性 的时候循环才会停止。
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(dynamicArgAttribute) || html.match(attribute))
      ) {
        // 匹配属性
        /**
         * <div v-for="v in map"></div>
         * attr = [' v-for="v in map"','v-for','=','v in map',undefined,undefined]
         */
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
      }
      // 当变量 end 存在，即匹配到了开始标签的 结束部分 时，才能说明这是一个完整的开始标签。
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  // 负责解析 parseStartTag 返回值
  function handleStartTag(match) {
    // 开始标签的标签名
    const tagName = match.tagName;
    // 为 '/' 或 undefined 。
    const unarySlash = match.unarySlash;

    if (expectHTML) {
      // lastTag 引用的是 stack 栈顶的元素
      // 最近一次遇到的开始标签是 p 标签，并且当前正在解析的开始标签必须不能是 段落式内容(Phrasing content) 模型
      if (lastTag === "p" && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      // 当前正在解析的标签是一个可以省略结束标签的标签，并且与上一次解析到的开始标签相同，
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    // 为真时代表着标签是一元标签，否则是二元标签。
    const unary = isUnaryTag(tagName) || !!unarySlash;

    // l 的值存储着 match.attrs 数组的长度
    const l = match.attrs.length;
    // 是一个与 match.attrs 数组长度相等的数组。
    const attrs = new Array(l);
    // 格式化 match.attrs 数组，并将格式化后的数据存储到常量 attrs 中。
    // 格式化包括两部分，
    // 第一：格式化后的数据只包含 name 和 value 两个字段，其中 name 是属性名，value 是属性的值。
    // 第二：对属性值进行 html 实体的解码。
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i];
      // 获取属性值
      const value = args[3] || args[4] || args[5] || "";
      const shouldDecodeNewlines =
        tagName === "a" && args[1] === "href"
          ? options.shouldDecodeNewlinesForHref
          : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        // decodeAttr 函数的作用是对属性值中所包含的 html 实体进行解码，将其转换为实体对应的字符。
        value: decodeAttr(value, shouldDecodeNewlines)
      };
      if (process.env.NODE_ENV !== "production" && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length;
        attrs[i].end = args.end;
      }
    }

    // 如果开始标签是非一元标签，则将该开始标签的信息入栈，即 push 到 stack 数组中，并将 lastTag 的值设置为该标签名。
    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCasedTag: tagName.toLowerCase(),
        attrs: attrs,
        start: match.start,
        end: match.end
      });
      lastTag = tagName;
    }

    // 调用 parser 钩子函数
    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  // 解析结束标签
  /** 作用
   * 1. 检测是否缺少闭合标签
   * 2. 处理 stack 栈中剩余的标签
   * 3. 解析 </br> 与 </p> 标签，与浏览器的行为相同
   */
  function parseEndTag(tagName, start, end) {
    // pos: 用于判断 html 字符串是否缺少结束标签, 会被用来判断是否有元素缺少闭合标签。
    // lowerCasedTagName: 用来存储 tagName 的小写版
    let pos, lowerCasedTagName;
    if (start == null) start = index;
    if (end == null) end = index;

    // Find the closest opened tag of the same type 查找同一类型的最近打开的标记
    if (tagName) {
      // 如果存在 tagName 则将其转为小写并保存到之前定义的 lowerCasedTagName 变量中。
      lowerCasedTagName = tagName.toLowerCase();
      // 寻找当前解析的结束标签所对应的开始标签在 stack 栈中的位置。
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break;
        }
      }
    } else {
      // If no tag name is provided, clean shop 如果没有提供标签名称，则清理
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack 关闭所有打开的元素
      for (let i = stack.length - 1; i >= pos; i--) {
        if (
          process.env.NODE_ENV !== "production" &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(`tag <${stack[i].tag}> has no matching end tag.`, {
            start: stack[i].start,
            end: stack[i].end
          });
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack 从堆栈中移除打开的元素
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    }
    // 下面的代码解析 br 和 p 元素的特殊
    else if (lowerCasedTagName === "br") {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === "p") {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}
