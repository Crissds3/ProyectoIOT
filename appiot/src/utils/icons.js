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
