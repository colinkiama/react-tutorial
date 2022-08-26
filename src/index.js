import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(rowNumber) {
    let squares = [];
    for (let columnNumber = 0; columnNumber < 3; columnNumber++) {
      squares = squares.concat(this.renderSquare(rowNumber * 3 + columnNumber))
    }

    return (
      <div key={rowNumber} className="board-row">
        {squares}
      </div>
    );
  }

  render() {
    let board = [''];
    for (let i = 0; i < 3; i++) {
      board = board.concat(this.renderRow(i));
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        locations: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isMoveListFlipped: false
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const locations = current.locations.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    locations[history.length - 1] = { 
      column: (i % 3) + 1,
      row: Math.floor(i / 3) + 1,
    };

    this.setState({
      history: history.concat([{
        squares: squares,
        locations: locations
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  flipMoveListOrder(isFlipped = false) {
    this.setState({
      isMoveListFlipped: !this.state.isMoveListFlipped
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // console.l

    const moves = history.map((step, move) => {
      const moveJumpDescription = move ?
        'Go to move #'  + move + ' (' + step.locations[move - 1].column + ',' + step.locations[move - 1].row + ')':
        'Go to game start';

      if (move !== history.length - 1) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{moveJumpDescription}</button>
          </li>
        );
      }

      return (
        <strong key={move}>
          <li>
            <button onClick={() => this.jumpTo(move)}>{moveJumpDescription}</button>
          </li>
        </strong>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }  else {
      status = 'Next player ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const movesListFlipDescription = 'Flip Moves Order';
    const movesListFlipStatus = 'Sort Order: ' + (this.state.isMoveListFlipped ? 'Descending' : 'Ascending');

    console.log('Is moves list flipped:', this.state.isMoveListFlipped);

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
          <div>
            <button onClick={() => this.flipMoveListOrder(this.state.isMoveListFlipped)}>
              {movesListFlipDescription}
            </button>
            <p>
              {movesListFlipStatus}
            </p>
          </div>
          <ol>{this.state.isMoveListFlipped ? moves.slice().reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
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