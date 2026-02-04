const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'candidates2026.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Bengali to English District Mapping
const districtMap = {
    'চট্টগ্রাম': 'chittagong',
    'ঢাকা': 'dhaka',
    'কুমিল্লা': 'comilla',
    'রাজশাহী': 'rajshahi',
    'খুলনা': 'khulna',
    'সিলেট': 'sylhet',
    'রংপুর': 'rangpur',
    'বরিশাল': 'barisal',
    'ময়মনসিংহ': 'mymensingh',
    'নারায়ণগঞ্জ': 'narayanganj',
    'গাজীপুর': 'gazipur',
    'টাঙ্গাইল': 'tangail',
    'বগুড়া': 'bogra',
    'যশোর': 'jessore',
    'দিনাজপুর': 'dinajpur',
    'ফরিদপুর': 'faridpur',
    'ব্রাহ্মণবাড়িয়া': 'brahmanbaria',
    'নোয়াখালী': 'noakhali',
    'পাবনা': 'pabna',
    'সিরাজগঞ্জ': 'sirajganj',
    'কিশোরগঞ্জ': 'kishoreganj',
    'জামালপুর': 'jamalpur',
    'নেত্রকোণা': 'netrokona',
    'হবিগঞ্জ': 'habiganj',
    'সুনামগঞ্জ': 'sunamganj',
    'মৌলভীবাজার': 'moulvibazar',
    'কক্সবাজার': 'coxsbazar',
    'ফেনী': 'feni',
    'লক্ষ্মীপুর': 'lakshmipur',
    'চাঁদপুর': 'chandpur',
    'নরসিংদী': 'narsingdi',
    'মানিকগঞ্জ': 'manikganj',
    'মুন্সীগঞ্জ': 'munshiganj',
    'শরীয়তপুর': 'shariatpur',
    'মাদারীপুর': 'madaripur',
    'গোপালগঞ্জ': 'gopalganj',
    'রাজবাড়ী': 'rajbari',
    'সাতক্ষীরা': 'satkhira',
    'বাগেরহাট': 'bagerhat',
    'নড়াইল': 'narail',
    'মাগুরা': 'magura',
    'ঝিনাইদহ': 'jhenaidah',
    'চুয়াডাঙ্গা': 'chuadanga',
    'মেহেরপুর': 'meherpur',
    'কুষ্টিয়া': 'kushtia',
    'নাটোর': 'natore',
    'নওগাঁ': 'naogaon',
    'চাঁপাইনবাবগঞ্জ': 'nawabganj',
    'জয়পুরহাট': 'joypurhat',
    'গাইবান্ধা': 'gaibandha',
    'কুড়িগ্রাম': 'kurigram',
    'লালমনিরহাট': 'lalmonirhat',
    'নীলফামারী': 'nilphamari',
    'ঠাকুরগাঁও': 'thakurgaon',
    'পঞ্চগড়': 'panchagarh',
    'বরগুনা': 'barguna',
    'পটুয়াখালী': 'patuakhali',
    'ভোলা': 'bhola',
    'পিরোজপুর': 'pirojpur',
    'ঝালকাঠি': 'jhalokati',
    'খাগড়াছড়ি': 'khagrachhari',
    'রাঙ্গামাটি': 'rangamati',
    'বান্দরবান': 'bandarban',
    'শেরপুর': 'sherpur'
};

const partyTypeMap = {
    'বাংলাদেশ আওয়ামী লীগ': 'al',
    'বাংলাদেশ জাতীয়তাবাদী দল - বি.এন.পি': 'bnp',
    'বাংলাদেশ জামায়াতে ইসলামী': 'jamat',
    'জাতীয় পার্টি': 'jp',
    'ইসলামী আন্দোলন বাংলাদেশ': 'iab',
    'স্বতন্ত্র': 'independent'
};

const symbolEmojiMap = {
    'নৌকা': '🛶',
    'ধানের শীষ': '🌾',
    'দাঁড়িপাল্লা': '⚖️',
    'লাঙ্গল': '🌿',
    'হাতপাখা': '🪭',
    'মোমবাতি': '🕯️',
    'চেয়ার': '🪑',
    'দেওয়াল ঘড়ি': '🕰️',
    'ট্রাক': '🚚',
    'কেটলি': '☕',
    'ঈগল': '🦅',
    'কাঁচি': '✂️',
    'বই': '📚',
    'টেলিভিশন': '📺',
    'হাতুড়ি': '🔨',
    'কুঁড়ে ঘর': '🏠',
    'গোলাপ ফুল': '🌹',
    'মশাল': '🔥',
    'সাইকেল': '🚲',
    'হুক্কা': 'hookah',
    'ডাব': '🥥',
    'ফুটবল': '⚽',
    'আপেল': '🍎',
    'বটগাছ': '🌳',
    'হারিকেন': '🏮',
    'সোফা': '🛋️',
    'রকেট': '🚀'
};

const allCandidates = {};
let processedCount = 0;

data.forEach((row, index) => {
    const seatNameRaw = row['আসন']; // e.g., "চট্টগ্রাম-7"
    if (!seatNameRaw) return;

    // Parse Seat ID
    const parts = seatNameRaw.split('-');
    if (parts.length < 2) return;

    // Clean up district name (remove extra spaces)
    const districtBengali = parts[0].trim();
    const seatNumber = parts.pop().trim(); // Ensure only the last part is the number

    const districtId = districtMap[districtBengali];

    if (!districtId) {
        console.warn(`Warning: unmapped district '${districtBengali}' found in row ${index}`);
        return;
    }

    const seatId = `${districtId}-${seatNumber}`;
    const candidateId = `${districtId}${seatNumber}-${index}`;

    if (!allCandidates[seatId]) {
        allCandidates[seatId] = [];
    }

    const partyName = row['রাজনৈতিক দল/স্বতন্ত্র']?.trim() || 'Unknown';
    const symbol = row['মনোনীত প্রতীক']?.trim() || '';

    // Determine party type code for styling
    let partyType = 'other';
    for (const [name, type] of Object.entries(partyTypeMap)) {
        if (partyName.includes(name)) { // Simple includes check might need refinement
            partyType = type;
            break;
        }
    }

    allCandidates[seatId].push({
        id: candidateId,
        name: row['দাখিলকারীর নাম']?.trim(),
        party: partyName,
        symbol: symbol,
        symbolEmoji: symbolEmojiMap[symbol] || '🗳️',
        partyType: partyType
    });

    processedCount++;
});

console.log(`Processed ${processedCount} candidates across ${Object.keys(allCandidates).length} seats.`);

// Read the existing file to keep the districts array
const existingContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/electionData.js'), 'utf8');
const districtArrayMatch = existingContent.match(/export const districts = \[\s*([\s\S]*?)\];/);
const districtArrayContent = districtArrayMatch ? districtArrayMatch[0] : 'export const districts = []; // Error parsing districts';

// Generate new file content
const newContent = `// Real candidate data from Excel (candidates2026.xlsx)
// Generated automatically on ${new Date().toISOString()}

${districtArrayContent}

// Party color mappings
export const partyColors = {
    jamat: {
        bg: 'bg-green-600/20',
        border: 'border-green-500',
        text: 'text-green-400',
        gradient: 'from-green-500 to-emerald-600'
    },
    bnp: {
        bg: 'bg-yellow-600/20',
        border: 'border-yellow-500',
        text: 'text-yellow-400',
        gradient: 'from-yellow-500 to-amber-600'
    },
    al: {
        bg: 'bg-red-600/20',
        border: 'border-red-500',
        text: 'text-red-400',
        gradient: 'from-red-500 to-rose-600'
    },
    independent: {
        bg: 'bg-purple-600/20',
        border: 'border-purple-500',
        text: 'text-purple-400',
        gradient: 'from-purple-500 to-pink-600'
    },
    other: {
        bg: 'bg-blue-600/20',
        border: 'border-blue-500',
        text: 'text-blue-400',
        gradient: 'from-blue-500 to-indigo-600'
    },
};

// All candidates mapped by seatId
const allCandidates = ${JSON.stringify(allCandidates, null, 4)};

// Get candidates for a specific seat
export const getCandidatesForSeat = (districtId, seatNumber) => {
    const seatId = \`\${districtId}-\${seatNumber}\`;
    return allCandidates[seatId] || [];
};

// Generate seat list for a district
export const getSeatsForDistrict = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    if (!district) return [];

    return Array.from({ length: district.seats }, (_, i) => ({
        id: \`\${districtId}-\${i + 1}\`,
        name: \`\${district.seatPrefix}-\${i + 1}\`,
        number: i + 1,
        districtId: districtId,
        districtName: district.name,
    }));
};
`;

// Write to file
fs.writeFileSync(path.join(process.cwd(), 'src/lib/electionData.js'), newContent, 'utf8');
console.log('Successfully updated src/lib/electionData.js');
