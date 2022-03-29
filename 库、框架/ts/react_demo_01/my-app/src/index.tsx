import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import App from './App';

import '@/icons'; // 同步引入 icons 文件，会增大入口文件大小
import '@/style/index.scss';
import '@/style/animation.scss';

ReactDOM.render(
  <RecoilRoot>
    <RecoilNexus />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>,
  document.getElementById('root')
);
