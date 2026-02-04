import { adminDb } from '@/lib/firebaseAdmin';
import { hashIp, validateVotePayload } from '@/lib/security';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request) {
    try {
        const body = await request.json();

        // 1. Basic Validation
        const validationError = validateVotePayload(body);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        const { seatId, candidateId, fingerprint } = body;
        const headerList = headers();
        const ip = headerList.get('x-forwarded-for') || '127.0.0.1';
        const hashedIp = hashIp(ip);

        // 2. Transaction for Consistency
        const result = await adminDb.runTransaction(async (t) => {
            // A. Check Logic Refs
            const configRef = adminDb.collection('config').doc('electionSettings');
            const seatRef = adminDb.collection('seats').doc(seatId);
            const candidateRef = adminDb.collection('candidates').doc(candidateId);

            // Vote Uniqueness Checks
            // We use composite keys for efficient lookups: `fingerprint_seatId` and `ip_seatId`
            // Or just query. Queries in transactions are allowed but must be consistently indexed.
            // Better approach: Store vote records with deterministically generated IDs for uniqueness?
            // But one IP can vote for DIFFERENT seats? No, "One device = one vote" usually means globally or per seat. 
            // "Constituency selector" implies a user belongs to ONE constituency.
            // Assuming strict "One Person One Vote" globally for the election.

            const voteFingerprintRef = adminDb.collection('votes').doc(`${fingerprint}`);
            const voteIpRef = adminDb.collection('votes').doc(`ip_${hashedIp}`); // This might conflict if we want to allow 1 vote per IP strictly.

            // NOTE: Storing by IP as doc ID prevents multiple people on same WiFi from voting if strict.
            // User asked: "One IP = one vote". Strict.

            // B. Reads
            const configDoc = await t.get(configRef);
            const seatDoc = await t.get(seatRef);
            const candidateDoc = await t.get(candidateRef);
            const fingerprintDoc = await t.get(voteFingerprintRef);
            const ipDoc = await t.get(voteIpRef);

            // C. Logic Checks
            if (!configDoc.exists || !configDoc.data().isActive) {
                throw new Error("Election is not currently active.");
            }

            if (!seatDoc.exists) throw new Error("Invalid Seat ID.");
            if (!candidateDoc.exists) throw new Error("Invalid Candidate ID.");

            if (fingerprintDoc.exists) throw new Error("This device has already voted.");
            if (ipDoc.exists) throw new Error("This network (IP) has already cast a vote.");

            // D. Writes
            const timestamp = new Date().toISOString();
            const voteData = {
                seatId,
                candidateId,
                fingerprint,
                hashedIp,
                timestamp,
                userAgent: headerList.get('user-agent') || 'unknown'
            };

            // Create vote record (indexed by fingerprint for quick duplicate check)
            t.set(voteFingerprintRef, voteData);
            // Create IP record (shadow record for IP check)
            t.set(voteIpRef, { voted: true, timestamp });

            // Increment Counters
            t.update(seatRef, { totalVotes: adminDb.FieldValue.increment(1) });
            t.update(candidateRef, { voteCount: adminDb.FieldValue.increment(1) });
            t.update(configRef, { totalVotes: adminDb.FieldValue.increment(1) });

            return { success: true, candidateName: candidateDoc.data().name, seatName: seatDoc.data().name };
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error("Vote Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
