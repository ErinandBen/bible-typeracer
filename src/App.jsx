import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import TypingArea from './components/TypingArea';
import RaceTrack from './components/RaceTrack';
import { bibleService } from './services/bibleService';
import './App.css';

const GameContainer = () => {
  const { gameState, isHost, hostGame, joinGame, startGame, myProgress, opponentProgress, peerId } = useGame();
  const [joinId, setJoinId] = useState('');

  const handleHost = () => {
    hostGame();
  };

  const handleJoin = () => {
    if (!joinId) return;
    joinGame(joinId);
  };

  const handleStart = () => {
    const verse = bibleService.getRandomVerse();
    startGame(verse);
  };

  if (gameState === 'MENU') {
    return (
      <div className="card menu-container">
        <h2>Catholic Bible Typeracer</h2>
        <p style={{ marginBottom: '2rem', fontStyle: 'italic' }}>
          Type the Word of God against friends or practice solo.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button className="btn" onClick={handleHost}>
            Host Game / Solo Practice
          </button>

          <div style={{ marginTop: '1rem', padding: '1rem', borderTop: '1px solid #eee' }}>
            <p>Or duplicate the Host ID to join:</p>
            <input
              type="text"
              placeholder="Enter Host Peer ID"
              className="input-field"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
            />
            <button className="btn" onClick={handleJoin}>Join Game</button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'WAITING') {
    return (
      <div className="card menu-container">
        <h2>Lobby</h2>
        <p>Your Peer ID: <strong>{peerId}</strong></p>
        {isHost ? (
          <div>
            <p>Waiting for opponent... or start solo.</p>
            <button className="btn" onClick={handleStart}>Start Race</button>
          </div>
        ) : (
          <p>Waiting for host to start...</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1000px' }}>
      <RaceTrack
        myProgress={myProgress}
        opponentProgress={opponentProgress}
        isMultiplayer={true}
      />
      <TypingArea />
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <h1>✝ Typeracer ✝</h1>
        <GameContainer />
      </div>
    </GameProvider>
  );
}

export default App;
