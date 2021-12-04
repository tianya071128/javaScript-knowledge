import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  // <React.StrictMode> 组件用于检查 <APP> 组件 react 代码是否规范
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
