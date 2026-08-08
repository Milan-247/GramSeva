import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "../context/LanguageContext";
import { Search, MapPin, Phone, Clock, Siren, Info } from "lucide-react";

const DISTRICT_COORDINATES = {
  // Kerala Districts
  Thiruvananthapuram: [8.5241, 76.9500],
  Kollam: [8.8932, 76.6350],
  Pathanamthitta: [9.2648, 76.7870],
  Alappuzha: [9.4981, 76.3550],
  Kottayam: [9.5916, 76.5222],
  Idukki: [9.8498, 76.9798],
  Ernakulam: [9.9816, 76.3250],
  Thrissur: [10.5276, 76.2144],
  Palakkad: [10.7867, 76.6548],
  Malappuram: [11.0510, 76.0711],
  Kozhikode: [11.2588, 75.7950],
  Wayanad: [11.6854, 76.1320],
  Kannur: [11.8745, 75.3950],
  Kasaragod: [12.5100, 75.0000],

  // Karnataka Districts (31)
  Bagalkot: [16.1853, 75.6961],
  Ballari: [15.1394, 76.9214],
  Belagavi: [15.8497, 74.4977],
  "Bengaluru Rural": [13.2500, 77.7167],
  "Bengaluru South": [12.6500, 77.4500],
  "Bengaluru Urban": [12.9716, 77.5946],
  Bidar: [17.9104, 77.5199],
  Chamarajanagar: [11.9261, 76.9437],
  Chikkaballapur: [13.4355, 77.7315],
  Chikkamagaluru: [13.3161, 75.7720],
  Chitradurga: [14.2251, 76.3980],
  "Dakshina Kannada": [12.8702, 74.8806],
  Davangere: [14.4644, 75.9218],
  Dharwad: [15.4589, 75.0078],
  Gadag: [15.4319, 75.6355],
  Hassan: [13.0072, 76.0962],
  Haveri: [14.7953, 75.4022],
  Kalaburagi: [17.3297, 76.8343],
  Kodagu: [12.4244, 75.7382],
  Kolar: [13.1367, 78.1292],
  Koppal: [15.3517, 76.1544],
  Mandya: [12.5218, 76.8951],
  Mysuru: [12.2958, 76.6394],
  Raichur: [16.2076, 77.3463],
  Shivamogga: [13.9299, 75.5681],
  Tumakuru: [13.3379, 77.1173],
  Udupi: [13.3409, 74.7421],
  "Uttara Kannada": [14.8185, 74.1416],
  Vijayanagara: [15.2689, 76.3909],
  Vijayapura: [16.8302, 75.7100],
  Yadgir: [16.7700, 77.1378]
};

const LOCALITY_COORDINATES = {
  // Thiruvananthapuram
  Neyyattinkara: [8.3988, 77.0872],
  Attingal: [8.6961, 76.8150],
  Nedumangad: [8.6027, 77.0006],
  Varkala: [8.7379, 76.7350],
  Kovalam: [8.4004, 76.9880],
  Kazhakkoottam: [8.5663, 76.8880],
  Balaramapuram: [8.4239, 77.0425],
  Kattakada: [8.5081, 77.0792],

  // Kollam
  Punalur: [9.0168, 76.9295],
  Karunagappally: [9.0617, 76.5500],
  Kottarakkara: [9.0000, 76.7800],
  Paravur: [8.8117, 76.6800],
  Chavara: [8.9950, 76.5520],
  Anchal: [8.9328, 76.9150],
  Pathanapuram: [9.0833, 76.8667],
  Kundara: [8.9602, 76.6800],

  // Pathanamthitta
  Thiruvalla: [9.3834, 76.5741],
  Adoor: [9.1530, 76.7328],
  Pandalam: [9.2311, 76.6828],
  Ranni: [9.3800, 76.8100],
  Konni: [9.2392, 76.8519],
  Mallappally: [9.4442, 76.6508],
  Kozhencherry: [9.3372, 76.7119],
  Aranmula: [9.3333, 76.6833],

  // Alappuzha
  Cherthala: [9.6845, 76.3450],
  Kayamkulam: [9.1720, 76.5150],
  Haripad: [9.2883, 76.4780],
  Ambalappuzha: [9.3833, 76.3850],
  Mavelikkara: [9.2434, 76.5492],
  Chengannur: [9.3174, 76.6114],
  Kuttanad: [9.4500, 76.4250],
  Aroor: [9.8739, 76.3200],

  // Kottayam
  Changanassery: [9.4447, 76.5383],
  Pala: [9.7108, 76.6833],
  Vaikom: [9.7486, 76.4050],
  Kanjirappally: [9.5572, 76.7869],
  Ettumanoor: [9.6672, 76.5606],
  Pampady: [9.5678, 76.6347],
  Erattupetta: [9.6833, 76.7833],
  Vazhoor: [9.5333, 76.7000],

  // Idukki
  Munnar: [10.0889, 77.0595],
  Kattappana: [9.7744, 77.1189],
  Thodupuzha: [9.8959, 76.7184],
  Santhanpara: [9.9383, 77.2000],
  Adimali: [10.0167, 76.9500],
  Devikulam: [10.0633, 77.1083],
  Peermade: [9.5767, 76.9856],
  Kumily: [9.6081, 77.1611],

  // Ernakulam
  Aluva: [10.1004, 76.3570],
  Muvattupuzha: [9.9819, 76.5778],
  Kothamangalam: [10.0573, 76.6300],
  Perumbavoor: [10.1147, 76.4789],
  Angamaly: [10.1960, 76.3860],
  "North Paravur": [10.1458, 76.2400],
  Kalamassery: [10.0536, 76.3200],
  Tripunithura: [9.9500, 76.3500],

  // Thrissur
  Chalakudy: [10.3070, 76.3330],
  Kunnamkulam: [10.6508, 76.0717],
  Guruvayur: [10.5946, 76.0520],
  Kodungallur: [10.2188, 76.2180],
  Wadakkanchery: [10.6622, 76.2461],
  Chavakkad: [10.5833, 76.0480],
  Irinjalakuda: [10.3428, 76.2133],
  Vatanappally: [10.5186, 76.1250],

  // Palakkad
  Ottapalam: [10.7716, 76.3800],
  Shoranur: [10.7611, 76.2817],
  Chittur: [10.6978, 76.7444],
  Alathur: [10.6483, 76.5447],
  Mannarkkad: [10.9889, 76.4556],
  Cherpulassery: [10.8783, 76.3117],
  Pattambi: [10.8108, 76.1833],
  Vadakkencherry: [10.5925, 76.4950],

  // Malappuram
  Manjeri: [11.1208, 76.1211],
  Tirur: [10.9158, 75.9380],
  Ponnani: [10.7686, 75.9400],
  Kottakkal: [11.0000, 76.0000],
  Perinthalmanna: [10.9789, 76.2286],
  Nilambur: [11.2758, 76.2278],
  Kondotty: [11.1444, 75.9625],
  Valanchery: [10.8986, 76.0733],

  // Kozhikode & Azhiyur Sub-localities
  Azhiyur: [11.6730, 75.5820],
  "Mukkali Town": [11.6661, 75.5810],
  Mukkali: [11.6661, 75.5810],
  "Azhiyur Chungam": [11.6730, 75.5790],
  Chombala: [11.6600, 75.5760],
  "Koroth Road": [11.6680, 75.5830],
  Kunhippally: [11.6580, 75.5820],
  Poozhithala: [11.6550, 75.5770],
  Avikkara: [11.6620, 75.5750],
  "Chirayil Peedika": [11.6700, 75.5840],
  "Ancham Peedika": [11.6750, 75.5860],
  Kottamala: [11.6790, 75.5890],
  Manankara: [11.6720, 75.5870],
  Panada: [11.6650, 75.5850],
  Kallamala: [11.6810, 75.5910],
  Kolarad: [11.6770, 75.5880],
  Theru: [11.6690, 75.5820],
  Karappakunnu: [11.6740, 75.5840],
  Andicompany: [11.6630, 75.5810],
  Koyilandy: [11.4361, 75.7150],
  Vadakara: [11.6083, 75.6120],
  Mukkam: [11.3208, 75.9928],
  Ramanattukara: [11.1719, 75.8711],
  Feroke: [11.1783, 75.8361],
  Koduvally: [11.3564, 75.9122],
  Payyoli: [11.5222, 75.6380],
  Kunnamangalam: [11.3061, 75.8792],

  // Wayanad
  Kalpetta: [11.6103, 76.0828],
  Mananthavady: [11.8028, 76.0028],
  "Sulthan Bathery": [11.6625, 76.2572],
  Vythiri: [11.5528, 76.0389],
  Meppadi: [11.5500, 76.1167],
  Pozhuthana: [11.5833, 76.0167],
  Panamaram: [11.7450, 76.0750],
  Pulpally: [11.7958, 76.1736],

  // Kannur
  Thalassery: [11.7480, 75.5120],
  Taliparamba: [12.0408, 75.3780],
  Payyanur: [12.1006, 75.2280],
  Iritty: [11.9806, 75.6667],
  Mattannur: [11.9317, 75.5786],
  Kuthuparamba: [11.8267, 75.5683],
  Alakode: [12.1833, 75.4333],
  Chakkarakkal: [11.8500, 75.4833],

  // Kasaragod
  Kanhangad: [12.3167, 75.0950],
  Nileshwaram: [12.2500, 75.1450],
  Uppala: [12.6833, 74.9280],
  Manjeshwar: [12.7136, 74.9180],
  Trikaripur: [12.1500, 75.1600],
  Kumbla: [12.5833, 74.9680],
  Badiyadka: [12.5833, 75.0667],
  Cheruvathur: [12.2167, 75.1667],

  // KARNATAKA LOCALITIES & GRAMA PANCHAYATS

  // Dakshina Kannada
  Mangaluru: [12.9141, 74.8560],
  Bantval: [12.8963, 75.0347],
  Beltangadi: [12.9904, 75.2974],
  Kadaba: [12.8130, 75.4180],
  Moodbidri: [13.0694, 74.9961],
  Puttur: [12.7667, 75.2000],
  Sullia: [12.5583, 75.3889],
  Ullal: [12.8068, 74.8504],
  Gurupura: [12.9333, 74.9333],
  Mulki: [13.0883, 74.7867],
  Surathkal: [13.0031, 74.7972],
  Kinnigoli: [13.0800, 74.8800],
  Vitla: [12.7600, 75.1000],
  Dharmasthala: [12.9531, 75.3800],
  Subrahmanya: [12.6642, 75.6173],

  // Udupi
  Udupi: [13.3409, 74.7421],
  Kundapura: [13.6288, 74.6908],
  Karkala: [13.2167, 74.9961],
  Kaup: [13.2300, 74.7400],
  Brahmavar: [13.4300, 74.7500],
  Baindur: [13.8667, 74.6333],
  Hebri: [13.3833, 75.0167],
  Saligrama: [13.5000, 74.7000],
  Malpe: [13.3569, 74.7039],
  Manipal: [13.3525, 74.7928],

  // Mysuru
  Mysuru: [12.2958, 76.6394],
  Nanjangud: [12.1189, 76.6806],
  Hunsur: [12.3083, 76.2894],
  "T Narasipura": [12.2133, 76.9022],
  Periyapatna: [12.3383, 76.0967],
  "KR Nagara": [12.4417, 76.3828],
  "HD Kote": [11.9833, 76.3333],
  Sargur: [11.9800, 76.3800],

  // Kodagu
  Madikeri: [12.4244, 75.7382],
  Somwarpet: [12.5978, 75.8672],
  Virajpet: [12.1969, 75.8033],
  Kushalnagar: [12.4578, 75.9614],
  Gonikoppa: [12.1833, 75.8833],
  Ponnampet: [12.1500, 75.8500],

  // Uttara Kannada
  Karwar: [14.8185, 74.1416],
  Ankola: [14.6653, 74.3053],
  Bhatkal: [13.9808, 74.5706],
  Dandeli: [15.2444, 74.6200],
  Haliyal: [15.3333, 74.7500],
  Honnavar: [14.2800, 74.4500],
  Joida: [15.1500, 74.4800],
  Kumta: [14.4258, 74.4172],
  Mundgod: [14.9700, 75.0300],
  Siddapur: [14.3400, 74.8800],
  Sirsi: [14.6194, 74.8353],
  Yellapur: [14.9667, 74.7167],

  // Belagavi
  Belagavi: [15.8497, 74.4977],
  Gokak: [16.1667, 74.8333],
  Chikodi: [16.4300, 74.5900],
  Athni: [16.7300, 75.0600],
  Khanapur: [15.6333, 74.5167],
  Nippani: [16.4000, 74.3800],

  // Bengaluru
  Bengaluru: [12.9716, 77.5946],
  Anekal: [12.7117, 77.6961],
  Yelahanka: [13.1007, 77.5963],
  Devanahalli: [13.2483, 77.7125],
  Hoskote: [13.0722, 77.7981],
  Nelamangala: [13.0983, 77.3931],
  Dodballapur: [13.2953, 77.5408],
  Ramanagara: [12.7206, 77.2797],
  Channapatna: [12.6517, 77.2089],
  Kanakapura: [12.5469, 77.4225],

  // Kalaburagi, Bidar, Raichur, Ballari, Shivamogga
  Kalaburagi: [17.3297, 76.8343],
  Bidar: [17.9104, 77.5199],
  Raichur: [16.2076, 77.3463],
  Yadgir: [16.7700, 77.1378],
  Ballari: [15.1394, 76.9214],
  Hosapete: [15.2689, 76.3909],
  Koppal: [15.3517, 76.1544],
  Gadag: [15.4319, 75.6355],
  Hubballi: [15.3647, 75.1240],
  Dharwad: [15.4589, 75.0078],
  Haveri: [14.7953, 75.4022],
  Davangere: [14.4644, 75.9218],
  Shivamogga: [13.9299, 75.5681],
  Bhadravathi: [13.8400, 75.7000],
  Sagar: [14.1667, 75.0333],
  Shikaripura: [14.2700, 75.3500],
  Thirthahalli: [13.7000, 75.2500],
  Tumakuru: [13.3379, 77.1173],
  Chitradurga: [14.2251, 76.3980],
  Hassan: [13.0072, 76.0962],
  Chikkamagaluru: [13.3161, 75.7720],
  Sringeri: [13.4167, 75.2500],
  Mudigere: [13.1333, 75.6000],
  Mandya: [12.5218, 76.8951],
  Srirangapatna: [12.4231, 76.6828],
  Chamarajanagar: [11.9261, 76.9437],
  Kollegala: [12.1500, 77.1167],
  Kolar: [13.1367, 78.1292],
  Chikkaballapur: [13.4355, 77.7315],
  Bagalkot: [16.1853, 75.6961],
  Vijayapura: [16.8302, 75.7100]
};

const CATEGORY_MAP_CONFIG = {
  health: {
    color: "#e11d48",
    bgColor: "linear-gradient(135deg, #e11d48, #be123c)",
    label: "Health Centre / Hospital",
    short: "🏥",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-300"
  },
  government: {
    color: "#2563eb",
    bgColor: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    label: "Local Govt Office",
    short: "🏛️",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-300"
  },
  water: {
    color: "#0284c7",
    bgColor: "linear-gradient(135deg, #0284c7, #0369a1)",
    label: "Water Works / KWA",
    short: "💧",
    badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-300"
  },
  agriculture: {
    color: "#d97706",
    bgColor: "linear-gradient(135deg, #d97706, #b45309)",
    label: "Krishi Bhavan & Agri",
    short: "🌾",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300"
  },
  education: {
    color: "#7c3aed",
    bgColor: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    label: "School & Education",
    short: "🏫",
    badgeBg: "bg-purple-100 text-purple-800 border-purple-300"
  }
};

const MAX_RENDERED_MARKERS = 300;

function hashString(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getServiceCoordinates(service) {
  if (service.latitude && service.longitude) {
    return [Number(service.latitude), Number(service.longitude)];
  }
  if (service.lat && service.lng) {
    return [Number(service.lat), Number(service.lng)];
  }

  const defaultFallback = service.id?.startsWith("kar-") ? DISTRICT_COORDINATES["Dakshina Kannada"] : DISTRICT_COORDINATES.Kozhikode;
  const base = LOCALITY_COORDINATES[service.localityName] || DISTRICT_COORDINATES[service.districtName] || defaultFallback;
  const hash = hashString(`${service.id}-${service.categoryKey}`);
  const angle = (hash % 360) * (Math.PI / 180);
  // Micro-offset (~100m to 300m) around village/town centers.
  const radius = 0.0008 + ((hash % 5) * 0.0003);
  const latOffset = Math.sin(angle) * radius;
  const lngOffset = Math.abs(Math.cos(angle)) * radius + 0.0003;

  return [
    Number((base[0] + latOffset).toFixed(5)),
    Number((base[1] + lngOffset).toFixed(5))
  ];
}

function createMarkerIcon(service) {
  const config = CATEGORY_MAP_CONFIG[service.categoryKey] || CATEGORY_MAP_CONFIG.government;
  const isEmergency = service.isEmergency;

  return L.divIcon({
    className: "gramseva-custom-pin",
    html: `<div style="
      width: 38px;
      height: 38px;
      background: ${config.bgColor};
      border: 2.5px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      position: relative;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: 16px;
        line-height: 1;
      ">${config.short}</span>
      ${isEmergency ? `<span style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background: #ef4444; border: 1.5px solid white; border-radius: 50%; box-shadow: 0 0 8px #ef4444;"></span>` : ""}
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34]
  });
}

function FitToServices({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 1) {
      map.flyToBounds(coordinates, { padding: [40, 40], maxZoom: 14, duration: 0.55, easeLinearity: 0.3 });
    } else if (coordinates.length === 1) {
      map.flyTo(coordinates[0], 14, { duration: 0.45 });
    }
  }, [coordinates, map]);

  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 120);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function ServiceMap({
  services,
  categoryOptions,
  mapCategoryFilter,
  setMapCategoryFilter,
  getCategoryName,
  setSelectedDetailService,
  ui
}) {
  const { language } = useLanguage();
  const [mapSearchText, setMapSearchText] = useState("");
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const cleanTitle = (title) => {
    if (!title) return "";
    return title.replace(/\s*-\s*#[0-9]+$/g, "").replace(/\s*#\d+$/g, "").trim();
  };

  const mapServices = useMemo(() => {
    return services.filter((service) => {
      // Category filter
      if (mapCategoryFilter !== "all" && service.categoryKey !== mapCategoryFilter) {
        return false;
      }
      // Emergency filter
      if (showEmergencyOnly && !service.isEmergency) {
        return false;
      }
      // On-map search query filter
      if (mapSearchText.trim()) {
        const query = mapSearchText.toLowerCase();
        const data = service.translations[language] || service.translations.en || {};
        const title = (data.title || "").toLowerCase();
        const desc = (data.description || "").toLowerCase();
        const loc = (data.location || "").toLowerCase();
        const locality = (service.localityName || "").toLowerCase();
        const district = (service.districtName || "").toLowerCase();
        const phone = (service.phoneNumber || "").toLowerCase();

        return title.includes(query) || desc.includes(query) || loc.includes(query) || locality.includes(query) || district.includes(query) || phone.includes(query);
      }
      return true;
    });
  }, [services, mapCategoryFilter, showEmergencyOnly, mapSearchText, language]);

  const visibleMapServices = useMemo(() => mapServices.slice(0, MAX_RENDERED_MARKERS), [mapServices]);

  // Group services by locality AND institution base title
  const institutionGroups = useMemo(() => {
    const map = new Map();
    visibleMapServices.forEach((service) => {
      const placeName = service.localityName || service.districtName || "General";
      const enTitle = service.translations?.en?.title || "";
      const baseTitle = cleanTitle(enTitle);
      const key = `${placeName}::${service.categoryKey}::${baseTitle}`;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          localityName: placeName,
          districtName: service.districtName,
          categoryKey: service.categoryKey,
          baseTitle,
          services: [],
        });
      }
      map.get(key).services.push(service);
    });

    return Array.from(map.values()).map((group) => {
      const primary = group.services[0];
      const baseCoords = getServiceCoordinates(primary);
      let icon;

      if (group.services.length === 1) {
        icon = createMarkerIcon(primary);
      } else {
        const config = CATEGORY_MAP_CONFIG[group.categoryKey] || CATEGORY_MAP_CONFIG.government;
        const localizedTitle = (primary.translations[language] || primary.translations.en || {}).title || group.baseTitle;
        const cleanLocTitle = cleanTitle(localizedTitle);

        icon = L.divIcon({
          className: "gramseva-institution-map-marker",
          html: `<div style="background: ${config.bgColor}; color: white; border: 2.5px solid rgba(255,255,255,0.95); border-radius: 20px; padding: 5px 12px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; cursor: pointer;">
                  <span>${config.short} ${cleanLocTitle}</span>
                  <span style="background: rgba(0,0,0,0.4); color: #6ee7b7; padding: 1.5px 7px; border-radius: 12px; font-size: 10px; font-family: monospace; font-weight: 900;">${group.services.length}</span>
                </div>`,
          iconSize: [170, 32],
          iconAnchor: [85, 16],
          popupAnchor: [0, -18]
        });
      }

      return {
        ...group,
        primary,
        coordinates: baseCoords,
        icon,
      };
    });
  }, [visibleMapServices, language]);

  const markerCoordinates = useMemo(() => institutionGroups.map((group) => group.coordinates), [institutionGroups]);
  const center = markerCoordinates[0] || DISTRICT_COORDINATES.Kozhikode;

  // Counts by facility category for quick chips
  const categoryCounts = useMemo(() => {
    const counts = { all: services.length, health: 0, government: 0, water: 0, agriculture: 0, education: 0 };
    services.forEach((s) => {
      if (counts[s.categoryKey] !== undefined) counts[s.categoryKey]++;
    });
    return counts;
  }, [services]);

  return (
    <div className="real-map-shell flex-1 flex flex-col gap-3 p-3 sm:p-5 bg-stone-50">
      
      {/* Top Map Header & Controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Interactive Local Offices & Health Centres Map</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizing registered government offices, public health centres, and community facilities.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              {institutionGroups.length} Pin Locations ({visibleMapServices.length} Records)
            </span>
            <button
              type="button"
              onClick={() => setShowLegend(!showLegend)}
              className="text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border border-stone-300 transition flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Legend</span>
            </button>
          </div>
        </div>

        {/* Search & Quick Toggles */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search map markers (e.g., PHC, Panchayat, Akshaya, Hospital, RTO...)"
              value={mapSearchText}
              onChange={(e) => setMapSearchText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            {mapSearchText && (
              <button
                type="button"
                onClick={() => setMapSearchText("")}
                className="absolute right-2.5 top-2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              showEmergencyOnly
                ? "bg-rose-600 text-white border-rose-700 shadow-2xs"
                : "bg-stone-100 text-slate-700 border-stone-300 hover:bg-stone-200"
            }`}
          >
            <Siren className="w-3.5 h-3.5 text-rose-500" />
            <span>24/7 Emergency Only</span>
          </button>
        </div>

        {/* Facility Category Quick Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setMapCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-xl border font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              mapCategoryFilter === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                : "bg-stone-100 text-slate-700 border-stone-300 hover:bg-stone-200"
            }`}
          >
            <span>All Facilities</span>
            <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full font-mono">{categoryCounts.all}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapCategoryFilter("health")}
            className={`px-3 py-1.5 rounded-xl border font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              mapCategoryFilter === "health"
                ? "bg-rose-700 text-white border-rose-800 shadow-2xs"
                : "bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100"
            }`}
          >
            <span>🏥 Health Centres & Hospitals</span>
            <span className="text-[10px] bg-rose-200/80 text-rose-900 px-1.5 py-0.2 rounded-full font-mono">{categoryCounts.health}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapCategoryFilter("government")}
            className={`px-3 py-1.5 rounded-xl border font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              mapCategoryFilter === "government"
                ? "bg-blue-700 text-white border-blue-800 shadow-2xs"
                : "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
            }`}
          >
            <span>🏛️ Local Govt Offices</span>
            <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded-full font-mono">{categoryCounts.government}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapCategoryFilter("water")}
            className={`px-3 py-1.5 rounded-xl border font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              mapCategoryFilter === "water"
                ? "bg-cyan-700 text-white border-cyan-800 shadow-2xs"
                : "bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100"
            }`}
          >
            <span>💧 Water Works</span>
            <span className="text-[10px] bg-cyan-200/80 text-cyan-900 px-1.5 py-0.2 rounded-full font-mono">{categoryCounts.water}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapCategoryFilter("agriculture")}
            className={`px-3 py-1.5 rounded-xl border font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              mapCategoryFilter === "agriculture"
                ? "bg-amber-700 text-white border-amber-800 shadow-2xs"
                : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
            }`}
          >
            <span>🌾 Krishi Bhavan</span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full font-mono">{categoryCounts.agriculture}</span>
          </button>

          <button
            type="button"
            onClick={() => setMapCategoryFilter("education")}
            className={`px-3 py-1.5 rounded-xl border font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              mapCategoryFilter === "education"
                ? "bg-purple-700 text-white border-purple-800 shadow-2xs"
                : "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100"
            }`}
          >
            <span>🏫 Education & Schools</span>
            <span className="text-[10px] bg-purple-200/80 text-purple-900 px-1.5 py-0.2 rounded-full font-mono">{categoryCounts.education}</span>
          </button>
        </div>

        {/* Optional Legend Drawer */}
        {showLegend && (
          <div className="bg-stone-100 border border-stone-200 rounded-xl p-3 text-xs text-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">🏥</span>
              <div>
                <strong className="block text-[11px] text-rose-900">Health Centres</strong>
                <span className="text-[10px] text-slate-500">PHCs, CHCs, Hospitals</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">🏛️</span>
              <div>
                <strong className="block text-[11px] text-blue-900">Govt Offices</strong>
                <span className="text-[10px] text-slate-500">Panchayat, Village, RTO</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">💧</span>
              <div>
                <strong className="block text-[11px] text-cyan-900">Water Works</strong>
                <span className="text-[10px] text-slate-500">KWA, Tanks, Pumps</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">🌾</span>
              <div>
                <strong className="block text-[11px] text-amber-900">Krishi Bhavan</strong>
                <span className="text-[10px] text-slate-500">Agri, Seed, Soil Labs</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">🏫</span>
              <div>
                <strong className="block text-[11px] text-purple-900">Education</strong>
                <span className="text-[10px] text-slate-500">Schools, Colleges, Libraries</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Map Render Panel */}
      <div className="real-map-panel relative rounded-2xl overflow-hidden border border-stone-300 shadow-xs min-h-[500px]">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom
          preferCanvas
          zoomAnimation
          fadeAnimation
          markerZoomAnimation
          className="real-map-canvas"
          aria-label="Leaflet Local Offices and Health Centres Map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapResizer />
          <FitToServices coordinates={markerCoordinates} />

          {institutionGroups.map((group) => {
            const primary = group.primary;
            const data = primary.translations[language] || primary.translations.en || Object.values(primary.translations)[0];
            const displayTitle = cleanTitle(data.title);
            const config = CATEGORY_MAP_CONFIG[group.categoryKey] || CATEGORY_MAP_CONFIG.government;

            if (group.services.length === 1) {
              return (
                <Marker key={primary.id} position={group.coordinates} icon={group.icon}>
                  <CircleMarker
                    center={group.coordinates}
                    radius={20}
                    pathOptions={{ color: config.color, fillColor: config.color, fillOpacity: 0.12, weight: 1.5 }}
                  />
                  <Popup maxWidth={300} minWidth={240}>
                    <div className="p-1 space-y-2 text-slate-900">
                      <div className="border-b border-stone-200 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${config.badgeBg}`}>
                            {config.short} {getCategoryName(primary.categoryKey)}
                          </span>
                          {primary.isEmergency && (
                            <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                              24/7 Emergency
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 mt-1.5 leading-snug">
                          {displayTitle}
                        </h3>
                        <p className="text-[11px] text-slate-600 font-semibold mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{data.location || `${primary.localityName}, ${primary.districtName}`}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                        {data.description}
                      </p>

                      {data.hours && (
                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{data.hours}</span>
                        </div>
                      )}

                      <div className="pt-1 flex gap-2">
                        {primary.phoneNumber && (
                          <a
                            href={`tel:${primary.phoneNumber}`}
                            className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-900 font-bold text-xs rounded-lg transition text-center flex items-center justify-center gap-1 border border-stone-300 no-underline"
                          >
                            <Phone className="w-3 h-3 text-emerald-700" />
                            <span>Call</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedDetailService(primary)}
                          className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-lg transition text-center cursor-pointer shadow-2xs uppercase tracking-wider"
                        >
                          View Details &rarr;
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }

            return (
              <Marker key={group.id} position={group.coordinates} icon={group.icon}>
                <CircleMarker
                  center={group.coordinates}
                  radius={28}
                  pathOptions={{ color: config.color, fillColor: config.color, fillOpacity: 0.18, weight: 2 }}
                />
                <Popup maxWidth={320} minWidth={260}>
                  <div className="p-1 space-y-2 text-slate-900">
                    <div className="border-b border-stone-200 pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${config.badgeBg}`}>
                          {config.short} {getCategoryName(group.categoryKey)}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                          {group.services.length} registered units
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-1.5 leading-snug">
                        {displayTitle}
                      </h3>
                      <p className="text-[11px] text-slate-600 font-semibold mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{group.localityName}, {group.districtName}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                      {data.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedDetailService(primary)}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-lg transition text-center cursor-pointer shadow-2xs uppercase tracking-wider mt-1"
                    >
                      View Institution ({group.services.length} Units) &rarr;
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
