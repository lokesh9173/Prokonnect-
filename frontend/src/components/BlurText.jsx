import React from 'react';
import { motion } from 'framer-motion';

const BlurText = ({
    text = '',
    delay = 0,
    className = '',
    animateBy = 'words', // 'words' or 'letters'
    direction = 'top', // 'top' or 'bottom'
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: delay },
        },
    };

    const child = {
        hidden: {
            filter: 'blur(10px)',
            opacity: 0,
            y: direction === 'top' ? -50 : 50,
        },
        visible: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9], // Smooth easing
            },
        },
    };

    return (
        <motion.div
            className={`flex flex-wrap justify-center gap-x-2 gap-y-1 ${className}`} // Flex wrap for responsiveness
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            {elements.map((el, i) => (
                <motion.span
                    key={i}
                    variants={child}
                    className="inline-block"
                >
                    {el === ' ' ? '\u00A0' : el}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default BlurText;
