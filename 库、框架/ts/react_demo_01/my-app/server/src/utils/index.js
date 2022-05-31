module.exports = {
  omitProp(obj, props) {
    const _obj = { ...obj };
    for (const prop of props) {
      delete _obj[prop];
    }
    return _obj;
  },
};
