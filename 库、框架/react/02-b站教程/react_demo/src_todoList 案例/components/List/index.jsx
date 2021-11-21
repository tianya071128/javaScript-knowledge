import React, { Component } from 'react';
import Item from '../Item';

export default class List extends Component {
  render() {
    const { todos, updateTodo, deleteTodo } = this.props;

    return (
      <ul className="todo-main">
        {todos && todos.length ? (
          todos.map((todo) => {
            return (
              <Item
                key={todo.id}
                {...todo}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
              />
            );
          })
        ) : (
          <li className="item_li">暂无任务</li>
        )}
      </ul>
    );
  }
}
