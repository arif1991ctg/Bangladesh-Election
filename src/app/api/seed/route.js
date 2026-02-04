import { adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.SEED_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const batch = adminDb.batch();

        // 1. Initialize Config
        const configRef = adminDb.collection('config').doc('electionSettings');
        batch.set(configRef, { isActive: true, totalVotes: 0 }, { merge: true });

        // 2. Initialize 300 Seats
        // Note: Firestore batch limit is 500 operations. 300 + 1 is fine.
        for (let i = 1; i <= 300; i++) {
            const seatId = `seat-${i}`;
            const seatRef = adminDb.collection('seats').doc(seatId);
            batch.set(seatRef, {
                name: `Constituency ${i}`, // Default name, admin can update
                number: i,
                totalVotes: 0
            }, { merge: true });
        }

        // 3. Add Dummy Candidates for Seat 1
        // In a real app, these would be added via Admin Panel
        const candidates = [
            { id: 'cand-1', name: 'Sheikh Hasina', party: 'Awami League', symbol: 'Boat', seatId: 'seat-1', photoUrl: 'https://placehold.co/100?text=SH' },
            { id: 'cand-2', name: 'Khaleda Zia', party: 'BNP', symbol: 'Sheaf of Paddy', seatId: 'seat-1', photoUrl: 'https://placehold.co/100?text=KZ' },
            { id: 'cand-3', name: 'Dr. Yunus', party: 'Independent', symbol: 'Scale', seatId: 'seat-1', photoUrl: 'https://placehold.co/100?text=DY' }
        ];

        candidates.forEach(cand => {
            const candRef = adminDb.collection('candidates').doc(cand.id);
            batch.set(candRef, { ...cand, voteCount: 0 }, { merge: true });
        });

        await batch.commit();

        return NextResponse.json({ success: true, message: 'Seeding completed for 300 seats and config.' });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
