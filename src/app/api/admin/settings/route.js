import { adminDb } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Get current settings
export async function GET() {
    // Can be public or protected depending on needs, usually admin only for reading strict details, 
    // but public needs to know if active.
    // Here we check admin session just for consistency of the endpoint
    const session = cookies().get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const doc = await adminDb.collection('config').doc('electionSettings').get();
    return NextResponse.json(doc.exists ? doc.data() : { isActive: false });
}

// Update settings
export async function POST(request) {
    const session = cookies().get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { isActive } = await request.json();

    await adminDb.collection('config').doc('electionSettings').set({
        isActive
    }, { merge: true });

    return NextResponse.json({ success: true, isActive });
}
