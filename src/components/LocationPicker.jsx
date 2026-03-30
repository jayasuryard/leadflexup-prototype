import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Search } from 'lucide-react';

// Fix default marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    }
  });
  return null;
};

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 17, { duration: 1 });
  }, [lat, lng, map]);
  return null;
};

export const LocationPicker = ({ onLocationChange, value }) => {
  const [position, setPosition] = useState(
    value?.lat ? [value.lat, value.lng] : [20.5937, 78.9629]
  );
  const [address, setAddress] = useState(value?.address || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [zoom] = useState(value?.lat ? 17 : 5);
  const searchRef = useRef(null);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data?.display_name) {
        setAddress(data.display_name);
        const addr = data.address || {};
        onLocationChange({
          lat, lng,
          address: data.display_name,
          street: addr.road || addr.pedestrian || '',
          area: addr.suburb || addr.neighbourhood || '',
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          country: addr.country || ''
        });
      }
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    }
  };

  const handleMapClick = (lat, lng) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        reverseGeocode(latitude, longitude);
        setDetecting(false);
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const results = await res.json();
      if (results.length > 0) {
        const r = results[0];
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);
        setPosition([lat, lng]);
        setAddress(r.display_name);
        const addr = r.address || {};
        onLocationChange({
          lat, lng,
          address: r.display_name,
          street: addr.road || addr.pedestrian || '',
          area: addr.suburb || addr.neighbourhood || '',
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          country: addr.country || ''
        });
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address or place name..."
            className="matte-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2.5 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-50"
        >
          {searching ? '...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detecting}
          className="px-3 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          title="Detect my location"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </form>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-navy-100" style={{ height: '240px' }}>
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={markerIcon} />
          <MapClickHandler onLocationSelect={handleMapClick} />
          <RecenterMap lat={position[0]} lng={position[1]} />
        </MapContainer>
      </div>

      {/* Selected address display */}
      {address && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50 border border-teal-200">
          <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-navy-700 leading-relaxed">{address}</p>
        </div>
      )}

      <p className="text-xs text-navy-400">
        Click on the map or search to pin your exact business location
      </p>
    </div>
  );
};
