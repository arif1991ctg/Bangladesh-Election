import CandidateForm from '@/components/admin/CandidateForm';
import { adminDb } from '@/lib/firebaseAdmin';

async function getSeats() {
    if (!adminDb) return [];
    // Need to select seat when creating candidate
    const snapshot = await adminDb.collection('seats').orderBy('number').get();
    return snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, number: doc.data().number }));
}

export default async function NewCandidatePage() {
    const seats = await getSeats();

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Add New Candidate</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <CandidateForm seats={seats} />
            </div>
        </div>
    );
}
