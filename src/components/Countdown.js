'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
        <AnimatePresence mode='popLayout'>
            <motion.div
                key={value}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl md:text-5xl font-mono font-bold bg-white text-green-800 rounded-lg p-3 min-w-[3ch] text-center shadow-inner"
            >
                {String(value).padStart(2, '0')}
            </motion.div>
        </AnimatePresence>
        <span className="text-xs md:text-sm uppercase mt-2 tracking-widest">{label}</span>
    </div>
);

export default function Countdown({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex justify-center items-center">
            <TimeUnit value={timeLeft.days} label="Days" />
            <span className="text-2xl md:text-4xl font-bold -mt-8">:</span>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <span className="text-2xl md:text-4xl font-bold -mt-8">:</span>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <span className="text-2xl md:text-4xl font-bold -mt-8">:</span>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
    );
}
