import React, { Component } from 'react';
import axios from 'axios';

export default class Search extends Component {
  state = {
    value: '',
  };

  search = async () => {
    // 获取用户的数据
    const data = await axios.get('/api/search', {
      params: {
        q: this.state.value,
        type: 'users',
      },
    });

    console.log(data);
  };

  render() {
    return (
      <section className="jumbotron">
        <h3 className="jumbotron-heading">搜索github用户</h3>
        <div>
          <input
            type="text"
            value={this.state.value}
            onChange={(event) =>
              this.setState({
                value: event.target.value,
              })
            }
            placeholder="输入关键词点击搜索"
          />
          &nbsp;
          <button onClick={this.search}>搜索</button>
        </div>
      </section>
    );
  }
}
