import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useGeoLocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useSearchPosition } from "../hooks/useSearchPosition";
import { useCities } from "../hooks/useCities";
import Flag from "./Flag";
import Spinner from "./Spinner";

function Map() {
  const [mapLat, mapLng] = useSearchPosition();
  // Using state for map co-ordinates instead of just using search params because we want map to not move back to default position when any other component than <City> is rendered. Because it will remove search params from URL. So we want <Map> component to remember the co-ordinates.
  // Keep the this state in sync with search params (using effect)
  const [mapPosition, setMapPosition] = useState(() =>
    mapLat !== null && mapLng !== null ? [mapLat, mapLng] : null
  );

  const { cities } = useCities();

  const {
    isLoading: isLoadingPosition,
    position: myPosition,
    getPosition,
  } = useGeoLocation();

  useEffect(() => {
    if (mapLat !== null && mapLng !== null) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (myPosition) {
      setMapPosition([myPosition.lat, myPosition.lng]);
    }
  }, [myPosition]);

  // Effect to load initial location using ip
  useEffect(() => {
    // Don't fetch ip location if map position is set
    if (mapPosition) return;

    async function getIPGeolocation() {
      try {
        // If no query string is present, API returns information of IP geolocation.
        const res = await fetch(
          "https://api.bigdatacloud.net/data/reverse-geocode-client"
        );
        if (!res.ok) throw new Error("Something went wrong.");
        const { latitude, longitude } = await res.json();
        setMapPosition([latitude, longitude]);
      } catch (err) {
        // Do nothing if error occurs
      }
    }

    getIPGeolocation();
  }, [mapPosition]);

  if (!mapPosition)
    return (
      <div className={styles.mapContainer}>
        <Spinner />
      </div>
    );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use your location"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          // noWrap={true}
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span className={styles.popup}>
                <Flag countryCode={city.countryCode} /> {city.cityName}
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// You have to use hooks provided by leaflet inside children of <MapContainer>. So we create our own custom components.
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  // We setting co-ordinates in search params because:
  // 1. Apart from navigating to form, we want map to center the clicked position. This can be done by setting search params as they are in sync with state.
  // 2. Form needs co-ordinates of the place
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}

export default Map;
