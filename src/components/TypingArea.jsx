import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

const TypingArea = () => {
    const { verse, updateProgress, gameState, startGame } = useGame();
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const inputRef = useRef(null);

    const targetText = verse ? verse.text : "";

    useEffect(() => {
        if (gameState === 'RACING') {
            setInput('');
            setStartTime(Date.now());
            setIsFinished(false);
            setWpm(0);
            if (inputRef.current) inputRef.current.focus();
        }
    }, [gameState, verse]);

    const handleChange = (e) => {
        if (isFinished || gameState !== 'RACING') return;

        const val = e.target.value;
        setInput(val);

        // Calculate progress
        const progress = Math.min(100, (val.length / targetText.length) * 100);
        updateProgress(progress);

        // Calculate WPM
        if (startTime) {
            const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
            const wordsTyped = val.length / 5;
            setWpm(Math.round(wordsTyped / timeElapsed) || 0);
        }

        // Check finish
        if (val === targetText) {
            setIsFinished(true);
            updateProgress(100);
            // Maybe trigger game over in context or just show local finish
        }
    };

    if (!verse) return <div className="text-center p-10 font-serif">Waiting for verse...</div>;

    return (
        <div className="card">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-amber-900 font-serif mb-2">{verse.reference}</h2>
                <div className="verse-display">
                    {targetText.split('').map((char, index) => {
                        let className = "char-default";
                        if (index < input.length) {
                            if (input[index] === char) {
                                className = "char-correct";
                            } else {
                                className = "char-incorrect";
                            }
                        }
                        return (
                            <span key={index} className={className}>{char}</span>
                        );
                    })}
                </div>
            </div>

            <textarea
                ref={inputRef}
                value={input}
                onChange={handleChange}
                className="typing-input"
                rows={3}
                placeholder="Type the verse above..."
                disabled={isFinished || gameState !== 'RACING'}
                onPaste={(e) => e.preventDefault()}
            />

            <div className="stats">
                <div>WPM: {wpm}</div>
                {isFinished && <div style={{ color: 'green' }}>Amen! Finished!</div>}
            </div>
        </div>
    );
};

export default TypingArea;
