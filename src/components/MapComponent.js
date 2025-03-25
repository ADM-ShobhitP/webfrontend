import { GoogleMap, Marker, Polygon, LoadScript, InfoWindow } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
    width: '50%',
    height: '400px',
}

export default function MapComponent({ location, polygonBoundary }) {
    const [mapKey, setMapKey] = useState(0);
    const [showInfo, setShowInfo] = useState(false);


    return (
        <LoadScript googleMapsApiKey="AIzaSyCvvD2hUY-0bnxtfodaLwiIcQphb-C-l6A">
            <GoogleMap  mapContainerStyle={containerStyle} center={location} zoom={17}>
                <Marker position={location} label="Collector's Location" onClick={() => setShowInfo(true)} />
                
                {showInfo && (
                    <InfoWindow position={location} onCloseClick={() => setShowInfo(false)}>
                        <div>
                            <h3>Collector's Location</h3>
                            <p>Submitted data location</p>
                        </div>
                    </InfoWindow>
                )}


                {polygonBoundary.length > 0 && (
                    <Polygon
                        paths={polygonBoundary}
                        options={{
                            strokeColor: "red", fillColor: "rgba(255,0,0,0.3)", strokeOpacity: 1, strokeWeight: 2,
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    )
}