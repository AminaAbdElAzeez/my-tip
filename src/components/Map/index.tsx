import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useSelector, useDispatch } from "react-redux";

import { fetchContainerLatLng, fetchMapAddress } from "store/property/actions";
interface LocationPickerProps {
  setIsLocationSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

/////////

const Map: React.FC<LocationPickerProps> = ({ setIsLocationSelected }) => {
  const { mapLatLng } = useSelector(
    (state: { Properties: any }) => state.Properties
  );
  const dispatch = useDispatch();
  const fetchAddress = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    const address = data?.display_name?.split(',');
    if (address.length > 3) {
      address.splice(2, 1); // Remove the postal code
    }
    const newAddress = address.join(','); // Join the remaining parts
    console.log(newAddress); 
    dispatch(fetchMapAddress(newAddress))
  };
  const center = {
    lat: mapLatLng?.lat || 23.8859,
    lng: mapLatLng?.lng || 45.0792,
  };
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend(event) {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          const lat = marker.getLatLng()?.lat;
          const lng = marker.getLatLng()?.lng;
          
          // setIsLocationSelected(false);
          setIsLocationSelected(true);
          dispatch(
            fetchContainerLatLng({
              lat,
              lng,
            })
          );
          console.log("latlng", lat, lng);
          fetchAddress(lat,lng)
        }
        console.log(event?.target)
       
      },
    }),
    []
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "350px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <DraggableMarker /> */}
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={customIcon}
        
      >
        {/* <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Marker is draggable'
              : 'Click here to make marker draggable'}
          </span>
        </Popup> */}
      </Marker>
    </MapContainer>
  );
};

export default Map;
