import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  Mukkali: [11.3751, 75.8877],
  Kozhikode: [11.2588, 75.7804],
  Vaikom: [9.7486, 76.3927],
  Manjeshwar: [12.7136, 74.8887]
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
    return [service.latitude, service.longitude];
  }

  const base = LOCALITY_COORDINATES[service.localityName] || DISTRICT_COORDINATES[service.districtName] || DISTRICT_COORDINATES.Kozhikode;
  const hash = hashString(`${service.id}-${service.categoryKey}`);
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = 0.012 + ((hash % 9) * 0.0025);
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
  const mapServices = useMemo(() => {
    return mapCategoryFilter === "all" ? services : services.filter((service) => service.categoryKey === mapCategoryFilter);
  }, [mapCategoryFilter, services]);

  const visibleMapServices = useMemo(() => mapServices.slice(0, MAX_RENDERED_MARKERS), [mapServices]);
  const preparedMarkers = useMemo(() => visibleMapServices.map((service) => ({
    service,
    coordinates: getServiceCoordinates(service),
    icon: createMarkerIcon(service)
  })), [visibleMapServices]);
  const markerCoordinates = useMemo(() => preparedMarkers.map((marker) => marker.coordinates), [preparedMarkers]);
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
        <span className="real-map-count" aria-live="polite">{visibleMapServices.length} of {mapServices.length} locations shown</span>
      </div>

      <div className="real-map-panel">
        <MapContainer center={center} zoom={12} scrollWheelZoom preferCanvas zoomAnimation fadeAnimation markerZoomAnimation className="real-map-canvas" aria-label="Real service location map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToServices coordinates={markerCoordinates} />
          {preparedMarkers.map(({ service, coordinates, icon }) => {
            const data = service.translations.en || Object.values(service.translations)[0];
            const style = CATEGORY_STYLE[service.categoryKey] || CATEGORY_STYLE.government;
            return (
              <Marker key={service.id} position={coordinates} icon={icon}>
                <CircleMarker center={coordinates} radius={18} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: 0.08, weight: 1 }} />
                <Popup>
                  <div className="real-map-popup">
                    <strong>{data.title}</strong>
                    <span>{getCategoryName(service.categoryKey)}</span>
                    <small>{data.location}</small>
                    <button type="button" onClick={() => setSelectedDetailService(service)}>Open details</button>
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
