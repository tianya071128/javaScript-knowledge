import React, { Component } from 'react';

export default class Footer extends Component {
  updateTodos = (event) => {
    const { todos, updateTodo } = this.props;

    if (todos.length) {
      updateTodo(
        todos.map((item) => item.id),
        event.target.checked
      );
    }
  };

  render() {
    const { todos } = this.props;
    const dones = todos.filter((item) => item.done).length;
    const allLen = todos.length;

    return (
      <div className="todo-footer">
        <div>
          <label>
            <input
              type="checkbox"
              checked={!!allLen && allLen === dones}
              onChange={this.updateTodos}
            />
          </label>
          <span>
            <span>已完成{dones}</span> / 全部{allLen}
          </span>
        </div>
        <button className="btn btn-danger">清除已完成任务</button>
      </div>
    );
  }
}
