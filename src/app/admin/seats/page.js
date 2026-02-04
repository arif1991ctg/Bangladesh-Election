import { adminDb } from '@/lib/firebaseAdmin';
import { Search } from 'lucide-react';

async function getSeats() {
    const snapshot = await adminDb.collection('seats').orderBy('number').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function AdminSeatsPage() {
    const seats = await getSeats();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Constituency Management ({seats.length})</h1>
                {/* Search/Filter could go here */}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Ref ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Seat Number</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Total Votes</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {seats.map((seat) => (
                                <tr key={seat.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">{seat.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{seat.number}</td>
                                    <td className="px-6 py-4 text-slate-700">{seat.name}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-600">{seat.totalVotes}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
