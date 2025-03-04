// GameStatus.jsx
import React from 'react';
import Confetti from 'react-confetti';
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
        const winnerName = winner === 'Empate' ? null : players[winner];
        const loserSymbol = winner === 'X' ? 'O' : winner === 'O' ? 'X' : null;
        const loserName = loserSymbol ? players[loserSymbol] : null;
        const isWinner = winner === player && winner !== 'Empate';
        const isLoser = winner !== 'Empate' && winner !== player;

        return (
            <div className={`game-status ${isLoser ? 'shake' : ''}`}>
                {isWinner && <Confetti />}
                <p className="versus">
                    {player1} vs {player2}
                </p>
                <p
                    className={`result ${
                        winner === 'Empate'
                            ? 'draw'
                            : isWinner
                            ? 'winner'
                            : 'loser'
                    }`}
                >
                    {winner === 'Empate'
                        ? 'Empate!'
                        : isWinner
                        ? `Você venceu! - ${winnerName}`
                        : `Perdedor: ${loserName}`}
                </p>
                {isWinner && <span className="emoji happy">😊</span>}
                {isLoser && <span className="emoji sad">😢</span>}
                <button className="play-again-button" onClick={handlePlayAgain}>
                    Jogar Novamente
                </button>
            </div>
        );
    }

    return null;
}

export default GameStatus;
