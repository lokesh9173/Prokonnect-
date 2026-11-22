import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Typewriter = ({ text, speed = 50, className = '', cursor = true }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setIsStarted(true);
        }, 500); // Slight delay before starting

        return () => clearTimeout(startTimeout);
    }, []);

    useEffect(() => {
        if (!isStarted) return;

        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedText((prev) => {
                if (index < text.length) {
                    index++;
                    return text.slice(0, index);
                }
                clearInterval(intervalId);
                return prev;
            });
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed, isStarted]);

    return (
        <span className={`${className} inline-block`}>
            {displayedText}
            {cursor && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-block w-[0.1em] h-[1em] bg-current ml-1 align-middle"
                />
            )}
        </span>
    );
};

export default Typewriter;
