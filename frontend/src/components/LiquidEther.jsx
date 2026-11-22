import React, { useRef, useEffect } from 'react';

const LiquidEther = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const render = () => {
            time += 0.002;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Clear with a dark subtle base
            ctx.fillStyle = '#0F172A'; // Slate-900 base
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create liquid ether effect using overlapping sine waves
            // We will draw many lines/shapes with varying opacity

            ctx.lineWidth = 2;

            const lines = 30;
            const amplitude = 50;
            const width = canvas.width;
            const height = canvas.height;

            for (let i = 0; i < lines; i++) {
                ctx.beginPath();

                // Dynamic color gradient for "Ether" look (Cyan -> Purple -> Pink)
                const hue = (time * 50 + i * 10) % 360;
                ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.1)`;
                // Or mostly blue/purple
                // ctx.strokeStyle = `hsla(${220 + i * 2}, 80%, 60%, 0.15)`;

                let y = height / 2 + (i - lines / 2) * 15;

                ctx.moveTo(0, y);

                for (let x = 0; x < width; x += 10) {
                    const xNorm = x / width;

                    // Simplex-like noise simulation using sin/cos
                    const noise = Math.sin(xNorm * 10 + time * 2 + i * 0.1) * Math.cos(xNorm * 5 - time + i * 0.2);
                    const yOffset = noise * amplitude * (1 + Math.sin(time * 0.5));

                    ctx.lineTo(x, y + yOffset);
                }

                ctx.stroke();
            }

            // Add some glowing orbs
            const orbs = 5;
            for (let j = 0; j < orbs; j++) {
                const x = (Math.sin(time * 0.5 + j) * 0.5 + 0.5) * width;
                const y = (Math.cos(time * 0.3 + j) * 0.5 + 0.5) * height;
                const radius = 200 + Math.sin(time + j) * 50;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `hsla(${200 + j * 40}, 80%, 60%, 0.05)`);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
        />
    );
};

export default LiquidEther;
