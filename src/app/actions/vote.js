'use server';

import { headers } from 'next/headers';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Submit a vote with IP-based and Fingerprint-based locking.
 * This runs securely on the server.
 */
export async function submitVoteServerAction(seatId, candidateId, fingerprint, candidateName, partyName) {
    if (!adminDb) {
        return { success: false, message: 'Server database connection failed' };
    }

    try {
        // 1. Get Client IP
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        // Handle multiple IPs in x-forwarded-for (e.g. "client, proxy1, proxy2")
        const clientIp = ip.split(',')[0].trim();

        // 2. References
        const ipRef = adminDb.collection('ipVotes').doc(clientIp);
        const voteRef = adminDb.collection('votes').doc(fingerprint);

        const candidateVoteRef = adminDb.collection('voteCounts').doc(seatId).collection('candidates').doc(candidateId);
        const seatVoteRef = adminDb.collection('voteCounts').doc(seatId);

        // 3. Run Transaction
        const result = await adminDb.runTransaction(async (t) => {
            // CHECKS (Reads)
            const ipDoc = await t.get(ipRef);
            const voteDoc = await t.get(voteRef);

            if (ipDoc.exists) {
                // If IP used, check if it was for the SAME person/fingerprint (allow retry/update if same user)
                // Actually, for strict security, if IP is used by ANYONE, we block.
                // But if I am the SAME user (fingerprint) who voted from this IP, that's just a duplicate check.
                // Let's implement strict: One Vote Per IP.

                // Exception: If the IP document says it was THIS fingerprint, then it's just a "You already voted" message, not an "IP Theft" message.
                const ipData = ipDoc.data();
                if (ipData.fingerprint === fingerprint) {
                    throw new Error('ALREADY_VOTED_USER');
                } else {
                    throw new Error('ALREADY_VOTED_IP');
                }
            }

            if (voteDoc.exists) {
                throw new Error('ALREADY_VOTED_USER');
            }

            // WRITES
            const timestamp = FieldValue.serverTimestamp();

            // A. Record Vote (Fingerprint)
            t.set(voteRef, {
                seatId,
                candidateId,
                candidateName,
                partyName,
                fingerprint,
                ip: clientIp,
                timestamp,
                userAgent: headersList.get('user-agent') || 'unknown',
            });

            // B. Record IP Usage
            t.set(ipRef, {
                timestamp,
                seatId,
                fingerprint
            });

            // C. Increment Candidate Count
            // We need to check if the candidate doc exists to decide set vs update, 
            // but for counters with admin SDK we can use set with merge or just increment directly if we know structure.
            // Safer to just use set with merge: true or update.
            // Let's just use set with merge for simplicity in transaction
            t.set(candidateVoteRef, {
                candidateId,
                candidateName,
                partyName,
                seatId,
                count: FieldValue.increment(1),
                createdAt: timestamp // won't overwrite if merge is smart, but here we just want to ensure doc exists.
                // Actually, strictly speaking, we should just increment. 
            }, { merge: true });

            // D. Increment Seat Total
            t.set(seatVoteRef, {
                seatId,
                totalVotes: FieldValue.increment(1),
                createdAt: timestamp
            }, { merge: true });

            return { success: true };
        });

        return {
            success: true,
            message: 'আপনার ভোট সফলভাবে গৃহীত হয়েছে!'
        };

    } catch (error) {
        console.error('Vote submission error:', error);

        if (error.message === 'ALREADY_VOTED_USER') {
            return {
                success: false,
                message: 'আপনি ইতিমধ্যে ভোট দিয়েছেন।',
                alreadyVoted: true
            };
        }

        if (error.message === 'ALREADY_VOTED_IP') {
            return {
                success: false,
                message: 'এই ইন্টারনেট সংযোগ (IP) ব্যবহার করে ইতিমধ্যে ভোট দেওয়া হয়েছে।',
                alreadyVoted: true
            };
        }

        return {
            success: false,
            message: 'ভোট দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
        };
    }
}
