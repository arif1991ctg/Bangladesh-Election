'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, MapPin, TrendingUp, RefreshCw, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { districts, getCandidatesForSeat, partyColors } from '@/lib/electionData';

// Mock data structure for results (replace with Firebase data)
const generateMockResults = () => {
    const results = {};

    // Generate some sample results for demo
    const sampleSeats = [
        { districtId: 'chittagong', seatNumber: 9 },
        { districtId: 'chittagong', seatNumber: 1 },
        { districtId: 'dhaka', seatNumber: 1 },
        { districtId: 'dhaka', seatNumber: 5 },
        { districtId: 'sylhet', seatNumber: 1 },
    ];

    sampleSeats.forEach(({ districtId, seatNumber }) => {
        const seatId = `${districtId}-${seatNumber}`;
        const candidates = getCandidatesForSeat(districtId, seatNumber);
        const district = districts.find(d => d.id === districtId);
        const seatName = district ? `${district.seatPrefix}-${seatNumber}` : seatId;

        // Generate random vote counts
        const candidateResults = candidates.map(c => ({
            ...c,
            votes: Math.floor(Math.random() * 5000) + 500
        })).sort((a, b) => b.votes - a.votes);

        const totalVotes = candidateResults.reduce((sum, c) => sum + c.votes, 0);

        results[seatId] = {
            seatId,
            seatName,
            districtName: district?.name || districtId,
            totalVotes,
            candidates: candidateResults,
            winner: candidateResults[0],
            margin: candidateResults[0].votes - (candidateResults[1]?.votes || 0)
        };
    });

    return results;
};

// Calculate party standings
const calculatePartyStandings = (results) => {
    const standings = {};

    Object.values(results).forEach(seat => {
        if (seat.winner) {
            const party = seat.winner.party;
            if (!standings[party]) {
                standings[party] = {
                    party,
                    wins: 0,
                    totalVotes: 0,
                    partyType: seat.winner.partyType,
                    symbolEmoji: seat.winner.symbolEmoji
                };
            }
            standings[party].wins++;
            standings[party].totalVotes += seat.winner.votes;
        }
    });

    return Object.values(standings).sort((a, b) => b.wins - a.wins);
};

export default function ResultsPage() {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedSeat, setExpandedSeat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        loadResults();
        // Auto refresh every 30 seconds
        const interval = setInterval(loadResults, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadResults = async () => {
        setLoading(true);
        // In production, fetch from Firebase
        // const data = await getAllSeatResults();

        // For demo, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockResults = generateMockResults();
        setResults(mockResults);
        setLastUpdated(new Date());
        setLoading(false);
    };

    const partyStandings = calculatePartyStandings(results);
    const totalVotes = Object.values(results).reduce((sum, seat) => sum + seat.totalVotes, 0);
    const seatsWithResults = Object.keys(results).length;

    const filteredResults = Object.values(results).filter(seat =>
        seat.seatName.includes(searchQuery) ||
        seat.districtName.includes(searchQuery) ||
        seat.winner?.name?.includes(searchQuery)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">🗳️ নির্বাচনের ফলাফল</h1>
                    <p className="text-slate-400">রিয়েল-টাইম ভোট গণনা ও বিজয়ী</p>
                    {lastUpdated && (
                        <p className="text-slate-500 text-sm mt-2">
                            সর্বশেষ আপডেট: {lastUpdated.toLocaleTimeString('bn-BD')}
                        </p>
                    )}
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-4 text-center"
                    >
                        <Users className="w-8 h-8 mx-auto mb-2 text-white/80" />
                        <p className="text-2xl md:text-3xl font-bold text-white">{totalVotes.toLocaleString('bn-BD')}</p>
                        <p className="text-white/70 text-sm">মোট ভোট</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-center"
                    >
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-white/80" />
                        <p className="text-2xl md:text-3xl font-bold text-white">{seatsWithResults}</p>
                        <p className="text-white/70 text-sm">ফলাফল ঘোষিত আসন</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-4 text-center"
                    >
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-white/80" />
                        <p className="text-2xl md:text-3xl font-bold text-white">৩০০</p>
                        <p className="text-white/70 text-sm">মোট আসন</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-4 text-center"
                    >
                        <Trophy className="w-8 h-8 mx-auto mb-2 text-white/80" />
                        <p className="text-2xl md:text-3xl font-bold text-white">{partyStandings[0]?.wins || 0}</p>
                        <p className="text-white/70 text-sm">শীর্ষ দল জয়</p>
                    </motion.div>
                </div>

                {/* Party Standings */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="text-yellow-400" /> দলভিত্তিক ফলাফল
                    </h2>

                    <div className="space-y-3">
                        {partyStandings.map((party, index) => {
                            const colors = partyColors[party.partyType] || partyColors.other;
                            const percentage = seatsWithResults > 0 ? (party.wins / seatsWithResults * 100).toFixed(1) : 0;

                            return (
                                <div key={party.party} className="relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{party.symbolEmoji}</span>
                                            <span className="text-white font-medium text-sm md:text-base">
                                                {party.party.length > 25 ? party.party.substring(0, 25) + '...' : party.party}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold ${colors.text}`}>{party.wins} আসন</span>
                                            <span className="text-slate-400 text-sm">({percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Search & Refresh */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="আসন বা প্রার্থী খুঁজুন..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={loadResults}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
                        রিফ্রেশ
                    </button>
                </div>

                {/* Seat-wise Results */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin className="text-blue-400" /> আসনভিত্তিক ফলাফল
                    </h2>

                    {filteredResults.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            {loading ? 'লোড হচ্ছে...' : 'কোনো ফলাফল পাওয়া যায়নি'}
                        </div>
                    )}

                    {filteredResults.map((seat, index) => {
                        const isExpanded = expandedSeat === seat.seatId;
                        const winnerColors = partyColors[seat.winner?.partyType] || partyColors.other;

                        return (
                            <motion.div
                                key={seat.seatId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
                            >
                                {/* Seat Header */}
                                <div
                                    onClick={() => setExpandedSeat(isExpanded ? null : seat.seatId)}
                                    className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${winnerColors.bg}`}>
                                                {seat.winner?.symbolEmoji}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold">{seat.seatName}</h3>
                                                <p className="text-slate-400 text-sm">{seat.districtName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className={`font-bold ${winnerColors.text}`}>
                                                    🏆 {seat.winner?.name?.substring(0, 15)}...
                                                </p>
                                                <p className="text-slate-400 text-sm">
                                                    {seat.winner?.votes?.toLocaleString('bn-BD')} ভোট
                                                </p>
                                            </div>
                                            {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        className="border-t border-white/10 p-4"
                                    >
                                        <div className="space-y-3">
                                            {seat.candidates.map((candidate, cIndex) => {
                                                const colors = partyColors[candidate.partyType] || partyColors.other;
                                                const percentage = seat.totalVotes > 0 ? (candidate.votes / seat.totalVotes * 100).toFixed(1) : 0;
                                                const isWinner = cIndex === 0;

                                                return (
                                                    <div key={candidate.id} className={`p-3 rounded-xl ${isWinner ? colors.bg + ' border ' + colors.border : 'bg-slate-800/50'}`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                {isWinner && <Trophy className="w-4 h-4 text-yellow-400" />}
                                                                <span className="text-lg">{candidate.symbolEmoji}</span>
                                                                <span className={`text-sm font-medium ${isWinner ? colors.text : 'text-slate-300'}`}>
                                                                    {candidate.name}
                                                                </span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`font-bold ${isWinner ? 'text-white' : 'text-slate-300'}`}>
                                                                    {candidate.votes.toLocaleString('bn-BD')}
                                                                </span>
                                                                <span className="text-slate-500 text-sm ml-2">({percentage}%)</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient}`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-slate-500 text-xs mt-1">{candidate.party}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm text-slate-400">
                                            <span>মোট ভোট: {seat.totalVotes.toLocaleString('bn-BD')}</span>
                                            <span>জয়ের ব্যবধান: {seat.margin.toLocaleString('bn-BD')}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
