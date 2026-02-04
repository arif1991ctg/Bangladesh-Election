import { adminDb } from '@/lib/firebaseAdmin';
import DashboardCharts from '@/components/admin/DashboardCharts';
import { Users, UserCheck, Vote } from 'lucide-react';

async function getStats() {
    const configDoc = await adminDb.collection('config').doc('electionSettings').get();
    const seatsSnapshot = await adminDb.collection('seats').orderBy('totalVotes', 'desc').limit(10).get();
    const candidatesSnapshot = await adminDb.collection('candidates').orderBy('voteCount', 'desc').limit(10).get();

    const totalVotes = configDoc.exists ? configDoc.data().totalVotes || 0 : 0;

    const topSeats = seatsSnapshot.docs.map(doc => ({
        name: doc.data().name,
        votes: doc.data().totalVotes || 0
    }));

    const topCandidates = candidatesSnapshot.docs.map(doc => ({
        name: doc.data().name,
        party: doc.data().party,
        votes: doc.data().voteCount || 0
    }));

    return { totalVotes, topSeats, topCandidates };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500">Total Votes Cast</h3>
                        <Vote className="text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.totalVotes.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500">Active Constituencies</h3>
                        <Users className="text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">300</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-500">Top Candidate Votes</h3>
                        <UserCheck className="text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {stats.topCandidates[0]?.votes.toLocaleString() || 0}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <DashboardCharts topSeats={stats.topSeats} topCandidates={stats.topCandidates} />
        </div>
    );
}
