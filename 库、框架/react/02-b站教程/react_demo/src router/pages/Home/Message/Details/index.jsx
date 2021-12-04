import React, { Component } from 'react';

export default class Details extends Component {
  render() {
    console.log(this.props);
    // 接收 params: this.props.match.params
    return (
      <div>
        <div>params携带参数：{JSON.stringify(this.props.match.params)}</div>
      </div>
    );
  }
}
