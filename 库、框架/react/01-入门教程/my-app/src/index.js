/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-07-12 19:46:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-07-12 21:55:45
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  // 可能获胜的情况
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// 每个方格组件
// class Square extends React.Component {
//   // constructor(props) {
//   //   console.log(props); // 顾名思义, 这个就是传入的 props
//   //   // 在 JavaScript class 中，每次你定义其子类的构造函数时，都需要调用 super 方法。因此，在所有含有构造函数的的 React 组件中，构造函数必须以 super(props) 开头。
//   //   // 如果没有定义 constructor 时, 类似会自动调用 super, 这是 class 语法要求
//   //   super(props); // 这一步暂时没有明白作用
//   //   this.state = { // 添加组件内的属性, 类似于 vue 的 data 吧
//   //     value: null,
//   //   }
//   // }
//   render() {
//     return (
//       // on + 事件名: 添加事件
//       <button
//         className="square"
//         onClick={() => this.props.onClick()} /** setState 应该是改变定义在 State 的值, 并且通知 React 去重新渲染组件吧 */
//       >
//         { this.props.value}
//       </button >
//     );
//   }
// }

// 函数式组件 - 与 vue 类似, 组件内部不需要维护自己的状态
function Square(props) {
  return (
    // on + 事件名: 添加事件
    <button
      className="square"
      onClick={props.onClick} /** this 不是指向这个组件的, this 指向的是这个模块 */
    >
      { props.value}
    </button >
  );
}

// 九宫格 and 标题
class Board extends React.Component {
  renderSquare(i) {
    // 向 Square 组件中传递 value props
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => { this.props.onClick(i) }}
      />
    );
  }
  render() { // 没有重新渲染视图的时候都会调用
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// 步骤条
class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true, // 落子的符号
      stepNumber: 0, // 查看哪一项历史记录
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      let coordinates = '';
      if (move > 0) {
        const current = step.squares;
        const prev = history[move - 1].squares;

        for (let index = 0; index < current.length; index++) {
          if (current[index] !== prev[index]) {
            coordinates = `(${index % 3 + 1}, ${Math.ceil((index + 1) / 3)})`;
            break;
          }
        }
      }

      return (
        <li className={move === this.state.stepNumber ? 'active' : ''} key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <span>{coordinates}</span>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);