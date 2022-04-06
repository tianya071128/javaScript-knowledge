import * as Icons from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { omitProp } from '@/utils';
import { isExternal } from '@/utils/validate';

import './index.scss';

export let svgNames: string[] = [];

/** 自动导入所有的 icons 图片 */
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

type Props = Parameters<typeof Icon>[0] & {
  iconClass: string;
};

export default function MyIcons(props: Props) {
  const { iconClass } = props;
  const hasExternal = isExternal(iconClass);
  let getIcon: Parameters<typeof Icon>[0]['component'];
  let AntdIcons: typeof Icons.CloudSyncOutlined;
  if (hasExternal) {
    // 网络图片
    const _props = {
      style: {
        mask: `url(${iconClass}) no-repeat 50% 50%`,
        // '-webkit-mask': `url(${iconClass}) no-repeat 50% 50%`,
      },
      className: 'sl_svg-external-icon sl_svg-icon',
    };
    getIcon = () => <div {..._props} />;
  } else if ((AntdIcons = (Icons as any)[iconClass])) {
    // 使用 antd 图标
    getIcon = () => <AntdIcons />;
  } else {
    // 自定义图标
    getIcon = () => (
      <svg aria-hidden='true' className='sl_svg-icon'>
        <use xlinkHref={`#icon-${iconClass}`} />
      </svg>
    );
    console.assert(
      svgNames.includes(iconClass) || process.env.NODE_ENV !== 'development',
      `没有对应的图标名“${iconClass}”，请检查`
    );
  }
  return <Icon component={getIcon} {...omitProp(props, ['iconClass'])} />;
}
