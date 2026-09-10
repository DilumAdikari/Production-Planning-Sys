import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing marker icons in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle auto-resizing
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const SriLankaMap = ({ plants = [] }) => {
  // Center of Sri Lanka
  const centerPosition = [7.8731, 80.7718];

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm mb-3">Subcontractor Plants Live Map</h3>
      
      {/* Explicit height wrapper (h-[420px]) */}
      <div className="h-[420px] w-full rounded-lg overflow-hidden border border-slate-100 relative">
        <MapContainer
          center={centerPosition}
          zoom={7.5}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <MapResizer />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {plants.map((plant) => (
            <Marker
              key={plant._id || plant.code}
              position={[plant.location?.lat || 7.0, plant.location?.lng || 80.0]}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <strong className="block text-sm font-bold text-slate-900">{plant.name}</strong>
                  <span className="text-blue-600 font-mono font-semibold">{plant.code}</span>
                  <div className="mt-2 text-slate-600 space-y-1">
                    <p>District: <strong>{plant.district}</strong></p>
                    <p>Capacity: <strong>{plant.capacity} pcs/day</strong></p>
                    <p className="text-amber-600 font-bold">WIP Load: {plant.wipBalance || 0} pcs</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default SriLankaMap;