import { onMount, onCleanup, createSignal } from 'solid-js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DrawingManager } from './DrawingManager';
import './MapComponent.css';

export function MapComponent() {
  let mapContainer: HTMLDivElement | undefined;
  let map: maplibregl.Map | undefined;
  
  const [mapReady, setMapReady] = createSignal(false);

  onMount(() => {
    if (!mapContainer) return;

    // Initialize the map
    map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 2,
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add attribution control
    map.addControl(new maplibregl.AttributionControl({
      compact: false
    }));

    // Mark map as ready when it loads
    map.on('load', () => {
      setMapReady(true);
    });
  });

  onCleanup(() => {
    if (map) {
      map.remove();
    }
  });

  return (
    <div class="map-wrapper">
      {/* Drawing Manager - only render when map is ready */}
      {mapReady() && map && <DrawingManager map={map} />}

      <div
        ref={mapContainer}
        class="map-container"
      />
    </div>
  );
}
