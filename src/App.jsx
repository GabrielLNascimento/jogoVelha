// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Board from './components/Board';
import NameInput from './components/NameInput';
import GameStatus from './components/GameStatus';
import './components/styles/GameMessage.css';
import './components/styles/StartButton.css';

const socket = io('https://api-jogovelha.onrender.com/');

function App() {
    const [status, setStatus] = useState('initial');
    const [message, setMessage] = useState('');
    const [player, setPlayer] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [name, setName] = useState('');
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null);
    const [winningCells, setWinningCells] = useState([]);
    const [players, setPlayers] = useState({ X: '', O: '' }); // Novo estado para mapear símbolos a nomes

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Conectado ao servidor');
        });

        socket.on('requestName', () => {
            if (isConnected) {
                setStatus('enterName');
            }
        });

        socket.on('waiting', (msg) => {
            setStatus('waiting');
            setMessage(msg);
        });

        socket.on('gameStart', ({ player, gameId, player1, player2 }) => {
            setStatus('playing');
            setPlayer(player);
            setGameId(gameId);
            setBoard(Array(9).fill(null));
            setWinner(null);
            setPlayer1(player1);
            setPlayer2(player2);
            setCurrentTurn('X');
            setMessage('');
            setWinningCells([]);
            setPlayers({ X: player1, O: player2 }); // Assume que player1 é X e player2 é O
            console.log('Jogo iniciado. Jogador:', player, 'GameId:', gameId);
        });

        socket.on('updateBoard', ({ board, turn }) => {
            setBoard(board);
            setCurrentTurn(
                turn ||
                    (board.filter((cell) => cell).length % 2 === 0 ? 'X' : 'O')
            );
        });

        socket.on('gameOver', ({ winner, winningCombo }) => {
            setWinner(winner);
            setStatus('finished');
            setCurrentTurn(null);
            setWinningCells(
                winningCombo || calculateWinningCells(board, winner)
            );
            console.log(
                'Fim de jogo. Vencedor:',
                winner,
                'Combo:',
                winningCombo
            );
        });

        socket.on('opponentLeft', () => {
            setStatus('initial');
            setMessage(
                'O oponente desconectou. Clique em "Jogar" para começar novamente.'
            );
            setCurrentTurn(null);
            setWinningCells([]);
        });

        return () => {
            socket.off('connect');
            socket.off('requestName');
            socket.off('waiting');
            socket.off('gameStart');
            socket.off('updateBoard');
            socket.off('gameOver');
            socket.off('opponentLeft');
        };
    }, [isConnected, board]);

    const calculateWinningCells = (board, winner) => {
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
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return line;
            }
        }
        return [];
    };

    const handleSetName = () => {
        if (name.trim()) {
            socket.emit('setName', name.trim());
            setStatus('waiting');
            setMessage('Esperando outro jogador...');
        }
    };

    const handleMove = (index) => {
        if (
            status === 'playing' &&
            !board[index] &&
            !winner &&
            currentTurn === player
        ) {
            socket.emit('move', { gameId, position: index });
        }
    };

    const handlePlayAgain = () => {
        socket.emit('playAgain', { gameId });
        setStatus('waiting');
        setMessage('Esperando outro jogador...');
        setWinningCells([]);
    };

    const getTurnMessage = () => {
        if (status !== 'playing' || winner) return null;
        return currentTurn === player ? 'Minha vez' : 'Vez do oponente';
    };

    return (
        <div className="App">
            {status === 'initial' && (
                <button
                    className="start-button"
                    onClick={() => setStatus('enterName')}
                >
                    Jogar
                </button>
            )}
            {status === 'enterName' && (
                <NameInput
                    name={name}
                    setName={setName}
                    handleSetName={handleSetName}
                />
            )}
            {status === 'waiting' && (
                <p className="game-message waiting-message">{message}</p>
            )}
            {(status === 'playing' || status === 'finished') && (
                <>
                    {status === 'playing' && (
                        <p
                            className={`game-message ${
                                currentTurn === player
                                    ? 'my-turn-message'
                                    : 'opponent-turn-message'
                            }`}
                        >
                            {getTurnMessage()}
                        </p>
                    )}
                    <GameStatus
                        status={status}
                        player1={player1}
                        player2={player2}
                        winner={winner}
                        player={player}
                        handlePlayAgain={handlePlayAgain}
                        players={players} // Passa o mapeamento de símbolos para nomes
                    />
                    <Board
                        board={board}
                        handleMove={handleMove}
                        status={status}
                        winner={winner}
                        winningCells={winningCells}
                    />
                </>
            )}
            {message && status !== 'waiting' && (
                <p className="game-message disconnect-message">{message}</p>
            )}
        </div>
    );
}

export default App;
