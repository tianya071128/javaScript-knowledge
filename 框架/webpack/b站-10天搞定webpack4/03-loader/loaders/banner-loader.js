const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");
const fs = require("fs");

function loader(source) {
  const options = loaderUtils.getOptions(this);
  const cb = this.async();
  const schema = {
    type: "object",
    properties: {
      text: {
        type: "string"
      },
      filename: {
        type: "string"
      }
    }
  };

  validateOptions(schema, options, "banner-loader");
  if (options.filename) {
    fs.readFile(options.filename, "utf8", function(err, data) {
      cb(err, `/**${data}**/${source}`);
    });
  } else {
    cb(null, `/**${options.text}**/${source}`);
  }
}

module.exports = loader;
