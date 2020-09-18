const less = require("less");

function loader(source) {
  let css;

  // 利用 less 包转化 less
  less.render(source, function(err, r) {
    css = r.css;
  });
  return css;
}

module.exports = loader;
