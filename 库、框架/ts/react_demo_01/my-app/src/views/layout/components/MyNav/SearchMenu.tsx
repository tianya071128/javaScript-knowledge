import MyIcons from '@/icons';
import { Select } from 'antd';
import { useMemo } from 'react';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function SearchMenu() {
  const [isSearch, setIsSearch] = useState(false); // 搜索框是否显示
  const [isSearchIcon, setIsSearchIcon] = useState(true); // 搜索图标是否显示
  const [value, setValue] = useState<string>();

  const switchSearch = () => {
    setIsSearch(true);
  };

  const options = useMemo(() => {
    console.log(value);

    return ['测试'].map((d) => <Select.Option key={d}>{d}</Select.Option>);
  }, [value]);

  return (
    <div>
      {isSearchIcon && (
        <MyIcons
          iconClass='SearchOutlined'
          style={{ fontSize: '22px' }}
          onClick={switchSearch}
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
          <div>
            <Select
              /** 使单选模式可搜索 */
              showSearch
              /** 指定当前选中的条目，多选时为一个数组。（value 数组引用未变化时，Select 不会更新） */
              value={value}
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
              notFoundContent='没有找到菜单'
              /** 失去焦点 */
              onBlur={() => setIsSearch(false)}>
              {options}
            </Select>
          </div>
        }
      </CSSTransition>
    </div>
  );
}
