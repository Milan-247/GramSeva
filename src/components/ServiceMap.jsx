import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "../context/LanguageContext";

const DISTRICT_COORDINATES = {
  Thiruvananthapuram: [8.5241, 76.9366],
  Kollam: [8.8932, 76.6141],
  Pathanamthitta: [9.2648, 76.787],
  Alappuzha: [9.4981, 76.3388],
  Kottayam: [9.5916, 76.5222],
  Idukki: [9.8498, 76.9798],
  Ernakulam: [9.9816, 76.2999],
  Thrissur: [10.5276, 76.2144],
  Palakkad: [10.7867, 76.6548],
  Malappuram: [11.051, 76.0711],
  Kozhikode: [11.2588, 75.7804],
  Wayanad: [11.6854, 76.132],
  Kannur: [11.8745, 75.3704],
  Kasaragod: [12.4996, 74.9869]
};

const LOCALITY_COORDINATES = {
  // Thiruvananthapuram
  Neyyattinkara: [8.3988, 77.0872],
  Attingal: [8.6961, 76.8150],
  Nedumangad: [8.6027, 77.0006],
  Varkala: [8.7379, 76.7163],
  Kovalam: [8.4004, 76.9787],
  Kazhakkoottam: [8.5663, 76.8794],
  Balaramapuram: [8.4239, 77.0425],
  Kattakada: [8.5081, 77.0792],

  // Kollam
  Punalur: [9.0168, 76.9295],
  Karunagappally: [9.0617, 76.5360],
  Kottarakkara: [9.0000, 76.7800],
  Paravur: [8.8117, 76.6669],
  Chavara: [8.9950, 76.5383],
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
  Cherthala: [9.6845, 76.3262],
  Kayamkulam: [9.1720, 76.5003],
  Haripad: [9.2883, 76.4628],
  Ambalappuzha: [9.3833, 76.3667],
  Mavelikkara: [9.2434, 76.5492],
  Chengannur: [9.3174, 76.6114],
  Kuttanad: [9.4500, 76.4000],
  Aroor: [9.8739, 76.3039],

  // Kottayam
  Changanassery: [9.4447, 76.5383],
  Pala: [9.7108, 76.6833],
  Vaikom: [9.7486, 76.3927],
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
  "North Paravur": [10.1458, 76.2289],
  Kalamassery: [10.0536, 76.3200],
  Tripunithura: [9.9500, 76.3500],

  // Thrissur
  Chalakudy: [10.3070, 76.3330],
  Kunnamkulam: [10.6508, 76.0717],
  Guruvayur: [10.5946, 76.0419],
  Kodungallur: [10.2188, 76.2045],
  Wadakkanchery: [10.6622, 76.2461],
  Chavakkad: [10.5833, 76.0333],
  Irinjalakuda: [10.3428, 76.2133],
  Vatanappally: [10.5186, 76.1086],

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
  Tirur: [10.9158, 75.9239],
  Ponnani: [10.7686, 75.9250],
  Kottakkal: [11.0000, 76.0000],
  Perinthalmanna: [10.9789, 76.2286],
  Nilambur: [11.2758, 76.2278],
  Kondotty: [11.1444, 75.9625],
  Valanchery: [10.8986, 76.0733],

  // Kozhikode & Azhiyur Sub-localities
  Azhiyur: [11.6710, 75.5420],
  "Mukkali Town": [11.6661, 75.5511],
  Mukkali: [11.6661, 75.5511],
  "Azhiyur Chungam": [11.6730, 75.5410],
  Chombala: [11.6600, 75.5450],
  "Koroth Road": [11.6680, 75.5430],
  Kunhippally: [11.6580, 75.5480],
  Poozhithala: [11.6550, 75.5410],
  Avikkara: [11.6620, 75.5400],
  "Chirayil Peedika": [11.6700, 75.5460],
  "Ancham Peedika": [11.6750, 75.5480],
  Kottamala: [11.6790, 75.5520],
  Manankara: [11.6720, 75.5530],
  Panada: [11.6650, 75.5550],
  Kallamala: [11.6810, 75.5580],
  Kolarad: [11.6770, 75.5560],
  Theru: [11.6690, 75.5490],
  Karappakunnu: [11.6740, 75.5510],
  Andicompany: [11.6630, 75.5470],
  Koyilandy: [11.4361, 75.6989],
  Vadakara: [11.6083, 75.5917],
  Mukkam: [11.3208, 75.9928],
  Ramanattukara: [11.1719, 75.8711],
  Feroke: [11.1783, 75.8361],
  Koduvally: [11.3564, 75.9122],
  Payyoli: [11.5222, 75.6178],
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
  Thalassery: [11.7480, 75.4894],
  Taliparamba: [12.0408, 75.3586],
  Payyanur: [12.1006, 75.2033],
  Iritty: [11.9806, 75.6667],
  Mattannur: [11.9317, 75.5786],
  Kuthuparamba: [11.8267, 75.5683],
  Alakode: [12.1833, 75.4333],
  Chakkarakkal: [11.8500, 75.4833],

  // Kasaragod
  Kanhangad: [12.3167, 75.0833],
  Nileshwaram: [12.2500, 75.1333],
  Uppala: [12.6833, 74.9000],
  Manjeshwar: [12.7136, 74.8887],
  Trikaripur: [12.1500, 75.1500],
  Kumbla: [12.5833, 74.9500],
  Badiyadka: [12.5833, 75.0667],
  Cheruvathur: [12.2167, 75.1667]
};

const CATEGORY_STYLE = {
  health: { color: "#fb4778", short: "H" },
  water: { color: "#00c2ff", short: "W" },
  agriculture: { color: "#ffb703", short: "K" },
  education: { color: "#9b6cff", short: "E" },
  government: { color: "#7687ff", short: "G" }
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

  const base = LOCALITY_COORDINATES[service.localityName] || DISTRICT_COORDINATES[service.districtName] || DISTRICT_COORDINATES.Kozhikode;
  const hash = hashString(`${service.id}-${service.categoryKey}`);
  const angle = (hash % 360) * (Math.PI / 180);
  // Precise micro-offset (~150m to 400m) to keep points accurately within the town/locality
  const radius = 0.0018 + ((hash % 7) * 0.0006);
  return [
    Number((base[0] + Math.sin(angle) * radius).toFixed(5)),
    Number((base[1] + Math.cos(angle) * radius).toFixed(5))
  ];
}

function createMarkerIcon(service) {
  const style = CATEGORY_STYLE[service.categoryKey] || CATEGORY_STYLE.government;
  return L.divIcon({
    className: "gramseva-map-marker",
    html: `<span style="--marker-color:${style.color}">${style.short}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16]
  });
}

function FitToServices({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 1) {
      map.flyToBounds(coordinates, { padding: [32, 32], maxZoom: 14, duration: 0.55, easeLinearity: 0.3 });
    } else if (coordinates.length === 1) {
      map.flyTo(coordinates[0], 13, { duration: 0.45 });
    }
  }, [coordinates, map]);

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

  const mapServices = useMemo(() => {
    return mapCategoryFilter === "all" ? services : services.filter((service) => service.categoryKey === mapCategoryFilter);
  }, [mapCategoryFilter, services]);

  const visibleMapServices = useMemo(() => mapServices.slice(0, MAX_RENDERED_MARKERS), [mapServices]);

  const cleanTitle = (title) => {
    if (!title) return "";
    return title.replace(/\s*-\s*#[0-9]+$/g, "").replace(/\s*#\d+$/g, "").trim();
  };

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
        const catStyle = CATEGORY_STYLE[group.categoryKey] || CATEGORY_STYLE.government;
        const localizedTitle = (primary.translations[language] || primary.translations.en || {}).title || group.baseTitle;
        const cleanLocTitle = cleanTitle(localizedTitle);

        icon = L.divIcon({
          className: "gramseva-institution-map-marker",
          html: `<div style="background: linear-gradient(135deg, ${catStyle.color}, #0d9488); color: white; border: 2px solid rgba(255,255,255,0.9); border-radius: 20px; padding: 4px 10px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 14px rgba(0,0,0,0.5); display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;">
                  <span>📍 ${cleanLocTitle}</span>
                  <span style="background: rgba(0,0,0,0.4); color: #6ee7b7; padding: 1px 6px; border-radius: 10px; font-size: 10px; font-family: monospace;">${group.services.length}</span>
                </div>`,
          iconSize: [160, 32],
          iconAnchor: [80, 16],
          popupAnchor: [0, -16]
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

  return (
    <div className="real-map-shell flex-1 flex flex-col gap-4 p-4 sm:p-5">
      <div className="real-map-toolbar" role="toolbar" aria-label={ui.mapFilter}>
        {categoryOptions.map((cat) => (
          <button
            key={`map-${cat.key}`}
            type="button"
            onClick={() => setMapCategoryFilter(cat.key)}
            className={`real-map-filter ${mapCategoryFilter === cat.key ? "is-active" : ""}`}
            aria-pressed={mapCategoryFilter === cat.key}
          >
            {cat.key === "all" ? ui.mapFilter : getCategoryName(cat.key)}
          </button>
        ))}
        <span className="real-map-count" aria-live="polite">{institutionGroups.length} institutions ({visibleMapServices.length} entries)</span>
      </div>

      <div className="real-map-panel">
        <MapContainer center={center} zoom={12} scrollWheelZoom preferCanvas zoomAnimation fadeAnimation markerZoomAnimation className="real-map-canvas" aria-label="Real service location map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToServices coordinates={markerCoordinates} />
          {institutionGroups.map((group) => {
            const primary = group.primary;
            const data = primary.translations[language] || primary.translations.en || Object.values(primary.translations)[0];
            const displayTitle = cleanTitle(data.title);
            const style = CATEGORY_STYLE[group.categoryKey] || CATEGORY_STYLE.government;

            if (group.services.length === 1) {
              return (
                <Marker key={primary.id} position={group.coordinates} icon={group.icon}>
                  <CircleMarker center={group.coordinates} radius={18} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: 0.08, weight: 1 }} />
                  <Popup>
                    <div className="real-map-popup">
                      <strong>{displayTitle}</strong>
                      <span>{getCategoryName(primary.categoryKey)}</span>
                      <small>{data.location}</small>
                      <button type="button" onClick={() => setSelectedDetailService(primary)}>Open details</button>
                    </div>
                  </Popup>
                </Marker>
              );
            }

            return (
              <Marker key={group.id} position={group.coordinates} icon={group.icon}>
                <CircleMarker center={group.coordinates} radius={26} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: 0.15, weight: 2 }} />
                <Popup maxWidth={320} minWidth={260}>
                  <div className="real-map-popup max-h-72 flex flex-col p-1">
                    <div className="flex items-center justify-between border-b border-zinc-700/80 pb-2 mb-2">
                      <div>
                        <strong className="text-sm font-black text-white flex items-center gap-1">
                          <span>📍 {displayTitle}</span>
                        </strong>
                        <span className="text-[10px] text-emerald-400 font-bold block">{getCategoryName(group.categoryKey)} &middot; {group.localityName}</span>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {group.services.length} units
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed mb-2 line-clamp-2">
                      {data.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedDetailService(primary)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition text-center cursor-pointer shadow-sm"
                    >
                      View Institution Details ({group.services.length} registered units) &rarr;
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
