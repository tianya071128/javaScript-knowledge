import React from 'react';
import { assignStyle, assignClass } from '../../utils';

const Button = (props) => {
  const {
    children,
    nativeType,
    style,
    className,
    type,
    disabled,
    plain,
    loading,
    icon,
    size,
  } = props;
  return (
    <button
      style={assignStyle(style)}
      type={nativeType}
      disabled={disabled}
      className={assignClass(
        className,
        'el-button',
        type && `el-button--${type}`,
        size && `el-button--${size}`,
        {
          'is-disabled': disabled,
          'is-plain': plain,
          'is-loading': loading,
        }
      )}>
      {loading && <i className='el-icon-loading' />}
      {icon && !loading && <i className={`el-icon-${icon}`} />}
      <span>{children}</span>
    </button>
  );
};

Button.defaultProps = {
  type: 'default',
  nativeType: 'button',
  loading: false,
  disabled: false,
  plain: false,
};

export default Button;
