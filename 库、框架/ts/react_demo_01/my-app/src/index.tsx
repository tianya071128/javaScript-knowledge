import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import 'antd/dist/antd.css';
import App from './App';

ReactDOM.render(
  <RecoilRoot>
    <RecoilNexus />
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);
