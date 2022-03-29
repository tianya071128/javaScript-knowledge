import { omitProp } from '@/utils';
import { isExternal } from '@/utils/validate';

const req = require.context('./svg', false, /\.svg$/);
const requireAll = (requireContext: typeof req) =>
  requireContext.keys().map(requireContext);
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
      className: 'svg-external-icon svg-icon',
    };
    return <div {..._props} />;
  } else {
    const _props = {
      ...omitProp(props, ['iconClass', 'className']),
      className: props.className ? 'svg-icon ' + props.className : 'svg-icon',
    };
    return (
      <svg aria-hidden='true' {..._props}>
        <use xlinkHref={`#icon-${props.iconClass}`} />
      </svg>
    );
  }
}
