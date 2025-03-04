// NameInput.jsx
import React from 'react';
import './styles/NameInput.css';

function NameInput({ name, setName, handleSetName }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && name.trim()) {
            handleSetName();
        }
    };

    return (
        <div className="name-input-container">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite seu nome"
                autoFocus
            />
            <button onClick={handleSetName}>Confirmar</button>
        </div>
    );
}

export default NameInput;
