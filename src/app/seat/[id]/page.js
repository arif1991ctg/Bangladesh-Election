'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowLeft, AlertCircle, User, Ban } from 'lucide-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import toast, { Toaster } from 'react-hot-toast';
import { districts, getCandidatesForSeat, partyColors } from '@/lib/electionData';
import { submitVote, checkVoteStatus } from '@/lib/voteService';

// Check if user has already voted in ANY seat (localStorage backup)
const getGlobalVoteStatus = () => {
    if (typeof window === 'undefined') return null;
    const voteData = localStorage.getItem('election_vote_2026');
    if (voteData) {
        try {
            return JSON.parse(voteData);
        } catch {
            return null;
        }
    }
    return null;
};

// Save global vote to localStorage (backup for UI)
const saveGlobalVote = (fingerprint, seatId, candidateId, candidateName, seatName) => {
    const voteData = {
        fingerprint,
        seatId,
        candidateId,
        candidateName,
        seatName,
        timestamp: new Date().toISOString(),
    };
    localStorage.setItem('election_vote_2026', JSON.stringify(voteData));
};

export default function SeatPage({ params }) {
    const resolvedParams = use(params);
    const seatId = resolvedParams.id;

    const parts = seatId.split('-');
    const seatNumber = parseInt(parts.pop());
    const districtId = parts.join('-');

    const district = districts.find(d => d.id === districtId);
    const seatName = district ? `${district.seatPrefix}-${seatNumber}` : `আসন ${seatNumber}`;

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkingVote, setCheckingVote] = useState(true);
    const [fingerprint, setFingerprint] = useState(null);
    const [globalVote, setGlobalVote] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);

    const candidates = getCandidatesForSeat(districtId, seatNumber);

    useEffect(() => {
        const initFp = async () => {
            try {
                const fp = await FingerprintJS.load();
                const { visitorId } = await fp.get();
                setFingerprint(visitorId);

                // First check localStorage (fast)
                const existingLocalVote = getGlobalVoteStatus();
                if (existingLocalVote) {
                    setGlobalVote(existingLocalVote);
                    setIsBlocked(true);
                    setCheckingVote(false);
                    return;
                }

                // Then check Firebase (reliable - works in incognito)
                const firebaseStatus = await checkVoteStatus(visitorId);
                if (firebaseStatus.hasVoted) {
                    const voteData = {
                        fingerprint: visitorId,
                        seatId: firebaseStatus.voteData.seatId,
                        candidateId: firebaseStatus.voteData.candidateId,
                        candidateName: firebaseStatus.voteData.candidateName,
                        seatName: firebaseStatus.voteData.seatId, // approximate
                    };
                    setGlobalVote(voteData);
                    setIsBlocked(true);
                    // Also save to localStorage for faster future checks
                    localStorage.setItem('election_vote_2026', JSON.stringify(voteData));
                }

                setCheckingVote(false);
            } catch (err) {
                console.error('Fingerprint error:', err);
                setCheckingVote(false);
            }
        };
        initFp();
    }, [seatId]);

    const handleVote = async () => {
        if (!selectedCandidate || isBlocked || !fingerprint) return;

        setLoading(true);

        const selectedCandidateInfo = candidates.find(c => c.id === selectedCandidate);

        // Submit to Firebase
        const result = await submitVote(
            seatId,
            selectedCandidate,
            fingerprint,
            selectedCandidateInfo?.name || 'Unknown',
            selectedCandidateInfo?.party || 'Unknown'
        );

        if (result.success) {
            // Save to localStorage as backup
            saveGlobalVote(fingerprint, seatId, selectedCandidate, selectedCandidateInfo?.name, seatName);

            setGlobalVote({
                fingerprint,
                seatId,
                candidateId: selectedCandidate,
                candidateName: selectedCandidateInfo?.name,
                seatName,
            });

            toast.success('আপনার ভোট সফলভাবে গৃহীত হয়েছে!');
        } else if (result.alreadyVoted) {
            // Already voted - block and show message
            setIsBlocked(true);
            setGlobalVote({
                fingerprint,
                seatId: result.existingVote?.seatId,
                candidateName: result.existingVote?.candidateName,
            });
            toast.error(result.message);
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    const votedCandidateData = globalVote
        ? candidates.find(c => c.id === globalVote.candidateId)
        : null;

    // If user already voted
    if (globalVote) {
        const votedInThisSeat = globalVote.seatId === seatId;
        const colors = votedCandidateData ? partyColors[votedCandidateData.partyType] : partyColors.other;

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
                <Toaster position="bottom-center" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-center max-w-md border border-white/20"
                >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {votedInThisSeat ? 'ভোট সম্পন্ন! ✓' : 'আপনি ইতিমধ্যে ভোট দিয়েছেন'}
                    </h2>

                    <p className="text-white/80 mb-6">
                        আপনি <span className="text-green-300 font-bold">{globalVote.seatName}</span> আসনে ভোট দিয়েছেন।
                    </p>

                    <div className={`rounded-xl p-4 mb-6 ${colors?.bg || 'bg-blue-600/20'} border ${colors?.border || 'border-blue-500'}`}>
                        <p className="text-white/60 text-sm mb-2">আপনার ভোট</p>
                        {votedCandidateData ? (
                            <>
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <span className="text-2xl">{votedCandidateData.symbolEmoji}</span>
                                    <span className={`font-bold ${colors?.text || 'text-blue-400'}`}>{votedCandidateData.symbol}</span>
                                </div>
                                <p className="text-white font-medium">{votedCandidateData.name}</p>
                                <p className="text-white/70 text-sm">{votedCandidateData.party}</p>
                            </>
                        ) : (
                            <p className="text-white font-medium">{globalVote.candidateName}</p>
                        )}
                    </div>

                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
                        <p className="text-yellow-300 text-sm">
                            ⚠️ প্রতি ব্যক্তি শুধুমাত্র একটি আসনে একবার ভোট দিতে পারবেন।
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full transition-all font-medium"
                    >
                        🏠 হোম পেজে ফিরে যান
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Blocked user
    if (isBlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-center max-w-md border border-white/20"
                >
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Ban className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">ভোট দেওয়া সম্ভব নয়</h2>
                    <p className="text-white/80 mb-6">
                        এই ডিভাইস থেকে ইতিমধ্যে একটি ভোট দেওয়া হয়েছে।
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full transition-all"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-6 px-4">
            <Toaster position="bottom-center" />
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/seats" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
                        <ArrowLeft size={18} className="mr-2" />
                        আসন তালিকায় ফিরে যান
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-center shadow-xl shadow-green-900/30"
                    >
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="text-3xl">🗳️</span>
                            <h1 className="text-xl md:text-2xl font-bold text-white">{seatName}</h1>
                        </div>
                        <p className="text-white/80">আপনার পছন্দের প্রার্থী নির্বাচন করুন</p>
                        <p className="text-white/60 text-sm mt-1">মোট প্রার্থী: <span className="text-white font-bold">{candidates.length}</span> জন</p>
                    </motion.div>

                    {/* Warning */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mt-4 text-center">
                        <p className="text-yellow-400 text-sm">
                            ⚠️ সতর্কতা: প্রতি ব্যক্তি শুধুমাত্র <span className="font-bold">একটি আসনে একবার</span> ভোট দিতে পারবেন
                        </p>
                    </div>
                </div>

                {/* Candidates Grid - Taller Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                    {candidates.map((candidate, index) => {
                        const colors = partyColors[candidate.partyType] || partyColors.other;
                        const isSelected = selectedCandidate === candidate.id;

                        return (
                            <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedCandidate(candidate.id)}
                                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group relative ${isSelected
                                    ? `${colors.border} shadow-lg scale-[1.02]`
                                    : "border-slate-700/50 hover:border-slate-600"
                                    }`}
                            >
                                <div className={`${isSelected ? `bg-gradient-to-br ${colors.gradient}` : 'bg-gradient-to-br from-slate-800 to-slate-900'} p-4`}>
                                    {/* Selection Check */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                    )}

                                    {/* Symbol - Large */}
                                    <div className="text-center mb-3">
                                        <div className={`text-4xl md:text-5xl mb-2`}>
                                            {candidate.symbolEmoji}
                                        </div>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : `${colors.bg} ${colors.text}`
                                            }`}>
                                            {candidate.symbol}
                                        </span>
                                    </div>

                                    {/* Candidate Image Placeholder */}
                                    <div className={`w-16 h-16 mx-auto rounded-full mb-3 flex items-center justify-center border-2 ${isSelected ? 'bg-white/20 border-white/30' : 'bg-slate-700 border-slate-600'
                                        }`}>
                                        <User className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                    </div>

                                    {/* Candidate Name - Full */}
                                    <h3 className={`font-bold text-sm md:text-base text-center leading-tight mb-2 min-h-[40px] ${isSelected ? 'text-white' : 'text-slate-200'
                                        }`}>
                                        {candidate.name}
                                    </h3>

                                    {/* Party Name - Full */}
                                    <p className={`text-xs md:text-sm text-center leading-tight min-h-[32px] ${isSelected ? 'text-white/80' : 'text-slate-400'
                                        }`}>
                                        {candidate.party}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Selected Info */}
                {selectedCandidate && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/10"
                    >
                        <p className="text-slate-400 text-sm mb-2">আপনি নির্বাচিত করেছেন:</p>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${(partyColors[candidates.find(c => c.id === selectedCandidate)?.partyType] || partyColors.other).bg}`}>
                                {candidates.find(c => c.id === selectedCandidate)?.symbolEmoji}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{candidates.find(c => c.id === selectedCandidate)?.name}</h3>
                                <p className="text-slate-400">{candidates.find(c => c.id === selectedCandidate)?.party}</p>
                                <p className={(partyColors[candidates.find(c => c.id === selectedCandidate)?.partyType] || partyColors.other).text + " text-sm font-medium"}>
                                    প্রতীক: {candidates.find(c => c.id === selectedCandidate)?.symbol}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Vote Button */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: selectedCandidate ? 1.02 : 1 }}
                        whileTap={{ scale: selectedCandidate ? 0.98 : 1 }}
                        onClick={handleVote}
                        disabled={!selectedCandidate || loading}
                        className={`px-12 py-4 rounded-full text-lg font-bold text-white shadow-xl transition-all ${!selectedCandidate || loading
                            ? "bg-slate-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/40"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="animate-spin mr-2" /> প্রক্রিয়াকরণ হচ্ছে...
                            </span>
                        ) : (
                            "✓ ভোট নিশ্চিত করুন"
                        )}
                    </motion.button>

                    {!selectedCandidate && (
                        <p className="text-slate-500 mt-4 text-sm flex items-center justify-center">
                            <AlertCircle size={16} className="mr-2" />
                            প্রথমে একজন প্রার্থী নির্বাচন করুন
                        </p>
                    )}
                </div>

                <p className="text-center text-slate-600 text-xs mt-8">
                    আপনার ভোট সম্পূর্ণ গোপন ও নিরাপদ। একবার ভোট দিলে পরিবর্তন করা যাবে না।
                </p>
            </div>
        </div>
    );
}
