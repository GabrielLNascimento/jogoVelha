// GameStatus.js
import React from 'react';
import './styles/GameStatus.css';
import './styles/PlayAgainButton.css';

function GameStatus({
    status,
    player1,
    player2,
    winner,
    player,
    handlePlayAgain,
    players,
}) {
    if (status === 'playing') {
        return (
            <div className="game-status">
                <p className="versus">
                    {player1} vs {player2}
                </p>
                <p className="player-info">Você é: {player}</p>
            </div>
        );
    }

    if (status === 'finished') {
        const winnerName = winner === 'Empate' ? null : players[winner]; // Pega o nome do vencedor
        return (
            <div className="game-status">
                <p className="versus">
                    {player1} vs {player2}
                </p>
                <p
                    className={`result ${
                        winner === 'Empate' ? 'draw' : 'winner'
                    }`}
                >
                    {winner === 'Empate'
                        ? 'Empate!'
                        : `Vencedor: ${winnerName}`}
                </p>
                <button className="play-again-button" onClick={handlePlayAgain}>
                    Jogar Novamente
                </button>
            </div>
        );
    }

    return null;
}

export default GameStatus;
