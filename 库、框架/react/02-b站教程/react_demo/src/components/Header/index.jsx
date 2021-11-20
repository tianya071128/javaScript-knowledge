import React, { Component } from 'react';

export default class Header extends Component {
  state = {
    value: '',
  };
  handleKeyUp = (event) => {
    if (event.keyCode === 13 && !!this.state.value.trim()) {
      this.props.addTodo(this.state.value);
      this.setState({
        value: '',
      });
    }
  };
  handerChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };
  render() {
    return (
      <div>
        <input
          className="header_input"
          type="text"
          placeholder="请输入您的任务, 按回车键确定"
          onKeyUp={this.handleKeyUp}
          value={this.state.value}
          onChange={this.handerChange}
        />
      </div>
    );
  }
}
