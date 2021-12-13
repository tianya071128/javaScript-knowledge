import classnames from 'classnames';

export function assignStyle(style, args) {
  return Object.assign({}, args, style);
}

export function assignClass(...args) {
  return classnames(args);
}
