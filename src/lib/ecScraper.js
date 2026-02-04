import * as cheerio from 'cheerio';

/**
 * Fetch and parse candidate data from EC website
 * EC Portal: http://103.183.38.66
 */

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
    'নৌকা': '⛵',
    'গোলাপ': '🌹',
    'ঘড়ি': '⏰',
    'ছাতা': '☂️',
    'বই': '📚',
    'সিংহ': '🦁',
    'ঘোড়া': '🐴',
    'হাতি': '🐘',
    'সাইকেল': '🚲',
    'মোটরসাইকেল': '🏍️',
    'গাড়ি': '🚗',
    'বিমান': '✈️',
    'জাহাজ': '🚢',
    'টেলিভিশন': '📺',
    'রেডিও': '📻',
    'টেলিফোন': '☎️',
    'মোবাইল': '📱',
    'কম্পিউটার': '💻',
    'ক্যামেরা': '📷',
    'তালাচাবি': '🔑',
    'তালা': '🔒',
    'হাতুড়ি': '🔨',
    'পেরেক': '📌',
};

// Party type detection
const getPartyType = (partyName) => {
    const lowerParty = partyName.toLowerCase();
    if (lowerParty.includes('জামায়াত') || lowerParty.includes('jamat')) {
        return 'jamat';
    }
    if (lowerParty.includes('বি.এন.পি') || lowerParty.includes('bnp') || lowerParty.includes('জাতীয়তাবাদী')) {
        return 'bnp';
    }
    if (lowerParty.includes('স্বতন্ত্র') || lowerParty.includes('independent')) {
        return 'independent';
    }
    return 'other';
};

// Get emoji for symbol
const getSymbolEmoji = (symbol) => {
    return symbolEmojiMap[symbol] || '🔵';
};

/**
 * Parse HTML to extract candidate data
 * @param {string} html - HTML content from EC website
 * @param {string} seatId - Seat identifier (e.g., 'ctg1', 'ctg2')
 * @returns {Array} - Array of candidate objects
 */
export function parseECHtml(html, seatId) {
    const $ = cheerio.load(html);
    const candidates = [];

    $('tbody tr').each((index, row) => {
        const cells = $(row).find('td');

        if (cells.length >= 5) {
            const name = $(cells[0]).text().trim() || $(cells[1]).text().trim();
            const party = $(cells[2]).text().trim() || $(cells[3]).text().trim();
            const symbol = $(cells[3]).text().trim() || $(cells[4]).text().trim();

            // Skip if no valid data
            if (!name || name.length < 2) return;

            candidates.push({
                id: `${seatId}-${index + 1}`,
                name: name,
                party: party,
                symbol: symbol,
                symbolEmoji: getSymbolEmoji(symbol),
                partyType: getPartyType(party),
            });
        }
    });

    return candidates;
}

/**
 * Fetch candidate data from EC website for a specific constituency
 * @param {number} electionId - Election ID (478 for 13th Parliament)
 * @param {number} constituencyId - Constituency ID
 * @returns {Promise<Array>} - Array of candidates
 */
export async function fetchCandidatesFromEC(electionId, constituencyId) {
    try {
        // This would need to be done server-side or through a proxy due to CORS
        const url = `${EC_BASE_URL}/candidate-information`;

        // Note: Direct fetch won't work from browser due to CORS
        // You need to use API route or server-side fetching
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `election_id=${electionId}&constituency_id=${constituencyId}&status=11`,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from EC');
        }

        const html = await response.text();
        return parseECHtml(html, `seat-${constituencyId}`);

    } catch (error) {
        console.error('Error fetching from EC:', error);
        return [];
    }
}

// Constituency ID mapping for Chittagong (চট্টগ্রাম)
export const chittagongConstituencyIds = {
    1: 278,  // চট্রগ্রাম-১
    2: 279,  // চট্রগ্রাম-২
    3: 280,  // চট্রগ্রাম-৩
    4: 281,  // চট্রগ্রাম-৪
    5: 282,  // চট্রগ্রাম-৫
    6: 283,  // চট্রগ্রাম-৬
    7: 284,  // চট্রগ্রাম-৭
    8: 285,  // চট্রগ্রাম-৮
    9: 286,  // চট্রগ্রাম-৯
    10: 287, // চট্রগ্রাম-১০
    11: 288, // চট্রগ্রাম-১১
    12: 289, // চট্রগ্রাম-১২
    13: 290, // চট্রগ্রাম-১৩
    14: 291, // চট্রগ্রাম-১৪
    15: 292, // চট্রগ্রাম-১৫
    16: 293, // চট্রগ্রাম-১৬
};

// Election IDs
export const electionIds = {
    thirteenth: 478, // ত্রয়োদশ জাতীয় সংসদ নির্বাচন
    twelfth: 14,     // দ্বাদশ জাতীয় সংসদ নির্বাচন
    eleventh: 11,    // একাদশ জাতীয় সংসদ নির্বাচন
};
