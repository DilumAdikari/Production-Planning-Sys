// frontend/src/components/SriLankaMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet default pin icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SriLankaMap = ({ plants = [] }) => {
  // Center: Sri Lanka Central Province coordinates
  const position = [7.8731, 80.7718];

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm mb-3">Subcontractor Plants Live Map</h3>
      <div className="h-96 w-full rounded-lg overflow-hidden border border-slate-100">
        <MapContainer center={position} zoom={7.5} scrollWheelZoom={false} className="h-full w-full">
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