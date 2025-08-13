import { onMount, onCleanup, createSignal, For } from 'solid-js';
import maplibregl from 'maplibre-gl';
import MaplibreDraw from 'maplibre-gl-draw';
import type { Feature } from 'geojson';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './DrawingManager.css';

// Type definitions for MaplibreDraw modes
interface DrawState {
  selectedCoordPaths?: unknown[];
  [key: string]: unknown;
}

interface DrawEvent {
  [key: string]: unknown;
}

interface DrawingManagerProps {
  map: maplibregl.Map;
}

export function DrawingManager(props: DrawingManagerProps) {
  let draw: MaplibreDraw;
  
  const [selectedFeature] = createSignal<string | null>(null);
  const [features, setFeatures] = createSignal<Feature[]>([]);

  onMount(() => {
    if (!props.map) return;

    // Create custom simple_select mode to disable dragging
    const createCustomSimpleSelectMode = () => {
      const SimpleSelectMode = MaplibreDraw.modes.simple_select;

      (SimpleSelectMode as { onDrag?: () => void }).onDrag = () => {
        // Completely disable all dragging in simple_select mode
        return;
      };
      
      return SimpleSelectMode;
    };

    // Create custom direct_select mode to disable feature dragging but allow vertex editing
    const createCustomDirectSelectMode = () => {
      const DirectSelectMode = MaplibreDraw.modes.direct_select;

      // Store the original onDrag method with proper typing
      const originalOnDrag = (DirectSelectMode as { onDrag?: (state: DrawState, e: DrawEvent) => void }).onDrag;

      (DirectSelectMode as { onDrag?: (state: DrawState, e: DrawEvent) => void }).onDrag = function(state: DrawState, e: DrawEvent) {
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
        // Polygon fill
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
        // Polygon fill - active
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
        // Polygon stroke - active
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
        // Polygon stroke - inactive
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
        // Vertices - halo
        {
          'id': 'gl-draw-polygon-and-line-vertex-halo-active',
          'type': 'circle',
          'filter': ['all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point']
          ],
          'paint': {
            'circle-radius': 8,
            'circle-color': '#FFF'
          }
        },
        // Vertices
        {
          'id': 'gl-draw-polygon-and-line-vertex-active',
          'type': 'circle',
          'filter': ['all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point']
          ],
          'paint': {
            'circle-radius': 6,
            'circle-color': '#ff0000'
          }
        },
        // Midpoints halo
        {
          'id': 'gl-draw-polygon-and-line-midpoint-halo-active',
          'type': 'circle',
          'filter': ['all',
            ['==', 'meta', 'midpoint'],
            ['==', '$type', 'Point']
          ],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#FFF'
          }
        },
        // Midpoints
        {
          'id': 'gl-draw-polygon-and-line-midpoint',
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

    // Add Draw control to the map
    props.map.addControl(draw as unknown as maplibregl.IControl, 'top-left');

    // Event listeners for drawing events
    const updateFeatures = () => {
      if (draw) {
        const allFeatures = draw.getAll();
        setFeatures(allFeatures.features);
      }
    };

    props.map.on('load', updateFeatures);
    props.map.on('draw.create', updateFeatures);
    props.map.on('draw.delete', updateFeatures);
    props.map.on('draw.update', updateFeatures);
  });

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

  const updateFeatures = () => {
    if (draw) {
      const allFeatures = draw.getAll();
      setFeatures(allFeatures.features);
    }
  };

  onCleanup(() => {
    if (draw && props.map) {
      props.map.removeControl(draw as unknown as maplibregl.IControl);
    }
  });

  return (
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
  );
}
