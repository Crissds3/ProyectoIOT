// src/components/HeatMap.js
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMediaQuery } from 'react-responsive';

function HeatMap() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Definir las coordenadas del campus
  const LATITUD_CAMPUS = -35.00243952632493; // Reemplaza con la latitud real de tu campus
  const LONGITUD_CAMPUS = -71.22943639165166; // Reemplaza con la longitud real de tu campus

  return (
    <div id="map">
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Mapa de Calor del Campus</h2>
      <MapContainer
        center={[LATITUD_CAMPUS, LONGITUD_CAMPUS]}
        zoom={15}
        style={{ height: isMobile ? '300px' : '600px', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Aquí agregarás el mapa de calor más adelante */}
      </MapContainer>
    </div>
  );
}

export default HeatMap;
