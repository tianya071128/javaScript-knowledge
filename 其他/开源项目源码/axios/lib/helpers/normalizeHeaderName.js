/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2019-12-18 21:29:18
 * @LastEditTime: 2019-12-20 21:49:45
 */
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};
