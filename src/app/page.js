'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Party Data
const parties = [
    { id: 'jamat', name: 'জামায়াতে ইসলামী', shortName: 'জামায়াত', symbol: '⚖️', symbolName: 'দাড়িপাল্লা', gradient: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/30' },
    { id: 'bnp', name: 'বিএনপি', shortName: 'বিএনপি', symbol: '🌾', symbolName: 'ধানের শীষ', gradient: 'from-amber-500 to-yellow-600', shadow: 'shadow-amber-500/30' },
    { id: 'independent', name: 'স্বতন্ত্র', shortName: 'স্বতন্ত্র', symbol: '⭐', symbolName: 'তারা', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
];

// Countdown Component
function Countdown({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calcTime = () => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;
            if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calcTime());
        const interval = setInterval(() => setTimeLeft(calcTime()), 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex justify-center gap-2 md:gap-4">
            {[
                { value: timeLeft.days, label: 'দিন' },
                { value: timeLeft.hours, label: 'ঘন্টা' },
                { value: timeLeft.minutes, label: 'মিনিট' },
                { value: timeLeft.seconds, label: 'সেকেন্ড' },
            ].map((item, i) => (
                <div key={i} className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
                        <span className="text-xl md:text-3xl font-bold text-white">{String(item.value).padStart(2, '0')}</span>
                    </div>
                    <p className="text-xs mt-1 text-white/60">{item.label}</p>
                </div>
            ))}
        </div>
    );
}

import { getElectionStats } from '@/lib/voteService';

// ...

export default function Home() {
    const [votes, setVotes] = useState({ jamat: 0, bnp: 0, independent: 0 });
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await getElectionStats();
                setTotalVotes(stats.totalVotes || 0);

                // Map party votes from Firebase
                if (stats.partyVotes) {
                    setVotes({
                        jamat: stats.partyVotes['jamat'] || 0,
                        bnp: stats.partyVotes['bnp'] || 0,
                        independent: (stats.partyVotes['independent'] || 0) + (stats.partyVotes['other'] || 0)
                    });
                }

            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const getPercentage = (count) => ((count / totalVotes) * 100).toFixed(1);
    const sortedParties = [...parties].sort((a, b) => votes[b.id] - votes[a.id]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* ========== SUPER PROMINENT VOTE BUTTON - TOP ========== */}
            <section className="relative overflow-hidden">
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 animate-pulse"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl"></div>

                <div className="relative py-8 md:py-12 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Flag + Title */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="inline-block mb-4"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 border-4 border-white/20">
                                <span className="text-3xl md:text-4xl">🇧🇩</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl md:text-4xl font-extrabold mb-2"
                        >
                            বাংলাদেশ ১৩তম জাতীয় নির্বাচন
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-400 mb-6"
                        >
                            ১২ ফেব্রুয়ারি ২০২৬
                        </motion.p>

                        {/* ===== MEGA VOTE BUTTON ===== */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mb-4"
                        >
                            <Link
                                href="/seats"
                                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white font-extrabold py-5 md:py-6 px-10 md:px-16 rounded-full text-xl md:text-3xl transition-all shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transform hover:-translate-y-2 hover:scale-105 border-2 border-white/30"
                            >
                                {/* Pulse Ring */}
                                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></span>

                                {/* Button Content */}
                                <span className="relative flex items-center gap-3">
                                    <span className="text-3xl md:text-4xl animate-bounce">🗳️</span>
                                    <span>এখনই ভোট দিন</span>
                                    <span className="text-2xl">→</span>
                                </span>
                            </Link>
                        </motion.div>

                        {/* ===== RESULTS BUTTON ===== */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6"
                        >
                            <Link
                                href="/results"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold py-3 px-8 rounded-full transition-all hover:scale-105"
                            >
                                <span className="text-xl">📊</span>
                                <span>ফলাফল দেখুন</span>
                                <span>→</span>
                            </Link>
                        </motion.div>

                        {/* Countdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">ভোটের বাকি সময়</p>
                            <Countdown targetDate="2026-02-12T08:00:00+06:00" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Live Stats - Square Boxes */}
            <section className="py-6 px-4 border-y border-white/10 bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            লাইভ ভোট পরিসংখ্যান
                        </h2>
                        <p className="text-sm text-slate-400">মোট: <span className="text-white font-bold">{totalVotes.toLocaleString('bn-BD')}</span></p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-6">
                        {sortedParties.map((party, index) => (
                            <motion.div
                                key={party.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={`relative overflow-hidden rounded-2xl p-4 md:p-6 bg-gradient-to-br ${party.gradient} ${party.shadow} shadow-xl`}
                            >
                                {index === 0 && (
                                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold">
                                        🏆 শীর্ষে
                                    </div>
                                )}

                                <div className="text-center">
                                    <span className="text-3xl md:text-4xl block mb-2">{party.symbol}</span>
                                    <h3 className="font-bold text-sm md:text-base mb-1">{party.shortName}</h3>
                                    <p className="text-xs text-white/70 mb-2">{party.symbolName}</p>

                                    <div className="bg-white/20 backdrop-blur rounded-xl p-2">
                                        <p className="text-lg md:text-2xl font-bold">{votes[party.id].toLocaleString('bn-BD')}</p>
                                        <p className="text-xs text-white/80">{getPercentage(votes[party.id])}%</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-10 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
                    {[
                        { icon: '🔒', title: 'সুরক্ষিত ভোটিং', desc: 'ফিঙ্গারপ্রিন্ট ও আইপি যাচাই দ্বারা সুরক্ষিত' },
                        { icon: '📊', title: 'লাইভ আপডেট', desc: 'রিয়েল-টাইমে ভোটের ফলাফল দেখুন' },
                        { icon: '🇧🇩', title: '৩০০ আসন', desc: 'সারাদেশে সকল আসনে ভোট গ্রহণ' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="p-5 bg-white/5 backdrop-blur rounded-2xl border border-white/10 text-center"
                        >
                            <span className="text-3xl mb-2 block">{item.icon}</span>
                            <h3 className="font-bold mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 text-center text-slate-500 text-sm border-t border-white/10">
                <p>© ২০২৬ বাংলাদেশ নির্বাচন কমিশন | ডিজিটাল ভোটিং</p>
            </footer>
        </main>
    );
}
