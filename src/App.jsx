import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import SplashScreen from './components/SplashScreen'
import ZIPS from './data/zips'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
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

  function handleSplashEnter(zip, data) {
    setShowSplash(false)
    handleSelect(zip, data)
  }

  return (
    <>
      {showSplash && <SplashScreen onEnter={handleSplashEnter} />}
      <div className="app-layout">
        <Sidebar selected={selected} onZipSearch={handleZipSearch} />
        <MapView onSelect={handleSelect} selectedZip={selectedZip} />
      </div>
    </>
  )
}
