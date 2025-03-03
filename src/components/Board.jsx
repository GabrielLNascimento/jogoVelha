// Board.js
import React, { useState } from 'react';
import './styles/Board.css';

function Board({ board, handleMove, status, winner, winningCells }) {
    const [clickedIndex, setClickedIndex] = useState(null);

    const handleClick = (index) => {
        if (status === 'playing' && !board[index] && !winner) {
            setClickedIndex(index);
            handleMove(index);
            setTimeout(() => setClickedIndex(null), 300);
        }
    };

    return (
        <div className={`board ${winner ? 'winner' : ''}`}>
            {board.map((cell, index) => (
                <div
                    key={index}
                    className={`cell ${
                        clickedIndex === index ? 'clicked' : ''
                    } ${winningCells.includes(index) ? 'winning-cell' : ''}`}
                    onClick={() => handleClick(index)}
                >
                    {cell}
                </div>
            ))}
        </div>
    );
}

export default Board;
