'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Vote, ArrowLeft } from 'lucide-react';
import { districts, getSeatsForDistrict } from '@/lib/electionData';

export default function SeatsPage() {
    const router = useRouter();
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [districtOpen, setDistrictOpen] = useState(false);
    const [seatOpen, setSeatOpen] = useState(false);

    const seats = selectedDistrict ? getSeatsForDistrict(selectedDistrict.id) : [];

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district);
        setSelectedSeat(null);
        setDistrictOpen(false);
    };

    const handleSeatSelect = (seat) => {
        setSelectedSeat(seat);
        setSeatOpen(false);
    };

    const handleVote = () => {
        if (selectedSeat && selectedDistrict) {
            router.push(`/seat/${selectedDistrict.id}-${selectedSeat.number}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
                        <ArrowLeft size={18} className="mr-2" />
                        হোম পেজ
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">আপনার আসন নির্বাচন করুন</h1>
                    <p className="text-slate-400">জেলা ও আসন সিলেক্ট করুন</p>
                </div>

                {/* Selection Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                >
                    {/* District Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">জেলা</label>
                        <div className="relative">
                            <button
                                onClick={() => { setDistrictOpen(!districtOpen); setSeatOpen(false); }}
                                className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-left hover:border-green-500 transition-colors"
                            >
                                <span className={selectedDistrict ? 'text-white' : 'text-slate-500'}>
                                    {selectedDistrict ? selectedDistrict.name : 'জেলা নির্বাচন করুন'}
                                </span>
                                <ChevronDown className={`text-slate-400 transition-transform ${districtOpen ? 'rotate-180' : ''}`} size={20} />
                            </button>

                            {districtOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-20 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                                >
                                    {districts.map((district) => (
                                        <button
                                            key={district.id}
                                            onClick={() => handleDistrictSelect(district)}
                                            className={`w-full px-4 py-3 text-left hover:bg-green-600/20 transition-colors flex items-center justify-between ${selectedDistrict?.id === district.id ? 'bg-green-600/30 text-green-400' : 'text-white'
                                                }`}
                                        >
                                            <span>{district.name}</span>
                                            <span className="text-xs text-slate-500">{district.seats} আসন</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Seat Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">আসন</label>
                        <div className="relative">
                            <button
                                onClick={() => { if (selectedDistrict) { setSeatOpen(!seatOpen); setDistrictOpen(false); } }}
                                disabled={!selectedDistrict}
                                className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 text-left transition-colors ${selectedDistrict
                                        ? 'bg-slate-800 border-slate-700 hover:border-green-500'
                                        : 'bg-slate-900 border-slate-800 cursor-not-allowed'
                                    }`}
                            >
                                <span className={selectedSeat ? 'text-white' : 'text-slate-500'}>
                                    {selectedSeat ? selectedSeat.name : (selectedDistrict ? 'আসন নির্বাচন করুন' : 'প্রথমে জেলা নির্বাচন করুন')}
                                </span>
                                <ChevronDown className={`text-slate-400 transition-transform ${seatOpen ? 'rotate-180' : ''}`} size={20} />
                            </button>

                            {seatOpen && selectedDistrict && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-20 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                                >
                                    {seats.map((seat) => (
                                        <button
                                            key={seat.id}
                                            onClick={() => handleSeatSelect(seat)}
                                            className={`w-full px-4 py-3 text-left hover:bg-green-600/20 transition-colors ${selectedSeat?.id === seat.id ? 'bg-green-600/30 text-green-400' : 'text-white'
                                                }`}
                                        >
                                            {seat.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Vote Button */}
                    <button
                        onClick={handleVote}
                        disabled={!selectedSeat}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${selectedSeat
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:-translate-y-1'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Vote size={24} />
                        নির্বাচন করুন
                    </button>
                </motion.div>

                {/* Selected Info Card */}
                {selectedDistrict && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 bg-green-900/20 border border-green-500/30 rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">নির্বাচিত জেলা:</span>
                            <span className="text-green-400 font-medium">{selectedDistrict.name}</span>
                        </div>
                        {selectedSeat && (
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-slate-400">নির্বাচিত আসন:</span>
                                <span className="text-green-400 font-medium">{selectedSeat.name}</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-white">৬৪</p>
                        <p className="text-sm text-slate-400">জেলা</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-white">৩০০</p>
                        <p className="text-sm text-slate-400">আসন</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
