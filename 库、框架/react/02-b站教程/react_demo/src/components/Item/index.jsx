import React, { Component } from 'react';

export default class Item extends Component {
  render() {
    const { name, done } = this.props;
    return (
      <li className="item_li">
        <label>
          <input type="checkbox" checked={done} />
          <span>{name}</span>
        </label>
        <button className="btn btn-danger">删除</button>
      </li>
    );
  }
}
