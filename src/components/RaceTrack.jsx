import React from 'react';
import { motion } from 'framer-motion';

const RaceTrack = ({ myProgress, opponentProgress, isMultiplayer }) => {
    return (
        <div className="race-container">
            <div className="relative">

                {/* My Lane */}
                <div className="lane">
                    <div className="lane-label">YOU</div>
                    <motion.div
                        className="racer-icon"
                        initial={{ left: 0 }}
                        animate={{ left: `${myProgress}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        🕊️
                    </motion.div>
                </div>

                {/* Opponent Lane (only if multiplayer) */}
                {isMultiplayer && (
                    <div className="lane" style={{ opacity: 0.8 }}>
                        <div className="lane-label">OPPONENT</div>
                        <motion.div
                            className="racer-icon"
                            initial={{ left: 0 }}
                            animate={{ left: `${opponentProgress}%` }}
                            transition={{ type: "spring", stiffness: 100 }}
                            style={{ filter: "grayscale(100%)" }}
                        >
                            🦅
                        </motion.div>
                    </div>
                )}
            </div>

            <div className="text-center mt-2 text-sm text-gray-500 font-serif italic" style={{ textAlign: 'center', marginTop: '1rem', fontStyle: 'italic' }}>
                "Run so as to win." - 1 Cor 9:24
            </div>
        </div>
    );
};

export default RaceTrack;
