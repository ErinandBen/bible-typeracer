import React, { createContext, useContext, useState, useEffect } from 'react';
import { peerService } from '../services/peerService';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState('MENU'); // MENU, WAITING, RACING, FINISHED
    const [isHost, setIsHost] = useState(false);
    const [peerId, setPeerId] = useState(null);
    const [opponentId, setOpponentId] = useState(null);
    const [verse, setVerse] = useState(null);
    const [myProgress, setMyProgress] = useState(0);
    const [opponentProgress, setOpponentProgress] = useState(0);

    useEffect(() => {
        // Initialize peer on mount (generate ID)
        peerService.initialize().then(id => setPeerId(id));

        return () => {
            peerService.destroy(); // Clean up on unmount
        };
    }, []);

    useEffect(() => {
        // Update callbacks when isHost changes
        peerService.onConnect = (id) => {
            setOpponentId(id);
            // If we are host, we stay in WAITING until we start the game manually
            // If we are joiner, we wait for host to start
            // Effectively, connection just confirms opponent presence
        };

        peerService.onData = (data) => {
            handleData(data);
        };

        peerService.onClose = () => {
            setOpponentId(null);
            setGameState('MENU');
            alert("Opponent disconnected");
        };
    }, [isHost]);

    const handleData = (data) => {
        switch (data.type) {
            case 'START_GAME':
                setVerse(data.payload.verse);
                setGameState('RACING');
                setMyProgress(0);
                setOpponentProgress(0);
                break;
            case 'PROGRESS_UPDATE':
                setOpponentProgress(data.payload.progress);
                break;
            case 'GAME_OVER':
                // Handle win/loss if needed
                break;
            default:
                console.log("Unknown data type", data);
        }
    };

    const hostGame = () => {
        setIsHost(true);
        setGameState('WAITING');
    };

    const joinGame = (hostPeerId) => {
        setIsHost(false);
        peerService.connect(hostPeerId);
    };

    const startGame = (selectedVerse) => {
        if (!isHost) return;
        setVerse(selectedVerse);
        setGameState('RACING');
        setMyProgress(0);
        setOpponentProgress(0);

        peerService.send({
            type: 'START_GAME',
            payload: { verse: selectedVerse }
        });
    };

    const updateProgress = (progress) => {
        setMyProgress(progress);
        peerService.send({
            type: 'PROGRESS_UPDATE',
            payload: { progress }
        });
    };

    return (
        <GameContext.Provider value={{
            gameState,
            isHost,
            peerId,
            opponentId,
            verse,
            myProgress,
            opponentProgress,
            hostGame,
            joinGame,
            startGame,
            updateProgress
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
