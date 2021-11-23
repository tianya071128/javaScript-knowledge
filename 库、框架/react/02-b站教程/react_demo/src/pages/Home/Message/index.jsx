import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Details from './Details';

export default class Message extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to={`${this.props.match.url}/message001`}>message001</Link>
          </li>
          <li>
            <Link to={`${this.props.match.url}/message002`}>message002</Link>
          </li>
          <li>
            <Link to={`${this.props.match.url}/message003`}>message003</Link>
          </li>
        </ul>
        <hr />
        {/* 声明 params 参数 */}
        {/* <Route
          path={`${this.props.match.path}/:details`}
          component={Details}
        /> */}
        <Route path={`${this.props.match.url}/:details`} component={Details} />
      </div>
    );
  }
}
