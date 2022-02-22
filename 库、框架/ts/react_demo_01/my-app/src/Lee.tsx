import { useState } from 'react';

interface LeeProps {
  name: string;
  left?: JSX.Element;
}

export default function Lee({ name, left }: LeeProps) {
  let [age, setAge] = useState<number>(18);

  /** 定义事件处理器 */
  function addAge() {
    setAge(age++);
  }

  return (
    <div>
      <div>{name}</div>
      <div>{age}</div>
      <div onClick={addAge}>+</div>
      <div>{left}</div>
    </div>
  );
}
