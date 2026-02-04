'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, Check, Copy, RefreshCw } from 'lucide-react';

const availableSeats = [
    'chittagong-1', 'chittagong-2', 'chittagong-3', 'chittagong-4',
    'chittagong-5', 'chittagong-6', 'chittagong-7', 'chittagong-8',
    'chittagong-9', 'chittagong-10', 'chittagong-11', 'chittagong-12',
    'chittagong-13', 'chittagong-14', 'chittagong-15', 'chittagong-16',
];

export default function AdminScrapePage() {
    const [selectedSeat, setSelectedSeat] = useState('chittagong-1');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const fetchCandidates = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`/api/candidates?seat=${selectedSeat}`);
            const data = await response.json();

            if (data.success) {
                setResult(data);
            } else {
                setError(data.error || 'Failed to fetch');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = () => {
        if (!result?.candidates) return '';

        const seatId = selectedSeat.replace('chittagong-', 'ctg');

        return `// Real candidates for ${selectedSeat} from EC website
export const ${seatId.replace('-', '')}Candidates = [
${result.candidates.map((c, i) => `    {
        id: '${seatId}-${i + 1}',
        name: '${c.name}',
        party: '${c.party}',
        symbol: '${c.symbol}',
        symbolEmoji: '${c.symbolEmoji}',
        partyType: '${c.partyType}'
    }`).join(',\n')}
];`;
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        🔧 EC Data Scraper
                    </h1>
                    <p className="text-slate-400">
                        নির্বাচন কমিশন ওয়েবসাইট থেকে প্রার্থী তথ্য আনুন
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-slate-400 mb-2">আসন নির্বাচন করুন</label>
                            <select
                                value={selectedSeat}
                                onChange={(e) => setSelectedSeat(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                            >
                                {availableSeats.map(seat => (
                                    <option key={seat} value={seat}>
                                        {seat.replace('chittagong-', 'চট্রগ্রাম-')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={fetchCandidates}
                                disabled={loading}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        লোড হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        <Download size={20} />
                                        ডাটা আনুন
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                        <p className="text-red-400">❌ {error}</p>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Summary */}
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                            <p className="text-green-400">
                                ✅ {result.candidateCount} জন প্রার্থী পাওয়া গেছে ({result.seatId})
                            </p>
                        </div>

                        {/* Candidates Table */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/10">
                                <h2 className="text-lg font-bold text-white">প্রার্থী তালিকা</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm text-slate-400">#</th>
                                            <th className="px-4 py-3 text-left text-sm text-slate-400">নাম</th>
                                            <th className="px-4 py-3 text-left text-sm text-slate-400">দল</th>
                                            <th className="px-4 py-3 text-left text-sm text-slate-400">প্রতীক</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.candidates.map((candidate, i) => (
                                            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                                                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                                                <td className="px-4 py-3 text-white font-medium">{candidate.name}</td>
                                                <td className="px-4 py-3 text-slate-300">{candidate.party}</td>
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-xl">{candidate.symbolEmoji}</span>
                                                        <span className="text-slate-400">{candidate.symbol}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Code Output */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white">Generated Code</h2>
                                <button
                                    onClick={copyCode}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'কপি হয়েছে!' : 'কোড কপি করুন'}
                                </button>
                            </div>
                            <pre className="p-4 text-sm text-green-400 overflow-x-auto bg-slate-900/50">
                                {generateCode()}
                            </pre>
                        </div>

                        <p className="text-center text-slate-500 text-sm">
                            এই কোডটি <code className="bg-slate-800 px-2 py-1 rounded">electionData.js</code> ফাইলে পেস্ট করুন
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
