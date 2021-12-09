import { Breadcrumb } from 'element-react';

export default function HeadTop(props) {
  return (
    <div className='header_container'>
      <Breadcrumb separator='/'>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>活动管理</Breadcrumb.Item>
        <Breadcrumb.Item>活动列表</Breadcrumb.Item>
        <Breadcrumb.Item>活动详情</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}
