// src/components/HeatMap.js
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  getRainIcon,
  getSunIcon,
  getHumidityIcon,
  getPressureIcon,
  getWindIcon,
} from "../utils/icons";
import { useMediaQuery } from "react-responsive";
import { fetchData } from "../services/influxservice";
import L from "leaflet";
import "leaflet.heat";

function HeatMap({ sensors, onPositionSelect, addingSensor }) {
  const [sensorData, setSensorData] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const mapHeight = isMobile ? "400px" : "600px";
  const [selectedPosition, setSelectedPosition] = useState(null);
  const mapRef = useRef(null);

  // Coordenadas del campus
  const campusCenter = [-35.00243952632493, -71.22943639165166];

  // Límites del mapa (opcional)
  const bounds = [
    [-35.005, -71.232], // Suroeste
    [-35.0, -71.227], // Noreste
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
        <Tooltip direction="top" offset={[0, -10]} permanent>
          <div
            style={{
              background: "rgba(0,0,0,0.7)",
              padding: "5px 10px",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            Ubicación Seleccionada
          </div>
        </Tooltip>
      </Marker>
    ) : null;
  }

  return (
    <div
      id="map"
      ref={mapRef}
      onMouseEnter={() => mapRef.current.classList.add("scroll-enabled")}
      onMouseLeave={() => mapRef.current.classList.remove("scroll-enabled")}
    >
      <MapContainer
        center={campusCenter}
        zoom={17}
        style={{ height: mapHeight, width: "100%" }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={16} // Limite mínimo de zoom
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sensorData.map((sensor, idx) => {
          const baseTooltipStyle = {
            background: "rgba(0,0,0,0.18)",
            padding: "5px 10px",
            borderRadius: "4px",
            color: "#000",
            fontSize: "14px",
          };

          if (sensor.type === "Lluvia") {
            const isRaining = sensor.data?._value === 1;
            return (
              <Marker
                key={`sensor-${idx}`}
                position={[sensor.latitude, sensor.longitude]}
                icon={isRaining ? getRainIcon() : getSunIcon()}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div style={baseTooltipStyle}>
                    <strong>{isRaining ? "Lluvia:" : "Clima:"}</strong> {isRaining ? "Está lloviendo" : "No está lloviendo"}
                  </div>
                </Tooltip>
              </Marker>
            );
          } else if (sensor.type === "Temperatura") {
            const temperature = sensor.data?._value || 0;
            const color = getColorForTemperature(temperature);
            const radius = getRadiusForTemperature(temperature);
            return (
              <Circle
                key={`sensor-${idx}`}
                center={[sensor.latitude, sensor.longitude]}
                radius={radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0, // Sin relleno visible, el heatmap se encargará del color
                  stroke: false,
                }}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div style={baseTooltipStyle}>
                    <strong>Temperatura:</strong> {temperature.toFixed(1)}°C
                  </div>
                </Tooltip>
              </Circle>
            );
          } else if (sensor.type === "Humedad") {
            const humidity = sensor.data?._value || 0;
            return (
              <Marker
                key={`sensor-${idx}`}
                position={[sensor.latitude, sensor.longitude]}
                icon={getHumidityIcon()}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div style={baseTooltipStyle}>
                    <strong>Humedad:</strong> {humidity.toFixed(1)}%
                  </div>
                </Tooltip>
              </Marker>
            );
          } else if (sensor.type === "Presion") {
            const pressure = sensor.data?._value || 0;
            return (
              <Marker
                key={`sensor-${idx}`}
                position={[sensor.latitude, sensor.longitude]}
                icon={getPressureIcon()}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div style={baseTooltipStyle}>
                    <strong>Presión:</strong> {pressure.toFixed(1)} hPa
                  </div>
                </Tooltip>
              </Marker>
            );
          } else if (sensor.type === "Viento") {
            const windSpeed = sensor.data?._value || 0;
            return (
              <Marker
                key={`sensor-${idx}`}
                position={[sensor.latitude, sensor.longitude]}
                icon={getWindIcon()}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div style={baseTooltipStyle}>
                    <strong>Viento:</strong> {windSpeed.toFixed(1)} m/s
                  </div>
                </Tooltip>
              </Marker>
            );
          } else {
            return null;
          }
        })}

        <HeatOverlay sensorData={sensorData} />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

function HeatOverlay({ sensorData }) {
  const map = useMap();

  useEffect(() => {
    if (map._heatLayer) {
      map.removeLayer(map._heatLayer);
    }

    const tempSensors = sensorData.filter(
      (sensor) => sensor.type === "Temperatura" && sensor.data
    );

    const minTemp = -10;
    const maxTemp = 40;
    const range = maxTemp - minTemp;

    const heatPoints = tempSensors.map((sensor) => {
      const temp = sensor.data._value || 0;
      let intensity = (temp - minTemp) / range;
      // Aseguramos un mínimo de 0.1 para que siempre haya al menos un color azul base
      intensity = Math.max(0.1, Math.min(intensity, 1));
      return [sensor.latitude, sensor.longitude, intensity];
    });

    if (heatPoints.length > 0) {
      const heatLayer = L.heatLayer(heatPoints, {
        radius: 50,
        blur: 35,
        maxZoom: 17,
        gradient: {
          0.0: "blue",
          0.5: "lime",
          1.0: "red",
        },
      });

      heatLayer.addTo(map);
      map._heatLayer = heatLayer;
    }
  }, [sensorData, map]);

  return null;
}

function getColorForTemperature(temp) {
  const minTemp = -50;
  const maxTemp = 50;
  const percentage = (temp - minTemp) / (maxTemp - minTemp);

  const r = Math.floor(255 * percentage);
  const b = 255 - r;
  return `rgb(${r}, 0, ${b})`;
}

function getRadiusForTemperature(temp) {
  const baseRadius = 10; // Radio base
  const scaleFactor = 1; // Factor de escala
  return baseRadius + temp * scaleFactor;
}

export default HeatMap;
