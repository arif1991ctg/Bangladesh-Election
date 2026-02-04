import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const EC_BASE_URL = 'http://103.183.38.66';

// Symbol emoji mapping
const symbolEmojiMap = {
    'দাঁড়িপাল্লা': '⚖️',
    'ধানের শীষ': '🌾',
    'তারা': '⭐',
    'আপেল': '🍎',
    'হাতপাখা': '🪭',
    'হাত (পাঞ্জা)': '✋',
    'লাঙ্গল': '🌿',
    'কলম': '🖊️',
    'কেটলি': '☕',
    'মাথাল': '🎓',
    'চেয়ার': '🪑',
    'কাঁচি': '✂️',
    'একতারা': '🎸',
    'ট্রাক': '🚚',
    'ফুটবল': '⚽',
    'হরিণ': '🦌',
};

const getPartyType = (partyName) => {
    if (!partyName) return 'other';
    const lower = partyName.toLowerCase();
    if (lower.includes('জামায়াত')) return 'jamat';
    if (lower.includes('বি.এন.পি') || lower.includes('জাতীয়তাবাদী')) return 'bnp';
    if (lower.includes('স্বতন্ত্র')) return 'independent';
    return 'other';
};

const getSymbolEmoji = (symbol) => symbolEmojiMap[symbol] || '🔵';

// Constituency IDs for Chittagong
const constituencyMap = {
    'chittagong-1': 278,
    'chittagong-2': 279,
    'chittagong-3': 280,
    'chittagong-4': 281,
    'chittagong-5': 282,
    'chittagong-6': 283,
    'chittagong-7': 284,
    'chittagong-8': 285,
    'chittagong-9': 286,
    'chittagong-10': 287,
    'chittagong-11': 288,
    'chittagong-12': 289,
    'chittagong-13': 290,
    'chittagong-14': 291,
    'chittagong-15': 292,
    'chittagong-16': 293,
};

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const seatId = searchParams.get('seat'); // e.g., "chittagong-9"
    const electionId = searchParams.get('election') || '478'; // Default to 13th Parliament

    if (!seatId) {
        return NextResponse.json({
            error: 'Missing seat parameter. Example: ?seat=chittagong-9'
        }, { status: 400 });
    }

    const constituencyId = constituencyMap[seatId];

    if (!constituencyId) {
        return NextResponse.json({
            error: 'Invalid seat ID',
            availableSeats: Object.keys(constituencyMap)
        }, { status: 400 });
    }

    try {
        // Fetch data from EC website
        const formData = new URLSearchParams();
        formData.append('election_type_id', '1');
        formData.append('election_id', electionId);
        formData.append('candidate_type_id', '1');
        formData.append('zilla_id', '8'); // Chittagong
        formData.append('constituency_id', constituencyId.toString());
        formData.append('status', '11'); // Final candidates

        const response = await fetch(`${EC_BASE_URL}/get-candidate-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            throw new Error(`EC responded with ${response.status}`);
        }

        const html = await response.text();

        // Parse HTML
        const $ = cheerio.load(html);
        const candidates = [];

        $('tbody tr').each((index, row) => {
            const cells = $(row).find('td');

            if (cells.length >= 5) {
                const name = $(cells[1]).text().trim();
                const party = $(cells[3]).text().trim();
                const symbol = $(cells[4]).text().trim();

                if (name && name.length > 1) {
                    candidates.push({
                        id: `${seatId.replace('-', '')}-${index + 1}`,
                        name,
                        party,
                        symbol,
                        symbolEmoji: getSymbolEmoji(symbol),
                        partyType: getPartyType(party),
                    });
                }
            }
        });

        return NextResponse.json({
            success: true,
            seatId,
            constituencyId,
            electionId,
            candidateCount: candidates.length,
            candidates,
            fetchedAt: new Date().toISOString(),
        });

    } catch (error) {
        console.error('EC fetch error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            hint: 'EC website might be down or blocking requests',
        }, { status: 500 });
    }
}
