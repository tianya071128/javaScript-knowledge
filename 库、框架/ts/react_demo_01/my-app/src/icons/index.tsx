import { omitProp } from '@/utils';
import { isExternal } from '@/utils/validate';

import './index.scss';

export let svgNames: string[] = [];

export /** 自动导入所有的 icons 图片 */
const req = require.context('./svg', false, /\.svg$/);
const requireAll = (requireContext: typeof req) => {
  const svgPaths = requireContext.keys();
  svgNames = svgPaths
    .map((path) => {
      const result = /([^/]+)\.svg$/g.exec(path);
      return (result && result[1]) || '';
    })
    .filter((path) => !!path);

  return svgPaths.map(requireContext);
};

requireAll(req);

type Props = {
  [eventName in keyof WindowEventMap]?: (
    this: Window,
    ev: WindowEventMap[eventName]
  ) => any;
} & {
  iconClass: string;
  className?: string;
};

export default function MyIcons(props: Props) {
  const hasExternal = isExternal(props.iconClass);
  if (hasExternal) {
    const _props = {
      ...omitProp(props, ['iconClass', 'className']),
      style: {
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        // '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`,
      },
      className: 'sl_svg-external-icon sl_svg-icon',
    };
    return <div {..._props} />;
  } else {
    const _props = {
      ...omitProp(props, ['iconClass', 'className']),
      className: props.className
        ? 'sl_svg-icon ' + props.className
        : 'sl_svg-icon',
    };
    return (
      <svg aria-hidden='true' {..._props}>
        <use xlinkHref={`#icon-${props.iconClass}`} />
      </svg>
    );
  }
}
