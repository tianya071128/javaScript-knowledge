import MyIcons from '@/icons';
import { Select } from 'antd';
import { useMemo } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { getMenuRoutes } from '../MyMenu/utils';

export default function SearchMenu() {
  const [isSearch, setIsSearch] = useState(false); // 搜索框是否显示
  const [isSearchIcon, setIsSearchIcon] = useState(true); // 搜索图标是否显示
  const [notFoundContent, setNotFoundContent] = useState<boolean>(false);
  const menuRoutes = useMemo(() => getMenuRoutes(), []);
  const [options, setOptions] = useState<JSX.Element[]>([]);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    if (value && value.trim()) {
      const filterMenuRoutes = menuRoutes.filter(({ title }) =>
        title.includes(value)
      );
      setOptions(
        filterMenuRoutes.map(({ title, path }) => (
          <Select.Option key={path}>{title}</Select.Option>
        ))
      );
      setNotFoundContent(true);
    } else {
      setOptions([]);
      setNotFoundContent(false);
    }
  };

  const handleSelect = (path: string) => {
    navigate(path);
    setIsSearch(false);
  };

  return (
    <div className='nav_item'>
      {isSearchIcon && (
        <MyIcons
          iconClass='SearchOutlined'
          style={{ fontSize: '22px' }}
          onClick={() => setIsSearch(true)}
        />
      )}
      <CSSTransition
        in={isSearch}
        timeout={300}
        unmountOnExit
        classNames='width_animation'
        onEnter={() => setIsSearchIcon(false)}
        onExited={() => setIsSearchIcon(true)}>
        {
          <div style={{ overflowX: 'hidden' }}>
            <Select
              /** 使单选模式可搜索 */
              showSearch
              /** 指定当前选中的条目，多选时为一个数组。（value 数组引用未变化时，Select 不会更新） */
              // value={value}
              placeholder='搜索菜单'
              style={{ width: 200 }}
              /** 默认获取焦点 */
              autoFocus
              /** 是否默认高亮第一个选项 */
              defaultActiveFirstOption={false}
              /** 是否显示下拉小箭头 */
              showArrow={false}
              /** 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false */
              filterOption={false}
              /** 当下拉列表为空时显示的内容 */
              notFoundContent={notFoundContent ? '没有找到菜单' : null}
              /** 失去焦点 */
              onBlur={() => setIsSearch(false)}
              /** 文本框值变化时回调 */
              onSearch={handleSearch}
              /** 被选中时调用，参数为选中项的 value (或 key) 值 */
              onSelect={handleSelect}>
              {options}
            </Select>
          </div>
        }
      </CSSTransition>
    </div>
  );
}
