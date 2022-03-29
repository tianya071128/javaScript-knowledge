/**
 * 检查是否 path 是否为网络路径
 * @param {string} path 路径
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
