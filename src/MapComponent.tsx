import { onMount, onCleanup, createSignal, For } from 'solid-js';
import maplibregl from 'maplibre-gl';
import MaplibreDraw from 'maplibre-gl-draw';
import type { Feature } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './MapComponent.css';

export function MapComponent() {
  let mapContainer: HTMLDivElement | undefined;
  let map: maplibregl.Map;
  let draw: MaplibreDraw;
  
  const [selectedFeature, setSelectedFeature] = createSignal<string | null>(null);
  const [features, setFeatures] = createSignal<Feature[]>([]);

  onMount(() => {
    if (!mapContainer) return;

    // Initialize the map
    map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 2,
    });

    // Create custom simple_select mode to disable dragging
    const createCustomSimpleSelectMode = () => {
      const SimpleSelectMode = MaplibreDraw.modes.simple_select;

      (SimpleSelectMode as any).onDrag = () => {
        // Completely disable all dragging in simple_select mode
        return;
      };
      
      return SimpleSelectMode;
    };

    // Create custom direct_select mode to disable feature dragging but allow vertex editing
    const createCustomDirectSelectMode = () => {
      const DirectSelectMode = MaplibreDraw.modes.direct_select;

      // Store the original onDrag method with proper typing
      const originalOnDrag = (DirectSelectMode as any).onDrag;

      (DirectSelectMode as any).onDrag = function(state: any, e: any) {
        // If no coordinates are selected (meaning we're trying to drag the whole feature), prevent it
        if (!state.selectedCoordPaths || state.selectedCoordPaths.length === 0) {
          return; // Prevent feature dragging
        }
        
        // Allow vertex dragging by calling the original method if it exists
        if (originalOnDrag) {
          return originalOnDrag.call(this, state, e);
        }
      };
      
      return DirectSelectMode;
    };

    // Initialize Mapbox Draw with custom modes and styles
    draw = new MaplibreDraw({
      displayControlsDefault: true,
      controls: {
        point: false,
        line_string: true,
        polygon: true,
        trash: true,
        srmode: false,
        combine_features: false,
        uncombine_features: false
      },
      // Disable box selection and prevent feature dragging
      modes: {
        ...MaplibreDraw.modes,
        simple_select: createCustomSimpleSelectMode(),
        direct_select: createCustomDirectSelectMode()
      },
      styles: [
        // Line style for routes (polylines)
        {
          'id': 'gl-draw-line',
          'type': 'line',
          'filter': ['all', 
            ['==', '$type', 'LineString'],
            ['!=', 'mode', 'static'],
            ['!=', 'active', 'true']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#3366cc',
            'line-width': 3
          }
        },
        // Active line style
        {
          'id': 'gl-draw-line-active',
          'type': 'line',
          'filter': ['all',
            ['==', '$type', 'LineString'],
            ['==', 'active', 'true']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#ff0000',
            'line-dasharray': [0.2, 2],
            'line-width': 3
          }
        },
        // Polygon fill for areas
        {
          'id': 'gl-draw-polygon-fill',
          'type': 'fill',
          'filter': ['all', ['==', '$type', 'Polygon']],
          'paint': {
            'fill-color': '#3366cc',
            'fill-outline-color': '#3366cc',
            'fill-opacity': 0.2
          }
        },
        // Active polygon fill
        {
          'id': 'gl-draw-polygon-fill-active',
          'type': 'fill',
          'filter': ['all', 
            ['==', '$type', 'Polygon'],
            ['==', 'active', 'true']
          ],
          'paint': {
            'fill-color': '#ff0000',
            'fill-outline-color': '#ff0000',
            'fill-opacity': 0.3
          }
        },
        // Polygon stroke
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', 
            ['==', '$type', 'Polygon'],
            ['==', 'active', 'true']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#ff0000',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        // Polygon stroke inactive
        {
          'id': 'gl-draw-polygon-stroke-inactive',
          'type': 'line',
          'filter': ['all', 
            ['==', '$type', 'Polygon'],
            ['==', 'active', 'false']
          ],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#3366cc',
            'line-width': 2
          }
        },
        // Vertex points
        {
          'id': 'gl-draw-polygon-and-line-vertex-halo-active',
          'type': 'circle',
          'filter': ['all', 
            ['==', 'meta', 'vertex'], 
            ['==', '$type', 'Point']
          ],
          'paint': {
            'circle-radius': 7,
            'circle-color': '#FFF'
          }
        },
        {
          'id': 'gl-draw-polygon-and-line-vertex-active',
          'type': 'circle',
          'filter': ['all', 
            ['==', 'meta', 'vertex'], 
            ['==', '$type', 'Point']
          ],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#ff0000'
          }
        },
        // Midpoints
        {
          'id': 'gl-draw-polygon-midpoint',
          'type': 'circle',
          'filter': ['all',
            ['==', '$type', 'Point'],
            ['==', 'meta', 'midpoint']
          ],
          'paint': {
            'circle-radius': 4,
            'circle-color': '#ff0000'
          }
        }
      ]
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add attribution control
    map.addControl(new maplibregl.AttributionControl({
      compact: false
    }));

    // Add Draw control to the map - should work natively with MapLibre
    map.addControl(draw as unknown as maplibregl.IControl, 'top-left');

    // Add Draw control to the map after the map loads (fallback)
    map.on('load', () => {
      updateFeatures();
    });

    // Event listeners for drawing events
    map.on('draw.create', updateFeatures);
    map.on('draw.delete', updateFeatures);
    // Event listeners for drawing events
    map.on('draw.create', updateFeatures);
    map.on('draw.delete', updateFeatures);
    map.on('draw.update', updateFeatures);
  });

  const updateFeatures = () => {
    if (draw) {
      const allFeatures = draw.getAll();
      setFeatures(allFeatures.features);
    }
  };

  const deleteFeature = (featureId: string) => {
    if (draw) {
      draw.delete(featureId);
      updateFeatures();
    }
  };

  const editFeature = (featureId: string) => {
    if (draw) {
      draw.changeMode('direct_select', { featureId: featureId });
    }
  };

  onCleanup(() => {
    if (map) {
      map.remove();
    }
  });

  return (
    <div class="map-wrapper">
      {/* Features List */}
      <div class="features-panel">
        <h3>Features ({features().length})</h3>
        <div class="features-list">
          <For each={features()}>
            {(feature) => (
              <div 
                class={`feature-item ${selectedFeature() === feature.id ? 'selected' : ''}`}
              >
                <div class="feature-info">
                  <span class="feature-type">
                    {feature.geometry?.type === 'LineString' ? 'Route' : 'Area'}
                  </span>
                </div>
                <div class="feature-actions">
                  <button 
                    onClick={() => feature.id && editFeature(String(feature.id))}
                    class="action-btn edit-btn"
                    title="Edit feature"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => feature.id && deleteFeature(String(feature.id))}
                    class="action-btn delete-btn"
                    title="Delete feature"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </For>
          {features().length === 0 && (
            <div class="no-features">
              No features drawn yet. Use the controls above to start drawing routes or areas.
            </div>
          )}
        </div>
      </div>

      <div
        ref={mapContainer}
        class="map-container"
      />
    </div>
  );
}
