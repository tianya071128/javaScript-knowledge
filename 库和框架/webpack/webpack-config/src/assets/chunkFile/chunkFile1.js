/**
 * 因为这个 js 文件是通过 import() 分离的 chunk，所以在这里的 scss 文件也会分离分为单独的 css 文件
 */
import "../sass/test2.scss";

/**
 * 在这里， 这个 scss 在 src/index.js 中已经被处理，所以不会包含在当前分离的 css 文件中
 */
import "../sass/test1.scss";
