import { Breadcrumb } from 'element-react';

import { useMetas } from '../../router';

export default function HeadTop() {
  console.log(useMetas());
  const metas = useMetas();

  const handlerClick = (item) => {
    console.log(item);
    item.title = '改变值';
  };

  return (
    <div className='header_container'>
      <Breadcrumb separator='/'>
        {/* <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>活动管理</Breadcrumb.Item>
        <Breadcrumb.Item>活动列表</Breadcrumb.Item>
        <Breadcrumb.Item>活动详情</Breadcrumb.Item> */}
        {metas.map((item) => (
          <Breadcrumb.Item>
            <span onClick={handlerClick.bind(this, item)}>{item?.title}</span>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}
