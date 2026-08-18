// Comprehensive Dataset of Districts and Grama Panchayats in Tamil Nadu, India
// Official LGD Directory Data - State Code: 33
// Integrates Part 1, Part 2, Part 3, and Part 4 Local Government Directory (LGD) Master Datasets

import { TN_LGD_ALL_GRAM_PANCHAYATS, TN_LGD_STATS, TN_LGD_BLOCKS_MAP, TN_LGD_ZILA_PANCHAYATS, TN_LGD_PART4_GRAM_PANCHAYATS } from "./tamilNaduLgdMaster.js";

export const TAMILNADU_DISTRICTS_LIST = [
  { id: "ariyalur", en: "Ariyalur", ta: "அரியலூர்", hi: "अरियालूर", hq: "Ariyalur", totalPanchayats: 201 },
  { id: "chengalpattu", en: "Chengalpattu", ta: "செங்கல்பட்டு", hi: "चेंगलपट्टू", hq: "Chengalpattu", totalPanchayats: 359 },
  { id: "coimbatore", en: "Coimbatore", ta: "கோயம்புத்தூர்", hi: "कोयंबटूर", hq: "Coimbatore", totalPanchayats: 228 },
  { id: "cuddalore", en: "Cuddalore", ta: "கடலூர்", hi: "कड्डालोर", hq: "Cuddalore", totalPanchayats: 683 },
  { id: "dharmapuri", en: "Dharmapuri", ta: "தர்மபுரி", hi: "धर्मपुरी", hq: "Dharmapuri", totalPanchayats: 251 },
  { id: "dindigul", en: "Dindigul", ta: "திண்டுக்கல்", hi: "डिंडीगुल", hq: "Dindigul", totalPanchayats: 306 },
  { id: "erode", en: "Erode", ta: "ஈரோடு", hi: "इरोड", hq: "Erode", totalPanchayats: 225 },
  { id: "kallakurichi", en: "Kallakurichi", ta: "கள்ளக்குறிச்சி", hi: "कल्लाकुरिची", hq: "Kallakurichi", totalPanchayats: 412 },
  { id: "kanchipuram", en: "Kanchipuram", ta: "காஞ்சிபுரம்", hi: "कांचीपुरम", hq: "Kanchipuram", totalPanchayats: 274 },
  { id: "kanyakumari", en: "Kanyakumari", ta: "கன்னியாகுமரி", hi: "कन्याकुमारी", hq: "Nagercoil", totalPanchayats: 95 },
  { id: "karur", en: "Karur", ta: "கரூர்", hi: "करूर", hq: "Karur", totalPanchayats: 157 },
  { id: "krishnagiri", en: "Krishnagiri", ta: "கிருஷ்ணகிரி", hi: "कृष्णगिरि", hq: "Krishnagiri", totalPanchayats: 333 },
  { id: "madurai", en: "Madurai", ta: "மதுரை", hi: "मदुरै", hq: "Madurai", totalPanchayats: 420 },
  { id: "mayiladuthurai", en: "Mayiladuthurai", ta: "மயிலாடுதுறை", hi: "மாய்லாதுதுரை", hq: "Mayiladuthurai", totalPanchayats: 241 },
  { id: "nagapattinam", en: "Nagapattinam", ta: "நாகப்பட்டினம்", hi: "नागपट्टिनम", hq: "Nagapattinam", totalPanchayats: 193 },
  { id: "namakkal", en: "Namakkal", ta: "நாமக்கல்", hi: "नामक्कल", hq: "Namakkal", totalPanchayats: 322 },
  { id: "nilgiris", en: "Nilgiris", ta: "நீலகிரி", hi: "नीलगिरि", hq: "Udhagamandalam", totalPanchayats: 35 },
  { id: "perambalur", en: "Perambalur", ta: "பெரம்பலூர்", hi: "पेरम्बलूर", hq: "Perambalur", totalPanchayats: 121 },
  { id: "pudukkottai", en: "Pudukkottai", ta: "புதுக்கோட்டை", hi: "पुदुक्कोट्टई", hq: "Pudukkottai", totalPanchayats: 497 },
  { id: "ramanathapuram", en: "Ramanathapuram", ta: "இராமநாதபுரம்", hi: "रामनाथपुरम", hq: "Ramanathapuram", totalPanchayats: 429 },
  { id: "ranipet", en: "Ranipet", ta: "ராணிப்பேட்டை", hi: "रानीपेट", hq: "Ranipet", totalPanchayats: 288 },
  { id: "salem", en: "Salem", ta: "சேலம்", hi: "सेलम", hq: "Salem", totalPanchayats: 385 },
  { id: "sivaganga", en: "Sivaganga", ta: "சிவகாசி / சிவகங்கை", hi: "शिवगंगा", hq: "Sivaganga", totalPanchayats: 445 },
  { id: "tenkasi", en: "Tenkasi", ta: "தென்காசி", hi: "टेनकासी", hq: "Tenkasi", totalPanchayats: 221 },
  { id: "thanjavur", en: "Thanjavur", ta: "தஞ்சாவூர்", hi: "तंजौर", hq: "Thanjavur", totalPanchayats: 589 },
  { id: "theni", en: "Theni", ta: "தேனி", hi: "ठेनी", hq: "Theni", totalPanchayats: 130 },
  { id: "thoothukudi", en: "Thoothukudi", ta: "தூத்துக்குடி", hi: "थूथुकुडी", hq: "Thoothukudi", totalPanchayats: 403 },
  { id: "tiruchirappalli", en: "Tiruchirappalli", ta: "திருச்சிராப்பள்ளி", hi: "तिरुचिरापल्ली", hq: "Tiruchirappalli", totalPanchayats: 404 },
  { id: "tirunelveli", en: "Tirunelveli", ta: "திருநெல்வேலி", hi: "तिरुनेलवेली", hq: "Tirunelveli", totalPanchayats: 204 },
  { id: "tirupathur", en: "Tirupathur", ta: "திருப்பத்தூர்", hi: "तिरुप्पथூர்", hq: "Tirupathur", totalPanchayats: 208 },
  { id: "tiruppur", en: "Tiruppur", ta: "திருப்பூர்", hi: "तिरुपुर", hq: "Tiruppur", totalPanchayats: 265 },
  { id: "tiruvallur", en: "Tiruvallur", ta: "திருவள்ளூர்", hi: "तिरुவल्लूर", hq: "Tiruvallur", totalPanchayats: 526 },
  { id: "tiruvannamalai", en: "Tiruvannamalai", ta: "திருவண்ணாமலை", hi: "तिरुवन्नामलाई", hq: "Tiruvannamalai", totalPanchayats: 860 },
  { id: "tiruvarur", en: "Tiruvarur", ta: "திருவாரூர்", hi: "तिरुवारुर", hq: "Tiruvarur", totalPanchayats: 430 },
  { id: "vellore", en: "Vellore", ta: "வேலூர்", hi: "वेल्लोर", hq: "Vellore", totalPanchayats: 247 },
  { id: "viluppuram", en: "Viluppuram", ta: "விழுப்புரம்", hi: "विल्लुपुरम", hq: "Viluppuram", totalPanchayats: 688 },
  { id: "virudhunagar", en: "Virudhunagar", ta: "விருதுநகர்", hi: "विरुद्धनगर", hq: "Virudhunagar", totalPanchayats: 450 }
];

// Normalize district names to match standard keys in the UI
function normalizeDistrictName(distName) {
  if (!distName) return "Tamil Nadu";
  const d = distName.trim();
  if (d === "The Nilgiris") return "Nilgiris";
  if (d === "Kancheepuram") return "Kanchipuram";
  if (d === "Kanniyakumari") return "Kanyakumari";
  if (d === "Sivagangai") return "Sivaganga";
  if (d === "Thoothukkudi") return "Thoothukudi";
  if (d === "Villupuram") return "Viluppuram";
  return d;
}

// Build indexed mapping of all 7,145 Gram Panchayats by District from Part 1, Part 2, and Part 3
function buildPanchayatsByDistrict() {
  const map = {};

  TAMILNADU_DISTRICTS_LIST.forEach((d) => {
    map[d.en] = [];
  });

  const seen = new Set();

  TN_LGD_ALL_GRAM_PANCHAYATS.forEach((gp) => {
    const dist = normalizeDistrictName(gp.district);
    const key = `${dist}_${gp.code}`;
    if (!seen.has(key)) {
      seen.add(key);
      if (!map[dist]) {
        map[dist] = [];
      }
      map[dist].push({
        en: gp.name,
        ta: gp.name,
        code: gp.code,
        parentCode: gp.parentCode,
        block: gp.block,
        district: dist
      });
    }
  });

  return map;
}

export const TAMILNADU_PANCHAYATS_BY_DISTRICT = buildPanchayatsByDistrict();
export { TN_LGD_ALL_GRAM_PANCHAYATS, TN_LGD_STATS, TN_LGD_BLOCKS_MAP, TN_LGD_ZILA_PANCHAYATS, TN_LGD_PART4_GRAM_PANCHAYATS };
