import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import SplashScreen from './components/SplashScreen'
import ZIPS from './data/zips'
import { fetchAsthmaData, fetchCardioData, fetchHVI } from './utils/api'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [selected, setSelected] = useState(null)
  const [selectedZip, setSelectedZip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('normal') // 'normal' or 'topVulnerable'
  const [topVulnerableZips, setTopVulnerableZips] = useState([])

  // Fetch API data when a ZIP is selected
  useEffect(() => {
    if (selectedZip) {
      fetchPredictionData(selectedZip)
    }
  }, [selectedZip])

  async function fetchPredictionData(zip) {
    setLoading(true)
    try {
      const [asthmaRes, cardioRes, hviRes] = await Promise.all([
        fetchAsthmaData([zip]),
        fetchCardioData([zip]),
        fetchHVI([zip])
      ])

      // Get local data
      const localData = ZIPS[zip]
      
      // Merge API data with local data
      const merged = {
        ...localData,
        asthma: asthmaRes?.[0] || null,
        cardio: cardioRes?.[0] || null,
        hvi: hviRes?.[0] || null
      }

      setSelected({ zip, data: merged })
    } catch (error) {
      console.error('Error fetching predictions:', error)
      // Fall back to local data if API fails
      const localData = ZIPS[zip]
      setSelected({ zip, data: localData })
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(zip, data) {
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

  async function loadTopVulnerable(n = 10) {
    setLoading(true)
    try {
      const { fetchTopVulnerable } = await import('./utils/api')
      const data = await fetchTopVulnerable(n)
      setTopVulnerableZips(data || [])
      setViewMode('topVulnerable')
      setSelected(null)
      setSelectedZip(null)
    } catch (error) {
      console.error('Error loading top vulnerable:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleBackToNormal() {
    setViewMode('normal')
    setSelected(null)
    setSelectedZip(null)
    setTopVulnerableZips([])
  }

  return (
    <>
      {showSplash && <SplashScreen onEnter={handleSplashEnter} />}
      <div className="app-layout">
        <Sidebar 
          selected={selected} 
          onZipSearch={handleZipSearch} 
          loading={loading}
          viewMode={viewMode}
          topVulnerable={topVulnerableZips}
          onLoadTopVulnerable={loadTopVulnerable}
          onBackToNormal={handleBackToNormal}
        />
        <MapView 
          onSelect={handleSelect} 
          selectedZip={selectedZip}
          viewMode={viewMode}
          topVulnerableZips={topVulnerableZips}
        />
      </div>
    </>
  )
}
