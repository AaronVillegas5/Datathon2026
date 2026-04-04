import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import ZIPS from './data/zips'
import './App.css'

export default function App() {
  const [selected, setSelected] = useState(null)
  const [selectedZip, setSelectedZip] = useState(null)

  function handleSelect(zip, data) {
    setSelected({ zip, data })
    setSelectedZip(zip)
  }

  function handleZipSearch(zip) {
    const data = ZIPS[zip]
    if (data) handleSelect(zip, data)
  }

  return (
    <div className="app-layout">
      <Sidebar selected={selected} onZipSearch={handleZipSearch} />
      <MapView onSelect={handleSelect} selectedZip={selectedZip} />
    </div>
  )
}
