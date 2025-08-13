# HikeMap

A powerful interactive map application for drawing and managing hiking routes and areas, built with **SolidJS**, **TypeScript**, **MapLibre GL JS**, and **Mapbox GL Draw**.

## Features

- 🗺️ Interactive map powered by MapLibre GL JS
- ✏️ **Draw Routes (Polylines)** - Create hiking trails, walking paths, or any linear route
- 🏞️ **Draw Areas (Polygons)** - Mark camping areas, restricted zones, or points of interest
- 🎯 **Individual Feature Management**:
  - **Select** individual routes or areas
  - **Edit** existing features with vertex manipulation
  - **Delete** unwanted features
- 📋 **Features Panel** - Visual list of all drawn features with quick actions
- ⚡ Built with SolidJS for reactive UI
- 📦 TypeScript for type safety
- 🔧 ESLint for code quality
- 🚀 Vite for fast development and building
- 📱 Responsive design
- 🌐 Ready for GitHub Pages deployment

## How to Use

### Drawing Controls
The application provides intuitive controls at the top of the map:

- **📍 Draw Route** - Click to start drawing a polyline (route/trail)
- **🏞️ Draw Area** - Click to start drawing a polygon (area/zone)
- **✋ Stop Drawing** - Exit drawing mode and return to selection mode

### Drawing Process
1. Click a drawing button (Route or Area)
2. Click on the map to place points
3. Double-click or press Enter to finish drawing
4. The new feature will appear in the Features Panel

### Managing Features
The Features Panel on the right shows all drawn features with these actions:

- **👁️ Select** - Highlight and focus on a feature
- **✏️ Edit** - Enter direct edit mode to modify vertices
- **🗑️ Delete** - Remove the feature permanently

### Edit Mode
When editing a feature:
- Drag vertices to reposition them
- Click on edge midpoints to add new vertices
- Select vertices and press Delete/Backspace to remove them
- Click outside the feature to exit edit mode

## Technical Implementation

### Drawing Technology
- **Mapbox GL Draw** - Professional-grade drawing tools
- **MapLibre GL JS** - High-performance map rendering
- **Custom Styling** - Visually distinct routes (blue) and areas (green/transparent)
- **Event Handling** - Real-time feature management and UI updates

### Architecture
- **Reactive State** - SolidJS signals for feature management
- **Type Safety** - Full TypeScript integration with GeoJSON types
- **Component Structure** - Clean separation of map logic and UI controls

## Quick Start

### Development

Run the development server with a single command:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173/`

### Build for Production

Build the project for deployment:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be uploaded to GitHub Pages or any static hosting service.

### Code Quality

Check code with ESLint:

```bash
npm run lint
```

Auto-fix ESLint issues:

```bash
npm run lint:fix
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages Deployment

The project is configured to work with GitHub Pages out of the box:

1. Build the project: `npm run build`
2. The `dist/` folder contains all static files
3. Upload the contents of `dist/` to your GitHub Pages repository
4. The app uses relative paths, so it will work in any subdirectory

## Project Structure

```
src/
├── App.tsx              # Main app component with header
├── App.css              # App styles
├── MapComponent.tsx     # MapLibre GL JS map component
├── MapComponent.css     # Map component styles
├── index.tsx            # App entry point
├── index.css            # Global styles
└── vite-env.d.ts        # Vite type definitions
```

## Technologies Used

- **[SolidJS](https://solidjs.com)** - Reactive UI framework
- **[TypeScript](https://typescriptlang.org)** - Type-safe JavaScript
- **[MapLibre GL JS](https://maplibre.org)** - Open-source map rendering
- **[Vite](https://vitejs.dev)** - Fast build tool
- **[ESLint](https://eslint.org)** - Code linting

## Map Details

The map uses the free MapLibre demo tiles and includes:
- Navigation controls (zoom, rotate)
- Attribution display
- Responsive design
- World-wide coverage starting at zoom level 2

## License

MIT
