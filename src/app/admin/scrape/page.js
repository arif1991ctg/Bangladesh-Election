'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, Check, Copy, FileText } from 'lucide-react';

// Symbol emoji mapping
const symbolEmojiMap = {
    'দাঁড়িপাল্লা': '⚖️',
    'ধানের শীষ': '🌾',
    'তারা': '⭐',
    'আপেল': '🍎',
    'হাতপাখা': '🪭',
    'হাত (পাঞ্জা)': '✋',
    'হাত': '✋',
    'লাঙ্গল': '🌿',
    'কলম': '🖊️',
    'কেটলি': '☕',
    'মাথাল': '🎓',
    'চেয়ার': '🪑',
    'কাঁচি': '✂️',
    'একতারা': '🎸',
    'ট্রাক': '🚚',
    'ফুটবল': '⚽',
    'হরিণ': '🦌',
    'নৌকা': '⛵',
    'গোলাপ': '🌹',
    'ঘড়ি': '⏰',
    'ছাতা': '☂️',
    'বই': '📚',
};

const getPartyType = (partyName) => {
    if (!partyName) return 'other';
    const lower = partyName.toLowerCase();
    if (lower.includes('জামায়াত')) return 'jamat';
    if (lower.includes('বি.এন.পি') || lower.includes('জাতীয়তাবাদী')) return 'bnp';
    if (lower.includes('স্বতন্ত্র')) return 'independent';
    return 'other';
};

const getSymbolEmoji = (symbol) => {
    for (const [key, emoji] of Object.entries(symbolEmojiMap)) {
        if (symbol?.includes(key)) return emoji;
    }
    return '🔵';
};

export default function AdminScrapePage() {
    const [seatId, setSeatId] = useState('ctg3');
    const [htmlInput, setHtmlInput] = useState('');
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const parseHtml = () => {
        if (!htmlInput.trim()) {
            alert('HTML পেস্ট করুন!');
            return;
        }

        // Parse HTML using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlInput, 'text/html');
        const rows = doc.querySelectorAll('tbody tr');

        const candidates = [];

        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const name = cells[1]?.textContent?.trim() || cells[0]?.textContent?.trim();
                const party = cells[3]?.textContent?.trim();
                const symbol = cells[4]?.textContent?.trim();

                if (name && name.length > 1) {
                    candidates.push({
                        id: `${seatId}-${index + 1}`,
                        name,
                        party,
                        symbol,
                        symbolEmoji: getSymbolEmoji(symbol),
                        partyType: getPartyType(party),
                    });
                }
            }
        });

        if (candidates.length === 0) {
            alert('কোনো প্রার্থী পাওয়া যায়নি। সঠিক HTML paste করেছেন কিনা দেখুন।');
            return;
        }

        setResult({
            seatId,
            candidateCount: candidates.length,
            candidates,
        });
    };

    const generateCode = () => {
        if (!result?.candidates) return '';

        return `// Real candidates for ${seatId} from EC website
export const ${seatId}Candidates = [
${result.candidates.map((c) => `    {
        id: '${c.id}',
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
                        🔧 EC Data Parser
                    </h1>
                    <p className="text-slate-400">
                        EC ওয়েবসাইট থেকে HTML কপি করে এখানে paste করুন
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <h3 className="text-blue-300 font-bold mb-2">📋 কিভাবে করবেন:</h3>
                    <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                        <li>EC সাইটে যান: <a href="http://103.183.38.66" target="_blank" className="underline">http://103.183.38.66</a></li>
                        <li>ত্রয়োদশ জাতীয় সংসদ নির্বাচন সিলেক্ট করুন</li>
                        <li>জেলা ও আসন সিলেক্ট করে "অনুসন্ধান" ক্লিক করুন</li>
                        <li>টেবিলের উপর Right Click → "Inspect" বা F12</li>
                        <li>&lt;tbody&gt; ট্যাগ খুঁজে তার উপর Right Click → Copy → Copy outerHTML</li>
                        <li>এখানে paste করুন</li>
                    </ol>
                </div>

                {/* Input Form */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
                    <div className="mb-4">
                        <label className="block text-sm text-slate-400 mb-2">Seat ID (যেমন: ctg3, ctg4)</label>
                        <input
                            type="text"
                            value={seatId}
                            onChange={(e) => setSeatId(e.target.value)}
                            placeholder="ctg3"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-slate-400 mb-2">
                            <FileText className="inline mr-1" size={16} />
                            EC থেকে কপি করা HTML (tbody)
                        </label>
                        <textarea
                            value={htmlInput}
                            onChange={(e) => setHtmlInput(e.target.value)}
                            placeholder="<tbody>...</tbody> এখানে paste করুন"
                            rows={8}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm"
                        />
                    </div>

                    <button
                        onClick={parseHtml}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        <Download size={20} />
                        Parse করুন
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                            <p className="text-green-400">
                                ✅ {result.candidateCount} জন প্রার্থী পাওয়া গেছে!
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
                            এই কোডটি <code className="bg-slate-800 px-2 py-1 rounded">electionData.js</code> ফাইলে paste করুন
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
