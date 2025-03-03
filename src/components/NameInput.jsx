// NameInput.js
import React from 'react';
import './styles/NameInput.css';

function NameInput({ name, setName, handleSetName }) {
    return (
        <div className="name-input-container">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
            />
            <button onClick={handleSetName}>Confirmar</button>
        </div>
    );
}

export default NameInput;
