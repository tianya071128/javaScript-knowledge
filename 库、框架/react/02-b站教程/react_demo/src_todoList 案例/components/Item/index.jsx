import React, { Component } from 'react';

export default class Item extends Component {
  handerChange = (event) => {
    this.props.updateTodo?.(this.props.id, event.target.checked);
  };

  deleteTodo = () => {
    const r = window.confirm('确定删除?');

    if (!r) return;
    this.props.deleteTodo?.(this.props.id);
  };

  render() {
    const { name, done } = this.props;
    return (
      <li className="item_li">
        <label>
          <input type="checkbox" checked={done} onChange={this.handerChange} />
          <span>{name}</span>
        </label>
        <button className="item_btn" onClick={this.deleteTodo}>
          删除
        </button>
      </li>
    );
  }
}
