// src/components/HeatMap.js
import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Circle,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getRainIcon, getSunIcon } from '../utils/icons';
import { useMediaQuery } from 'react-responsive';
import { fetchData } from '../services/influxservice';

function HeatMap({ sensors, onPositionSelect, addingSensor }) {
  const [sensorData, setSensorData] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const mapHeight = isMobile ? '300px' : '600px';
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Coordenadas del campus
  const campusCenter = [-35.00243952632493, -71.22943639165166];

  // Límites del mapa (opcional)
  const bounds = [
    [-35.005, -71.232], // Suroeste
    [-35.000, -71.227], // Noreste
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchSensorData = async () => {
      const promises = sensors.map(async (sensor) => {
        const data = await fetchData(sensor.measurement);
        return { ...sensor, data: data[0] };
      });

      const results = await Promise.all(promises);
      if (isMounted) {
        setSensorData(results);
      }
    };

    fetchSensorData();

    const interval = setInterval(fetchSensorData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sensors]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (addingSensor) {
          setSelectedPosition(e.latlng);
          onPositionSelect(e.latlng);
        }
      },
    });

    return selectedPosition && addingSensor ? (
      <Marker position={selectedPosition}>
        <Tooltip>Ubicación Seleccionada</Tooltip>
      </Marker>
    ) : null;
  }

  return (
    <div id="map">
      <MapContainer
        center={campusCenter}
        zoom={17} // Ajusta el zoom según lo necesites
        style={{ height: mapHeight, width: '100%' }}
        maxBounds={bounds} // Establece los límites del mapa
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sensorData.map((sensor, idx) => {
          if (sensor.type === 'Lluvia') {
            const isRaining = sensor.data?._value === 1;
            return (
              <Marker
                key={`sensor-${idx}`}
                position={[sensor.latitude, sensor.longitude]}
                icon={isRaining ? getRainIcon() : getSunIcon()}
              >
                <Tooltip>{isRaining ? 'Está lloviendo' : 'No está lloviendo'}</Tooltip>
              </Marker>
            );
          } else if (sensor.type === 'Temperatura') {
            const temperature = sensor.data?._value || 0;
            const color = getColorForTemperature(temperature);
            return (
              <Circle
                key={`sensor-${idx}`}
                center={[sensor.latitude, sensor.longitude]}
                radius={15} // Ajusta el radio según necesites
                pathOptions={{ color, stroke: false, fillColor: getColorForTemperature(temperature), fillOpacity: 0.3, className: 'no-blend' }}
              >
                <Tooltip>{`Temperatura: ${temperature}°C`}</Tooltip>
              </Circle>
            );
          } else {
            return null;
          }
        })}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

function getColorForTemperature(temp) {
  const minTemp = -50;
  const maxTemp = 50;
  const percentage = (temp - minTemp) / (maxTemp - minTemp);

  const r = Math.floor(255 * percentage);
  const b = 255 - r;
  return `rgb(${r}, 0, ${b})`;
}

export default HeatMap;
