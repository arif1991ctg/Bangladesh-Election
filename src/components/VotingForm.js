'use client';

import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function VotingForm({ seat, candidates }) {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fingerprint, setFingerprint] = useState(null);
    const [voted, setVoted] = useState(false);

    useEffect(() => {
        // Initialize FingerprintJS
        const setFp = async () => {
            const fp = await FingerprintJS.load();
            const { visitorId } = await fp.get();
            setFingerprint(visitorId);
        };
        setFp();

        // Check local storage for previous vote (Quick check UI only)
        const localVote = localStorage.getItem(`voted_seat_${seat.id}`);
        if (localVote) setVoted(true);
    }, [seat.id]);

    const handleVote = async () => {
        if (!selectedCandidate) return;
        if (!fingerprint) {
            toast.error("Security check failed. Please refresh.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seatId: seat.id,
                    candidateId: selectedCandidate,
                    fingerprint,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Vote failed');
            }

            toast.success("Vote Cast Successfully!");
            setVoted(true);
            localStorage.setItem(`voted_seat_${seat.id}`, 'true');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (voted) {
        return (
            <div className="text-center p-8 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800">You have successfully voted!</h2>
                <p className="text-green-700 mt-2">Thank you for exercising your democratic right.</p>
            </div>
        );
    }

    return (
        <>
            <Toaster position="bottom-center" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {candidates.map((candidate) => (
                    <motion.div
                        key={candidate.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCandidate(candidate.id)}
                        className={cn(
                            "cursor-pointer rounded-xl p-4 border-2 transition-all relative overflow-hidden",
                            selectedCandidate === candidate.id
                                ? "border-green-600 bg-green-50 shadow-md ring-2 ring-green-200"
                                : "border-slate-200 bg-white hover:border-green-300 hover:bg-slate-50"
                        )}
                    >
                        {selectedCandidate === candidate.id && (
                            <div className="absolute top-2 right-2 text-green-600">
                                <CheckCircle className="w-6 h-6 fill-green-100" />
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            {/* Fallback avatar if no image */}
                            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                {candidate.photoUrl ? (
                                    <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{candidate.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{candidate.party}</p>
                                <p className="text-xs text-slate-400 mt-1">Symbol: {candidate.symbol}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={handleVote}
                    disabled={!selectedCandidate || loading}
                    className={cn(
                        "px-8 py-4 rounded-full text-xl font-bold text-white shadow-lg transition-all min-w-[200px]",
                        !selectedCandidate || loading
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-1"
                    )}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <Loader2 className="animate-spin mr-2" /> Processing...
                        </span>
                    ) : (
                        "Confirm Vote"
                    )}
                </button>
            </div>
        </>
    );
}
