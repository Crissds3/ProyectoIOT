// src/components/HeatMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchData } from '../services/influxservice.js';
import { getRainIcon, getSunIcon } from '../utils/icons';
import { useMediaQuery } from 'react-responsive';

function HeatMap({ sensors }) {
  const [sensorData, setSensorData] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const mapHeight = isMobile ? '300px' : '600px';

  useEffect(() => {
    let isMounted = true; // Para evitar actualizar el estado si el componente está desmontado
  
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
  
    fetchSensorData(); // Llamada inicial
  
    const interval = setInterval(fetchSensorData, 5000); // Actualiza cada 5 segundos
  
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sensors]);
  

  return (
    <div id="map">
      <MapContainer
        center={[-35.00243952632493, -71.22943639165166]}
        zoom={15}
        style={{ height: mapHeight, width: '100%' }}
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
                key={idx}
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
                key={idx}
                center={[sensor.latitude, sensor.longitude]}
                radius={100}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.5 }}
              >
                <Tooltip>{`Temperatura: ${temperature}°C`}</Tooltip>
              </Circle>
            );
          } else {
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
}

function getColorForTemperature(temp) {
  // Mapear temperatura a colores (de azul a rojo)
  const minTemp = -50;
  const maxTemp = 50;
  const percentage = (temp - minTemp) / (maxTemp - minTemp);

  const r = Math.floor(255 * percentage);
  const b = 255 - r;
  return `rgb(${r}, 0, ${b})`;
}

export default HeatMap;
