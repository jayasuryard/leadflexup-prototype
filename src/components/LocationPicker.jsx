import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Search, Satellite, Map as MapIcon, Layers, Mountain } from 'lucide-react';

// Red marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.flyTo(position, 17, { duration: 1 });
    }
  }, [position, map]);
  return null;
};

// Map tile layer configurations
const mapLayers = {
  satellite: {
    name: 'Satellite',
    icon: Satellite,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  hybrid: {
    name: 'Hybrid',
    icon: Layers,
    url: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
    attribution: '&copy; Esri'
  },
  street: {
    name: 'Street',
    icon: MapIcon,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  terrain: {
    name: 'Terrain',
    icon: Mountain,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  }
};

export const LocationPicker = ({ onLocationChange, value }) => {
  const [position, setPosition] = useState(
    value?.lat ? [value.lat, value.lng] : [20.5937, 78.9629]
  );
  const [address, setAddress] = useState(value?.address || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [mapType, setMapType] = useState('satellite'); // Default to satellite
  const [showMapMenu, setShowMapMenu] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [zoom] = useState(value?.lat ? 17 : 5);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimer = useRef(null);

  // Sync with external value changes
  useEffect(() => {
    if (value?.lat && value?.lng) {
      setPosition([value.lat, value.lng]);
      if (value.address) setAddress(value.address);
    }
  }, [value?.lat, value?.lng, value?.address]);

  // Auto-detect location on component mount
  useEffect(() => {
    // Only auto-detect if no initial value is provided
    if (!value?.lat && navigator.geolocation) {
      setDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude);
          setDetecting(false);
        },
        (error) => {
          console.log('Auto-detection failed:', error.message);
          setDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMapMenu(false);
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch location suggestions
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const results = await res.json();
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch (err) {
      console.error('Suggestions fetch failed:', err);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounce search query changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setShowSuggestions(false);
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
        const addr = r.address || {};
        const locationData = {
          lat, lng,
          address: r.display_name,
          street: addr.road || addr.pedestrian || '',
          area: addr.suburb || addr.neighbourhood || '',
          city: addr.city || addr.town || addr.village || '',
          state: addr.state || '',
          pincode: addr.postcode || '',
          country: addr.country || ''
        };
        setPosition([lat, lng]);
        setAddress(r.display_name);
        onLocationChange(locationData);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const addr = suggestion.address || {};
    const locationData = {
      lat, lng,
      address: suggestion.display_name,
      street: addr.road || addr.pedestrian || '',
      area: addr.suburb || addr.neighbourhood || '',
      city: addr.city || addr.town || addr.village || '',
      state: addr.state || '',
      pincode: addr.postcode || '',
      country: addr.country || ''
    };
    setPosition([lat, lng]);
    setAddress(suggestion.display_name);
    setSearchQuery(suggestion.display_name);
    onLocationChange(locationData);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Search address or place name..."
            className="matte-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
            autoComplete="off"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-navy-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {loadingSuggestions ? (
                <div className="px-4 py-3 text-sm text-navy-400 text-center">
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full px-4 py-2.5 text-left hover:bg-navy-50 transition-colors border-b border-navy-100 last:border-b-0 flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">
                        {suggestion.display_name.split(',')[0]}
                      </p>
                      <p className="text-xs text-navy-400 line-clamp-2">
                        {suggestion.display_name}
                      </p>
                    </div>
                  </button>
                ))
              ) : null}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSearch}
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
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-navy-100" style={{ height: '240px' }}>
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          attributionControl={false}
        >
          {/* Render tile layers based on map type */}
          {mapType === 'hybrid' ? (
            <>
              <TileLayer
                attribution={mapLayers.hybrid.attribution}
                url={mapLayers.hybrid.url[0]}
              />
              <TileLayer
                attribution={mapLayers.hybrid.attribution}
                url={mapLayers.hybrid.url[1]}
              />
            </>
          ) : (
            <TileLayer
              attribution={mapLayers[mapType].attribution}
              url={mapLayers[mapType].url}
            />
          )}
          <Marker position={position} icon={markerIcon} />
          <MapClickHandler onLocationSelect={handleMapClick} />
          <RecenterMap position={position} />
        </MapContainer>
        
        {/* Map Type Switcher - Compact Dropdown */}
        <div ref={menuRef} className="absolute top-3 right-3 z-[1000]">
          <button
            type="button"
            onClick={() => setShowMapMenu(!showMapMenu)}
            className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-navy-200/50 hover:bg-white transition-all"
            title={mapLayers[mapType].name}
          >
            {(() => {
              const Icon = mapLayers[mapType].icon;
              return <Icon className="w-4 h-4 text-navy-700" />;
            })()}
          </button>
          
          {showMapMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-navy-200/50 overflow-hidden min-w-[140px]">
              {Object.entries(mapLayers).map(([key, layer]) => {
                const Icon = layer.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setMapType(key);
                      setShowMapMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                      mapType === key
                        ? 'bg-navy-700 text-white'
                        : 'text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{layer.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
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
