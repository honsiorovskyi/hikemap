# HikeMap

A simple interactive map application built with **SolidJS**, **TypeScript**, and **MapLibre GL JS**.

## Features

- 🗺️ Interactive map powered by MapLibre GL JS
- ⚡ Built with SolidJS for reactive UI
- 📦 TypeScript for type safety
- 🔧 ESLint for code quality
- 🚀 Vite for fast development and building
- 📱 Responsive design
- 🌐 Ready for GitHub Pages deployment

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
