import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import SplashScreen from './components/SplashScreen'
import ZIPS from './data/zips'
import { fetchAsthmaData, fetchCardioData, fetchHVI, predictUnknownZip } from './utils/api'
import PREDICTED_ZIPS from './data/predictedZips'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [selected, setSelected] = useState(null)
  const [selectedZip, setSelectedZip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('normal')
  const [topVulnerableZips, setTopVulnerableZips] = useState([])
  const [predictedZips, setPredictedZips] = useState(PREDICTED_ZIPS)

  // Fetch API data when a known ZIP is selected (skip unknown/estimated zips)
  useEffect(() => {
    if (selectedZip && ZIPS[selectedZip]) {
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
        asthmaApi: asthmaRes?.[0] || null,
        cardioApi: cardioRes?.[0] || null,
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
    if (!data) {
      handleZipSearch(zip)
    } else {
      setSelectedZip(zip)
      if (!ZIPS[zip]) {
        // Predicted zip — no API fetch available, show pre-computed data immediately
        setSelected({ zip, data })
      }
      // OC zips: useEffect watches selectedZip and calls fetchPredictionData
    }
  }

  async function handleZipSearch(zip) {
    if (ZIPS[zip]) {
      handleSelect(zip, ZIPS[zip])
      return
    }

    // ZIP not in local dataset — use cache or call prediction API
    const cached = predictedZips[zip]
    if (cached) {
      setSelected({ zip, data: cached })
      setSelectedZip(zip)
      return
    }

    setLoading(true)
    try {
      const result = await predictUnknownZip(zip)
      if (!result) return
      const estimated = {
        name: result.city,
        score: result.score ?? 50,
        asthma: result.asthma,
        cardio: result.cardio,
        toxRelease: result.toxRelease ?? 50,
        lowBirth: result.lowBirth ?? 50,
        pm25: result.pm25 ?? 50,
        traffic: result.traffic ?? 50,
        poverty: result.poverty ?? 50,
        education: result.education ?? 50,
        totalPop: result.totalPop,
        tractCount: '—',
        hispanic: null,
        white: null,
        asian: null,
        black: null,
        estimated: true,
        nearestZip: result.nearest_zip,
        nearestCity: result.nearest_city,
        distanceKm: result.distance_km,
      }
      setPredictedZips(prev => ({ ...prev, [zip]: estimated }))
      setSelected({ zip, data: estimated })
      setSelectedZip(zip)
    } catch (err) {
      console.error('Unknown ZIP error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSplashEnter(zip, data) {
    setShowSplash(false)
    if (data) {
      handleSelect(zip, data)
    } else {
      await handleZipSearch(zip)
    }
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
          predictedZips={predictedZips}
        />
      </div>
    </>
  )
}
