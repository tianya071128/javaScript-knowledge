import React, { Component } from 'react';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import News from './News';
import Message from './Message';

export default class Home extends Component {
  render() {
    return (
      <div>
        <h3>我是Home的内容</h3>
        <div>
          <ul className="nav nav-tabs">
            <li>
              <NavLink className="list-group-item" to="/home/news">
                News
              </NavLink>
            </li>
            <li>
              <NavLink className="list-group-item" to="/home/message">
                Message
              </NavLink>
            </li>
          </ul>
          {/* 注册路由 */}
          <Switch>
            <Route path="/home/news" component={News} />
            <Route path="/home/message" component={Message} />
            <Redirect to="/home/news" />
          </Switch>
        </div>
      </div>
    );
  }
}
