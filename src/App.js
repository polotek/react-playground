import React, { Component } from 'react';
import classNames from 'classnames';
import logo from './logo.svg';
import './App.css';

class Board extends React.Component {
  renderSquare(i) {
    const winner = this.props.winner;
    const isWinner = winner && winner.line.includes(i)
    const mark = this.props.squares[i]
    return (
      <button key={'key'+i} className={classNames('square', {'latest': this.props.pos === i, 'winner':isWinner})}
              onClick={() => this.props.onClick(i)}>
        {mark}
      </button>
    );
  }

  render() {
    let rows = [];
    for(let i = 0; i < 3; i++) { // 3 rows
      let cols = [];
      for(let j = 0; j < 3; j++) { // 3 columns
        let pos = i*3+j;
        cols.push(this.renderSquare(pos));
      }
      rows.push(<div key={'key'+i} className="board-row">{cols}</div>);
    }
    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          pos: null
        }
      ],
      reverseHistory: false,
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          pos: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  renderHistory(history, currentStep, reverseHistory) {
    const current = history[currentStep];

    let moves = history.map((step, move) => {
      const pos = step.pos;
      const desc = move ?
        `Go to move #${move}: ${((pos % 3))}, ${(Math.floor(pos/3))}`:
        'Go to game start';
      return (
        <li key={"key"+move} className={classNames({'latest': current.pos===pos})}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if(reverseHistory) {
      moves.reverse()
    }

    return moves
  }

  render() {
    const {history, stepNumber, reverseHistory, xIsNext} = this.state;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = this.renderHistory(history, stepNumber, reverseHistory);

    let status;
    if (winner) {
      status = `Winner: ${winner.player}`;
    } else if (current.squares.every(x => x)) {
      // no winner, but all the squares are full
      status = 'Draw!'
    } else {
      // the game is still going
      status = `Next player: ${xIsNext ? "X" : "O"}`;
    }

    return (
      <div className={classNames("game", this.props.className)}>
        <h1>Tic-Tac-Toe</h1>
        <div className="game-board">
          <Board
            squares={current.squares}
            pos={current.pos}
            winner={winner}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <p>{status}</p>
          <p>
            <button onClick={() => this.setState({reverseHistory: !reverseHistory})}>
                {reverseHistory ? 'Sort Ascending' : 'Sort Descending'}
            </button>
          </p>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
function calculateWinner(squares) {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {line: WINNING_LINES[i], player: squares[a]};
    }
  }
  return null;
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <main>
          <Game className="section"/>
        </main>
      </div>
    );
  }
}

export default App;
