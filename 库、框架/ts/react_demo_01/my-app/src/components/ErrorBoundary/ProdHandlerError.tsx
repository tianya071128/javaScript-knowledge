interface Props {
  error: Error & {
    code?: string;
  };
}

export default function ProdHandlerError(props: Props) {
  return <div>模块不存在</div>;
}
