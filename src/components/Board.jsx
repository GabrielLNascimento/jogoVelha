// Board.jsx
import React, { useState } from 'react';
import './styles/Board.css';

function Board({ board, handleMove, status, winner, winningCells, player }) {
    const [clickedIndex, setClickedIndex] = useState(null);
    const isLoser = winner && winner !== 'Empate' && winner !== player;
    const loserSymbol = winner === 'X' ? 'O' : winner === 'O' ? 'X' : null;

    const handleClick = (index) => {
        if (status === 'playing' && !board[index] && !winner) {
            setClickedIndex(index);
            handleMove(index);
            setTimeout(() => setClickedIndex(null), 300);
        }
    };

    return (
        <div
            className={`board ${
                winner ? (winner === player ? 'winner' : 'loser') : ''
            }`}
        >
            {board.map((cell, index) => (
                <div
                    key={index}
                    className={`cell 
            ${clickedIndex === index ? 'clicked' : ''} 
            ${
                winningCells.includes(index)
                    ? isLoser
                        ? 'losing-cell'
                        : 'winning-cell'
                    : ''
            } 
            ${isLoser && cell === loserSymbol ? 'loser-symbol' : ''}`}
                    onClick={() => handleClick(index)}
                >
                    {cell}
                </div>
            ))}
        </div>
    );
}

export default Board;
