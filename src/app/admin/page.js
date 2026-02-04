'use client';

import Link from 'next/link';
import { Users, UserCheck, Vote, Settings, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">🛠️ Admin Dashboard</h1>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">Total Votes</h3>
                            <Vote className="text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">-</div>
                        <p className="text-xs text-slate-500 mt-2">Firebase Admin required</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">Active Seats</h3>
                            <Users className="text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">300</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">Districts</h3>
                            <UserCheck className="text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">64</div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                    <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/admin/scrape" className="flex items-center gap-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl p-4 transition-colors">
                            <Settings className="text-blue-400" />
                            <div>
                                <p className="text-white font-medium">EC Data Scraper</p>
                                <p className="text-slate-400 text-sm">Fetch candidates from EC</p>
                            </div>
                        </Link>
                        <Link href="/results" className="flex items-center gap-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl p-4 transition-colors">
                            <ExternalLink className="text-green-400" />
                            <div>
                                <p className="text-white font-medium">View Results</p>
                                <p className="text-slate-400 text-sm">Public results page</p>
                            </div>
                        </Link>
                        <Link href="/seats" className="flex items-center gap-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl p-4 transition-colors">
                            <Users className="text-purple-400" />
                            <div>
                                <p className="text-white font-medium">All Seats</p>
                                <p className="text-slate-400 text-sm">Browse constituencies</p>
                            </div>
                        </Link>
                        <Link href="/" className="flex items-center gap-3 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-xl p-4 transition-colors">
                            <Vote className="text-yellow-400" />
                            <div>
                                <p className="text-white font-medium">Homepage</p>
                                <p className="text-slate-400 text-sm">Public voting page</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <p className="text-center text-slate-600 text-sm mt-8">
                    Admin Panel - Bangladesh Election 2026
                </p>
            </div>
        </div>
    );
}
