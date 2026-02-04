import crypto from 'crypto';

/**
 * Hashes an IP address using SHA-256 to ensure privacy while maintaining uniqueness.
 * @param {string} ip - The IP address to hash.
 * @returns {string} - The hashed IP.
 */
export function hashIp(ip) {
    if (!ip) return 'unknown';
    return crypto.createHash('sha256').update(ip + process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).digest('hex');
}

/**
 * Validates the vote payload.
 * @param {object} payload
 * @returns {string|null} - Error message or null if valid.
 */
export function validateVotePayload(payload) {
    const { seatId, candidateId, fingerprint } = payload;

    if (!seatId || typeof seatId !== 'string') return 'Invalid Seat ID';
    if (!candidateId || typeof candidateId !== 'string') return 'Invalid Candidate ID';
    if (!fingerprint || typeof fingerprint !== 'string') return 'Missing Device Fingerprint';

    return null;
}
