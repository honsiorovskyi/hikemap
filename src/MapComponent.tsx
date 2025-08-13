import { onMount, onCleanup } from 'solid-js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapComponent.css';

export function MapComponent() {
  let mapContainer: HTMLDivElement | undefined;
  let map: maplibregl.Map;

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
    map.addControl(new maplibregl.NavigationControl());

    // Add attribution control
    map.addControl(new maplibregl.AttributionControl({
      compact: false
    }));
  });

  onCleanup(() => {
    if (map) {
      map.remove();
    }
  });

  return (
    <div class="map-wrapper">
      <div
        ref={mapContainer}
        class="map-container"
      />
    </div>
  );
}
