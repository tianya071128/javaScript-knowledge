interface CustomError extends Error {
  code?: string;
  filePath?: string;
}
interface Props {
  error: CustomError;
}

const errorInfoMap: {
  [prop: string]: (error: CustomError) => string;
} = {
  MODULE_NOT_FOUND: (error: CustomError) => {
    return `动态路由组件不存在，请检查文件"${error.filePath || ''}"是否不存在`;
  },
  ChunkLoadError: (error: CustomError) => {
    return `动态路由组件${error.filePath || ''}加载失败，请检查您的网络`;
  },
};

export default function DevHandlerError(props: Props) {
  return (
    <div className='dev_error'>
      {errorInfoMap[props.error.code!]?.(props.error) ||
        errorInfoMap[props.error.name!]?.(props.error) ||
        '未知错误，请检查控制台'}
    </div>
  );
}
