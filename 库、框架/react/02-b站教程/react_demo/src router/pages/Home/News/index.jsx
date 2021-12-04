import React, { Component } from 'react';

export default class News extends Component {
  render() {
    console.log('嵌套路由', this.props);
    return (
      <ul>
        <li>news001</li>
        <li>news002</li>
        <li>news003</li>
      </ul>
    );
  }
}
