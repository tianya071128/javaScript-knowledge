import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory /* , Redirect */,
} from 'react-router';
import * as base from '@pages/base'; // 基础
// import { isLogin } from '@configs/common';

export default () => (
  <Router history={hashHistory}>
    <Route path='/login' component={base.login} />
    {/* <Route path='*' component={base.notfound} /> */}
  </Router>
);
