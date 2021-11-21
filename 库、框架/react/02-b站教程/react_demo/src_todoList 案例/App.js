import React, { Component } from 'react';
import Header from './components/Header';
import List from './components/List';
import Footer from './components/Footer';
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

  updateTodo = (ids, done) => {
    if (!Array.isArray(ids)) ids = [ids];

    const { todos } = this.state;
    const newTodos = todos.map((item) => {
      return {
        ...item,
        done: ids.includes(item.id) ? done : item.done,
      };
    });
    this.setState({
      todos: newTodos,
    });
  };

  deleteTodo = (id) => {
    const newTodos = this.state.todos.filter((item) => item.id !== id);

    this.setState({
      todos: newTodos,
    });
  };

  render() {
    const { todos } = this.state;
    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header addTodo={this.addTodo} />
          <List
            todos={todos}
            updateTodo={this.updateTodo}
            deleteTodo={this.deleteTodo}
          />
          <Footer
            todos={todos}
            updateTodo={this.updateTodo}
            deleteTodo={this.deleteTodo}
          />
        </div>
      </div>
    );
  }
}

export default App;
