import { adminDb } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    // Check session
    const session = cookies().get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { name, party, symbol, seatId, photoUrl, createdAt } = body;

        if (!name || !seatId || !photoUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const docRef = await adminDb.collection('candidates').add({
            name, party, symbol, seatId, photoUrl, voteCount: 0, createdAt
        });

        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
