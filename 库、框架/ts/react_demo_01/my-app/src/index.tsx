import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

import App from './App';

//
import './utils/request';

ReactDOM.render(
  <RecoilRoot>
    <RecoilNexus />
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);
