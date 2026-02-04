// Real candidate data from Bangladesh Election Commission
// Source: http://103.183.38.66 (EC Portal)

export const districts = [
    { id: 'chittagong', name: 'চট্টগ্রাম', nameAlt: 'চট্রগ্রাম', seats: 16, seatPrefix: 'চট্রগ্রাম' },
    { id: 'dhaka', name: 'ঢাকা', seats: 20, seatPrefix: 'ঢাকা' },
    { id: 'comilla', name: 'কুমিল্লা', seats: 11, seatPrefix: 'কুমিল্লা' },
    { id: 'rajshahi', name: 'রাজশাহী', seats: 9, seatPrefix: 'রাজশাহী' },
    { id: 'khulna', name: 'খুলনা', seats: 10, seatPrefix: 'খুলনা' },
    { id: 'sylhet', name: 'সিলেট', seats: 7, seatPrefix: 'সিলেট' },
    { id: 'rangpur', name: 'রংপুর', seats: 8, seatPrefix: 'রংপুর' },
    { id: 'barisal', name: 'বরিশাল', seats: 6, seatPrefix: 'বরিশাল' },
    { id: 'mymensingh', name: 'ময়মনসিংহ', seats: 6, seatPrefix: 'ময়মনসিংহ' },
    { id: 'narayanganj', name: 'নারায়ণগঞ্জ', seats: 5, seatPrefix: 'নারায়ণগঞ্জ' },
    { id: 'gazipur', name: 'গাজীপুর', seats: 5, seatPrefix: 'গাজীপুর' },
    { id: 'tangail', name: 'টাঙ্গাইল', seats: 8, seatPrefix: 'টাঙ্গাইল' },
    { id: 'bogra', name: 'বগুড়া', seats: 6, seatPrefix: 'বগুড়া' },
    { id: 'jessore', name: 'যশোর', seats: 6, seatPrefix: 'যশোর' },
    { id: 'dinajpur', name: 'দিনাজপুর', seats: 6, seatPrefix: 'দিনাজপুর' },
    { id: 'faridpur', name: 'ফরিদপুর', seats: 4, seatPrefix: 'ফরিদপুর' },
    { id: 'brahmanbaria', name: 'ব্রাহ্মণবাড়িয়া', seats: 6, seatPrefix: 'ব্রাহ্মণবাড়িয়া' },
    { id: 'noakhali', name: 'নোয়াখালী', seats: 6, seatPrefix: 'নোয়াখালী' },
    { id: 'pabna', name: 'পাবনা', seats: 5, seatPrefix: 'পাবনা' },
    { id: 'sirajganj', name: 'সিরাজগঞ্জ', seats: 6, seatPrefix: 'সিরাজগঞ্জ' },
    { id: 'kishoreganj', name: 'কিশোরগঞ্জ', seats: 6, seatPrefix: 'কিশোরগঞ্জ' },
    { id: 'jamalpur', name: 'জামালপুর', seats: 4, seatPrefix: 'জামালপুর' },
    { id: 'netrokona', name: 'নেত্রকোণা', seats: 5, seatPrefix: 'নেত্রকোণা' },
    { id: 'habiganj', name: 'হবিগঞ্জ', seats: 4, seatPrefix: 'হবিগঞ্জ' },
    { id: 'sunamganj', name: 'সুনামগঞ্জ', seats: 5, seatPrefix: 'সুনামগঞ্জ' },
    { id: 'moulvibazar', name: 'মৌলভীবাজার', seats: 4, seatPrefix: 'মৌলভীবাজার' },
    { id: 'coxsbazar', name: 'কক্সবাজার', seats: 4, seatPrefix: 'কক্সবাজার' },
    { id: 'feni', name: 'ফেনী', seats: 3, seatPrefix: 'ফেনী' },
    { id: 'lakshmipur', name: 'লক্ষ্মীপুর', seats: 4, seatPrefix: 'লক্ষ্মীপুর' },
    { id: 'chandpur', name: 'চাঁদপুর', seats: 5, seatPrefix: 'চাঁদপুর' },
    { id: 'narsingdi', name: 'নরসিংদী', seats: 5, seatPrefix: 'নরসিংদী' },
    { id: 'manikganj', name: 'মানিকগঞ্জ', seats: 4, seatPrefix: 'মানিকগঞ্জ' },
    { id: 'munshiganj', name: 'মুন্সীগঞ্জ', seats: 4, seatPrefix: 'মুন্সীগঞ্জ' },
    { id: 'shariatpur', name: 'শরীয়তপুর', seats: 3, seatPrefix: 'শরীয়তপুর' },
    { id: 'madaripur', name: 'মাদারীপুর', seats: 3, seatPrefix: 'মাদারীপুর' },
    { id: 'gopalganj', name: 'গোপালগঞ্জ', seats: 3, seatPrefix: 'গোপালগঞ্জ' },
    { id: 'rajbari', name: 'রাজবাড়ী', seats: 3, seatPrefix: 'রাজবাড়ী' },
    { id: 'satkhira', name: 'সাতক্ষীরা', seats: 4, seatPrefix: 'সাতক্ষীরা' },
    { id: 'bagerhat', name: 'বাগেরহাট', seats: 4, seatPrefix: 'বাগেরহাট' },
    { id: 'narail', name: 'নড়াইল', seats: 2, seatPrefix: 'নড়াইল' },
    { id: 'magura', name: 'মাগুরা', seats: 2, seatPrefix: 'মাগুরা' },
    { id: 'jhenaidah', name: 'ঝিনাইদহ', seats: 4, seatPrefix: 'ঝিনাইদহ' },
    { id: 'chuadanga', name: 'চুয়াডাঙ্গা', seats: 2, seatPrefix: 'চুয়াডাঙ্গা' },
    { id: 'meherpur', name: 'মেহেরপুর', seats: 2, seatPrefix: 'মেহেরপুর' },
    { id: 'kushtia', name: 'কুষ্টিয়া', seats: 4, seatPrefix: 'কুষ্টিয়া' },
    { id: 'natore', name: 'নাটোর', seats: 4, seatPrefix: 'নাটোর' },
    { id: 'naogaon', name: 'নওগাঁ', seats: 6, seatPrefix: 'নওগাঁ' },
    { id: 'nawabganj', name: 'চাঁপাইনবাবগঞ্জ', seats: 3, seatPrefix: 'চাঁপাইনবাবগঞ্জ' },
    { id: 'joypurhat', name: 'জয়পুরহাট', seats: 2, seatPrefix: 'জয়পুরহাট' },
    { id: 'gaibandha', name: 'গাইবান্ধা', seats: 5, seatPrefix: 'গাইবান্ধা' },
    { id: 'kurigram', name: 'কুড়িগ্রাম', seats: 4, seatPrefix: 'কুড়িগ্রাম' },
    { id: 'lalmonirhat', name: 'লালমনিরহাট', seats: 4, seatPrefix: 'লালমনিরহাট' },
    { id: 'nilphamari', name: 'নীলফামারী', seats: 4, seatPrefix: 'নীলফামারী' },
    { id: 'thakurgaon', name: 'ঠাকুরগাঁও', seats: 3, seatPrefix: 'ঠাকুরগাঁও' },
    { id: 'panchagarh', name: 'পঞ্চগড়', seats: 2, seatPrefix: 'পঞ্চগড়' },
    { id: 'barguna', name: 'বরগুনা', seats: 2, seatPrefix: 'বরগুনা' },
    { id: 'patuakhali', name: 'পটুয়াখালী', seats: 4, seatPrefix: 'পটুয়াখালী' },
    { id: 'bhola', name: 'ভোলা', seats: 4, seatPrefix: 'ভোলা' },
    { id: 'pirojpur', name: 'পিরোজপুর', seats: 3, seatPrefix: 'পিরোজপুর' },
    { id: 'jhalokati', name: 'ঝালকাঠি', seats: 2, seatPrefix: 'ঝালকাঠি' },
    { id: 'khagrachhari', name: 'খাগড়াছড়ি', seats: 2, seatPrefix: 'খাগড়াছড়ি' },
    { id: 'rangamati', name: 'রাঙ্গামাটি', seats: 1, seatPrefix: 'রাঙ্গামাটি' },
    { id: 'bandarban', name: 'বান্দরবান', seats: 1, seatPrefix: 'বান্দরবান' },
    { id: 'sherpur', name: 'শেরপুর', seats: 3, seatPrefix: 'শেরপুর' },
];

// Real candidates for চট্রগ্রাম-৯ from EC website
export const chittagong9Candidates = [
    {
        id: 'ctg9-1',
        name: 'মোঃ নুরুল আবছার মজুমদার',
        party: 'নাগরিক ঐক্য',
        symbol: 'কেটলি',
        symbolEmoji: '☕',
        partyType: 'other'
    },
    {
        id: 'ctg9-2',
        name: 'সৈয়দ মোহাম্মদ হাসান মারুফ',
        party: 'গণসংহতি আন্দোলন',
        symbol: 'মাথাল',
        symbolEmoji: '🎓',
        partyType: 'other'
    },
    {
        id: 'ctg9-3',
        name: 'মোঃ হায়দার আলী চৌধুরী',
        party: 'জনতার দল',
        symbol: 'কলম',
        symbolEmoji: '🖊️',
        partyType: 'other'
    },
    {
        id: 'ctg9-4',
        name: 'আব্দুস শুক্কুর',
        party: 'ইসলামী আন্দোলন বাংলাদেশ',
        symbol: 'হাতপাখা',
        symbolEmoji: '🪭',
        partyType: 'other'
    },
    {
        id: 'ctg9-5',
        name: 'আবদুল মোমেন চৌধুরী',
        party: 'জাতীয় সমাজতান্ত্রিক দল-জেএসডি',
        symbol: 'তারা',
        symbolEmoji: '⭐',
        partyType: 'other'
    },
    {
        id: 'ctg9-6',
        name: 'মুহাম্মদ ওয়াহেদ মুরাদ',
        party: 'ইসলামিক ফ্রন্ট বাংলাদেশ',
        symbol: 'চেয়ার',
        symbolEmoji: '🪑',
        partyType: 'other'
    },
    {
        id: 'ctg9-7',
        name: 'ডা. এ কে এম ফজলুল হক',
        party: 'বাংলাদেশ জামায়াতে ইসলামী',
        symbol: 'দাঁড়িপাল্লা',
        symbolEmoji: '⚖️',
        partyType: 'jamat'
    },
    {
        id: 'ctg9-8',
        name: 'মোহাম্মদ আবু সুফিয়ান',
        party: 'বাংলাদেশ জাতীয়তাবাদী দল - বি.এন.পি',
        symbol: 'ধানের শীষ',
        symbolEmoji: '🌾',
        partyType: 'bnp'
    },
    {
        id: 'ctg9-9',
        name: 'মোঃ শফি উদ্দিন কবির',
        party: 'বাংলাদেশের সমাজতান্ত্রিক দল (মার্কসবাদী)',
        symbol: 'কাঁচি',
        symbolEmoji: '✂️',
        partyType: 'other'
    },
    {
        id: 'ctg9-10',
        name: 'মোহাম্মদ নঈম উদ্দীন',
        party: 'ইনসানিয়াত বিপ্লব বাংলাদেশ',
        symbol: 'আপেল',
        symbolEmoji: '🍎',
        partyType: 'other'
    },
];

// Real candidates for চট্রগ্রাম-১ from EC website
export const chittagong1Candidates = [
    {
        id: 'ctg1-1',
        name: 'এ, কে, এম, আবু ইউছুপ',
        party: 'জাতীয় সমাজতান্ত্রিক দল-জেএসডি',
        symbol: 'তারা',
        symbolEmoji: '⭐',
        partyType: 'other'
    },
    {
        id: 'ctg1-2',
        name: 'রেজাউল করিম',
        party: 'ইনসানিয়াত বিপ্লব বাংলাদেশ',
        symbol: 'আপেল',
        symbolEmoji: '🍎',
        partyType: 'other'
    },
    {
        id: 'ctg1-3',
        name: 'মোহাম্মদ ছাইফুর রহমান',
        party: 'বাংলাদেশ জামায়াতে ইসলামী',
        symbol: 'দাঁড়িপাল্লা',
        symbolEmoji: '⚖️',
        partyType: 'jamat'
    },
    {
        id: 'ctg1-4',
        name: 'নুরুল আমিন',
        party: 'বাংলাদেশ জাতীয়তাবাদী দল - বি.এন.পি',
        symbol: 'ধানের শীষ',
        symbolEmoji: '🌾',
        partyType: 'bnp'
    },
    {
        id: 'ctg1-5',
        name: 'ফেরদৌস আহমদ চৌধুরী',
        party: 'ইসলামী আন্দোলন বাংলাদেশ',
        symbol: 'হাতপাখা',
        symbolEmoji: '🪭',
        partyType: 'other'
    },
    {
        id: 'ctg1-6',
        name: 'শেখ জুলফিকার বুলবুল চৌধুরী',
        party: 'বাংলাদেশ মুসলিম লীগ-বিএমএল',
        symbol: 'হাত (পাঞ্জা)',
        symbolEmoji: '✋',
        partyType: 'other'
    },
    {
        id: 'ctg1-7',
        name: 'সৈয়দ শাহাদাৎ হোসেন',
        party: 'জাতীয় পার্টি',
        symbol: 'লাঙ্গল',
        symbolEmoji: '🌿',
        partyType: 'other'
    },
];

// Real candidates for চট্রগ্রাম-২ from EC website
export const chittagong2Candidates = [
    {
        id: 'ctg2-1',
        name: 'সরোয়ার আলমগীর',
        party: 'বাংলাদেশ জাতীয়তাবাদী দল - বি.এন.পি',
        symbol: 'ধানের শীষ',
        symbolEmoji: '🌾',
        partyType: 'bnp'
    },
    {
        id: 'ctg2-2',
        name: 'শাহজাদা সৈয়দ সাইফুদ্দিন আহমদ',
        party: 'বাংলাদেশ সুপ্রীম পার্টি (বি.এস.পি)',
        symbol: 'একতারা',
        symbolEmoji: '🎸',
        partyType: 'other'
    },
    {
        id: 'ctg2-3',
        name: 'মোহাম্মদ নুরুল আমিন',
        party: 'বাংলাদেশ জামায়াতে ইসলামী',
        symbol: 'দাঁড়িপাল্লা',
        symbolEmoji: '⚖️',
        partyType: 'jamat'
    },
    {
        id: 'ctg2-4',
        name: 'রবিউল হাসান',
        party: 'গণঅধিকার পরিষদ (জিওপি)',
        symbol: 'ট্রাক',
        symbolEmoji: '🚚',
        partyType: 'other'
    },
    {
        id: 'ctg2-5',
        name: 'মোহাম্মদ গোলাম নওশের আলী',
        party: 'জনতার দল',
        symbol: 'কলম',
        symbolEmoji: '🖊️',
        partyType: 'other'
    },
    {
        id: 'ctg2-6',
        name: 'আহমদ কবির',
        party: 'স্বতন্ত্র',
        symbol: 'ফুটবল',
        symbolEmoji: '⚽',
        partyType: 'independent'
    },
    {
        id: 'ctg2-7',
        name: 'মোহাম্মদ জুলফিকার আলী মান্নান',
        party: 'ইসলামী আন্দোলন বাংলাদেশ',
        symbol: 'হাতপাখা',
        symbolEmoji: '🪭',
        partyType: 'other'
    },
    {
        id: 'ctg2-8',
        name: 'জিন্নাত আকতার',
        party: 'স্বতন্ত্র',
        symbol: 'হরিণ',
        symbolEmoji: '🦌',
        partyType: 'independent'
    },
];

// Real candidates for চট্রগ্রাম-৩ from EC website
export const chittagong3Candidates = [
    {
        id: 'ctg3-1',
        name: 'মুহাম্মদ আলা উদ্দীন',
        party: 'বাংলাদেশ জামায়াতে ইসলামী',
        symbol: 'দাঁড়িপাল্লা',
        symbolEmoji: '⚖️',
        partyType: 'jamat'
    },
    {
        id: 'ctg3-2',
        name: 'মোহাম্মাদ আমজাদ হোসেন',
        party: 'ইসলামী আন্দোলন বাংলাদেশ',
        symbol: 'হাতপাখা',
        symbolEmoji: '🪭',
        partyType: 'other'
    },
    {
        id: 'ctg3-3',
        name: 'মোঃ মোয়াহেদুল মাওলা',
        party: 'স্বতন্ত্র',
        symbol: 'ফুটবল',
        symbolEmoji: '⚽',
        partyType: 'independent'
    },
    {
        id: 'ctg3-4',
        name: 'মোস্তফা কামাল পাশা',
        party: 'বাংলাদেশ জাতীয়তাবাদী দল - বি.এন.পি',
        symbol: 'ধানের শীষ',
        symbolEmoji: '🌾',
        partyType: 'bnp'
    },
];

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

// Get candidates for a specific seat
export const getCandidatesForSeat = (districtId, seatNumber) => {
    // Real data for Chittagong-9
    if (districtId === 'chittagong' && seatNumber === 9) {
        return chittagong9Candidates;
    }

    // Real data for Chittagong-1
    if (districtId === 'chittagong' && seatNumber === 1) {
        return chittagong1Candidates;
    }

    // Real data for Chittagong-2
    if (districtId === 'chittagong' && seatNumber === 2) {
        return chittagong2Candidates;
    }

    // Real data for Chittagong-3
    if (districtId === 'chittagong' && seatNumber === 3) {
        return chittagong3Candidates;
    }

    // For other seats, generate dummy candidates
    const district = districts.find(d => d.id === districtId);
    if (!district) return [];

    return [
        {
            id: `${districtId}-${seatNumber}-jamat`,
            name: `জামায়াত প্রার্থী (${district.seatPrefix}-${seatNumber})`,
            party: 'বাংলাদেশ জামায়াতে ইসলামী',
            symbol: 'দাঁড়িপাল্লা',
            symbolEmoji: '⚖️',
            partyType: 'jamat'
        },
        {
            id: `${districtId}-${seatNumber}-bnp`,
            name: `বিএনপি প্রার্থী (${district.seatPrefix}-${seatNumber})`,
            party: 'বাংলাদেশ জাতীয়তাবাদী দল - বি.এন.পি',
            symbol: 'ধানের শীষ',
            symbolEmoji: '🌾',
            partyType: 'bnp'
        },
        {
            id: `${districtId}-${seatNumber}-ind1`,
            name: `স্বতন্ত্র প্রার্থী ১ (${district.seatPrefix}-${seatNumber})`,
            party: 'স্বতন্ত্র',
            symbol: 'তারা',
            symbolEmoji: '⭐',
            partyType: 'other'
        },
        {
            id: `${districtId}-${seatNumber}-ind2`,
            name: `স্বতন্ত্র প্রার্থী ২ (${district.seatPrefix}-${seatNumber})`,
            party: 'স্বতন্ত্র',
            symbol: 'কলম',
            symbolEmoji: '🖊️',
            partyType: 'other'
        },
    ];
};

// Generate seat list for a district
export const getSeatsForDistrict = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    if (!district) return [];

    return Array.from({ length: district.seats }, (_, i) => ({
        id: `${districtId}-${i + 1}`,
        name: `${district.seatPrefix}-${i + 1}`,
        number: i + 1,
        districtId: districtId,
        districtName: district.name,
    }));
};
