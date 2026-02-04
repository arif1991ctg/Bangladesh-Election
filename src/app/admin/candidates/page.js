import { adminDb } from '@/lib/firebaseAdmin';
import Link from 'next/link';
import { Plus, Trash2, Edit } from 'lucide-react';

export const revalidate = 0; // Always fresh

async function getCandidates() {
    const snapshot = await adminDb.collection('candidates').orderBy('voteCount', 'desc').get();
    // We should also fetch seat names for display, but for now just show seatId
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function AdminCandidatesPage() {
    const candidates = await getCandidates();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Candidate Management ({candidates.length})</h1>
                <Link
                    href="/admin/candidates/new"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition shadow-sm"
                >
                    <Plus size={18} />
                    <span>Add Candidate</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Photo</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Party</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Seat</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Votes</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {candidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                            {candidate.photoUrl && <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{candidate.name}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center space-x-2">
                                            {/* Party logo could go here */}
                                            <span>{candidate.party}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">{candidate.seatId}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-800">{candidate.voteCount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                            <button className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {candidates.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">No candidates found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
