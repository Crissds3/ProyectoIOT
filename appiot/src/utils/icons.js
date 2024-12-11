// src/utils/icons.js
import L from 'leaflet';

export const getRainIcon = () =>
  L.divIcon({
    html: `<div style="font-size: 24px; color: blue;">☔</div>`,
    iconSize: [24, 24],
    className: 'rain-icon',
  });

export const getSunIcon = () =>
  L.divIcon({
    html: `<div style="font-size: 24px; color: orange;">☀️</div>`,
    iconSize: [24, 24],
    className: 'sun-icon',
  });

export const getHumidityIcon = () =>
  L.divIcon({
    html: `<div style="font-size: 24px; color: teal;">💧</div>`,
    iconSize: [24, 24],
    className: 'humidity-icon',
  });

export const getPressureIcon = () =>
  L.divIcon({
    html: `<div style="font-size: 24px; color: purple;">🌡️</div>`,
    iconSize: [24, 24],
    className: 'pressure-icon',
  });

export const getWindIcon = () =>
  L.divIcon({
    html: `<div style="font-size: 24px; color: gray;">💨</div>`,
    iconSize: [24, 24],
    className: 'wind-icon',
  });
