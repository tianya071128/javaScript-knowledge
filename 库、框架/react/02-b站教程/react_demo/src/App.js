import React, { Component } from 'react';
import Header from './components/Header';
import List from './components/List';
import './App.css';

let id = 0;

export class App extends Component {
  state = {
    todos: [],
  };

  addTodo = (value) => {
    this.setState({
      todos: [{ id: id++, name: value, done: false }, ...this.state.todos],
    });
  };

  render() {
    const { todos } = this.state;
    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header addTodo={this.addTodo} />
          <List todos={todos} />
        </div>
      </div>
    );
  }
}

export default App;
