import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    increment,
    runTransaction,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== VOTE SUBMISSION ====================

/**
 * Submit a vote with duplicate prevention
 * @param {string} seatId - e.g., "chittagong-9"
 * @param {string} candidateId - e.g., "ctg9-7"
 * @param {string} fingerprint - Device fingerprint
 * @param {string} candidateName - For record keeping
 * @param {string} partyName - For record keeping
 * @returns {Object} - { success: boolean, message: string }
 */
export async function submitVote(seatId, candidateId, fingerprint, candidateName, partyName) {
    try {
        // Check if fingerprint already voted
        const voteRef = doc(db, 'votes', fingerprint);
        const existingVote = await getDoc(voteRef);

        if (existingVote.exists()) {
            return {
                success: false,
                message: 'আপনি ইতিমধ্যে ভোট দিয়েছেন।',
                alreadyVoted: true,
                existingVote: existingVote.data()
            };
        }

        // Use transaction to ensure atomic operations
        await runTransaction(db, async (transaction) => {
            // READS FIRST
            const candidateVoteRef = doc(db, 'voteCounts', seatId, 'candidates', candidateId);
            const candidateDoc = await transaction.get(candidateVoteRef);

            const seatVoteRef = doc(db, 'voteCounts', seatId);
            const seatDoc = await transaction.get(seatVoteRef);

            // WRITES SECOND
            // 1. Save the vote record
            const voteData = {
                seatId,
                candidateId,
                candidateName,
                partyName,
                fingerprint,
                timestamp: serverTimestamp(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            };
            transaction.set(voteRef, voteData);

            // 2. Increment candidate vote count
            if (candidateDoc.exists()) {
                transaction.update(candidateVoteRef, { count: increment(1) });
            } else {
                transaction.set(candidateVoteRef, {
                    candidateId,
                    candidateName,
                    partyName,
                    seatId,
                    count: 1,
                    createdAt: serverTimestamp()
                });
            }

            // 3. Increment seat total vote count
            if (seatDoc.exists()) {
                transaction.update(seatVoteRef, { totalVotes: increment(1) });
            } else {
                transaction.set(seatVoteRef, {
                    seatId,
                    totalVotes: 1,
                    createdAt: serverTimestamp()
                });
            }
        });

        return {
            success: true,
            message: 'আপনার ভোট সফলভাবে গৃহীত হয়েছে!'
        };

    } catch (error) {
        console.error('Vote submission error:', error);
        return {
            success: false,
            message: 'ভোট দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
        };
    }
}

// ==================== CHECK VOTE STATUS ====================

/**
 * Check if a fingerprint has already voted
 */
export async function checkVoteStatus(fingerprint) {
    try {
        const voteRef = doc(db, 'votes', fingerprint);
        const voteDoc = await getDoc(voteRef);

        if (voteDoc.exists()) {
            return {
                hasVoted: true,
                voteData: voteDoc.data()
            };
        }

        return { hasVoted: false };
    } catch (error) {
        console.error('Check vote status error:', error);
        return { hasVoted: false, error: true };
    }
}

// ==================== GET VOTE COUNTS ====================

/**
 * Get vote counts for a specific seat
 */
export async function getSeatVoteCounts(seatId) {
    try {
        // Get all candidates for this seat
        const candidatesRef = collection(db, 'voteCounts', seatId, 'candidates');
        const snapshot = await getDocs(candidatesRef);

        const candidates = [];
        snapshot.forEach(doc => {
            candidates.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by vote count (descending)
        candidates.sort((a, b) => (b.count || 0) - (a.count || 0));

        // Get seat total
        const seatRef = doc(db, 'voteCounts', seatId);
        const seatDoc = await getDoc(seatRef);
        const totalVotes = seatDoc.exists() ? seatDoc.data().totalVotes || 0 : 0;

        // Determine winner
        const winner = candidates.length > 0 ? candidates[0] : null;

        return {
            seatId,
            totalVotes,
            candidates,
            winner,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Get seat vote counts error:', error);
        return { seatId, totalVotes: 0, candidates: [], winner: null, error: true };
    }
}

/**
 * Get vote counts for all seats (for admin dashboard)
 */
export async function getAllSeatResults() {
    try {
        const voteCountsRef = collection(db, 'voteCounts');
        const snapshot = await getDocs(voteCountsRef);

        const results = [];

        for (const seatDoc of snapshot.docs) {
            const seatId = seatDoc.id;
            const seatData = seatDoc.data();

            // Get candidates for this seat
            const seatResult = await getSeatVoteCounts(seatId);
            results.push(seatResult);
        }

        // Sort by total votes (descending)
        results.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));

        return results;
    } catch (error) {
        console.error('Get all results error:', error);
        return [];
    }
}

/**
 * Get overall election statistics
 */
export async function getElectionStats() {
    try {
        // Count total votes
        const votesRef = collection(db, 'votes');
        const votesSnapshot = await getDocs(votesRef);
        const totalVotes = votesSnapshot.size;

        // Get all seat results
        const seatResults = await getAllSeatResults();
        const seatsWithVotes = seatResults.length;

        // Count party wins and total votes per party
        const partyWins = {};
        const partyVotes = {};

        seatResults.forEach(seat => {
            // Count wins
            if (seat.winner) {
                const party = seat.winner.partyType || 'other';
                partyWins[party] = (partyWins[party] || 0) + 1;
            }

            // Count total votes per party
            if (seat.candidates) {
                seat.candidates.forEach(candidate => {
                    const party = candidate.partyType || 'other';
                    const votes = candidate.count || 0;
                    partyVotes[party] = (partyVotes[party] || 0) + votes;
                });
            }
        });

        // Sort parties by wins
        const sortedParties = Object.entries(partyWins)
            .sort((a, b) => b[1] - a[1])
            .map(([party, wins]) => ({ party, wins }));

        return {
            totalVotes,
            seatsWithVotes,
            totalSeats: 300,
            partyWins: sortedParties,
            partyVotes, // New field: { jamat: 100, bnp: 50, ... }
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Get election stats error:', error);
        return { totalVotes: 0, seatsWithVotes: 0, totalSeats: 300, partyWins: [], partyVotes: {} };
    }
}
