// 获取页面滚动条宽度
let result: number;
function getPageScrollBar() {
  if (result) return result;

  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';

  document.body.appendChild(div);

  return (result = div.offsetWidth - div.clientWidth);
}
/**
 * 禁止页面滚动
 * @returns 恢复页面滚动
 */
export function banPageScroll() {
  let oldOverflow = document.body.style.overflow;
  let oldPaddingRight = document.body.style.paddingRight;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = getPageScrollBar + 'px';

  return () => {
    document.body.style.overflow = oldOverflow;
    document.body.style.paddingRight = oldPaddingRight;
  };
}
