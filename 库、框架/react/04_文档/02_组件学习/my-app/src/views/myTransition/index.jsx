import { Button } from 'element-react';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import './myTransition.css';

export default function MyTransition() {
  const [inProp, setInProp] = useState(false);

  return (
    <div>
      <Button type='primary' onClick={() => setInProp(!inProp)}>
        展示动画
      </Button>
      {/* timeout: 动画持续时间,  */}
      {/* 与 vue 的 transition 类似, 都是定义在过渡的不同阶段添加 css 类, 注意的是阶段不同 */}
      <CSSTransition
        in={inProp}
        addEndListener={(node, done) => {
          // addEndListener 属性 或 timeout 属性功能大致都是说明动画完成了的操作
          const myDone = () => {
            done();
          };
          node.addEventListener('transitionend', myDone, false);
        }}
        unmountOnExit
        classNames='my-node'>
        <div className='container'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          facilisis enim libero, at lacinia diam fermentum id. Pellentesque
          habitant morbi tristique senectus et netus
        </div>
      </CSSTransition>
    </div>
  );
}
