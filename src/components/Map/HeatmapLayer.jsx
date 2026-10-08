import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatmapLayer({ incidents = [] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !incidents || incidents.length === 0) return;

    // Convert incidents to heatmap points [lat, lng, intensity]
    const points = incidents.map(inc => [
      inc.latitude,
      inc.longitude,
      Math.min(1.0, Math.max(0.1, (inc.severity || 50) / 100))
    ]);

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 22,
      maxZoom: 16,
      max: 1.0,
      gradient: {
        0.25: '#00D66B', // NORMAL (green)
        0.55: '#FFD83D', // MEDIUM (yellow)
        0.75: '#FF9F1C', // HIGH (orange)
        1.00: '#FF4F87'  // CRITICAL (red/pink)
      }
    });

    heatLayer.addTo(map);

    return () => {
      try {
        if (map && heatLayer) {
          map.removeLayer(heatLayer);
        }
      } catch (err) {
        // Safe cleanup
      }
    };
  }, [map, incidents]);

  return null;
}
