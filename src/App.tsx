import { MapComponent } from './MapComponent'
import './App.css'

function App() {
  return (
    <div class="app">
      <header class="app-header">
        <h1>HikeMap</h1>
        <p>A simple map built with SolidJS and MapLibre GL JS</p>
      </header>
      <main class="app-main">
        <MapComponent />
      </main>
    </div>
  )
}

export default App
