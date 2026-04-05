import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import ZIPS from '../data/zips'
import MELISSA_ZIPS from '../data/melissaZips'
import { scoreColor, scoreLabel } from '../utils/scores'
import HeatmapLayer from './HeatmapLayer'
import styles from './MapView.module.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const INDICATORS = [
  { key: 'asthma',     label: 'Asthma' },
  { key: 'cardio',     label: 'Cardiovascular' },
  { key: 'toxRelease', label: 'Toxic Release' },
  { key: 'lowBirth',   label: 'Low Birth Weight' },
  { key: 'pm25',       label: 'PM2.5' },
  { key: 'traffic',    label: 'Traffic Density' },
]

function makeIcon(zip, data, vulnerableZipSet = new Set(), viewMode = 'normal') {
  const isVulnerable = vulnerableZipSet.has(zip)
  const color = isVulnerable ? '#E24B4A' : scoreColor(data.score)
  const label = scoreLabel(data.score)
  const strokeWidth = isVulnerable ? '2.5' : '1.5'
  const svgBG = isVulnerable ? '#FFE8E8' : 'white'
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="36" viewBox="0 0 72 36">
      <rect x="1" y="1" width="70" height="30" rx="7" fill="${color}" fill-opacity="0.93" stroke="${svgBG}" stroke-width="${strokeWidth}"/>
      <text x="36" y="13" text-anchor="middle" font-family="DM Mono, monospace" font-size="9" font-weight="600" fill="white">${zip}</text>
      <text x="36" y="24" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="8" fill="white" opacity="0.9">${label}</text>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [72, 36],
    iconAnchor: [36, 18],
    popupAnchor: [0, -22],
  })
}

function makeUnknownIcon(zip) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="30" viewBox="0 0 62 30">
      <rect x="1" y="1" width="60" height="28" rx="6" fill="#6b7280" fill-opacity="0.75" stroke="white" stroke-width="1"/>
      <text x="31" y="11" text-anchor="middle" font-family="DM Mono, monospace" font-size="8" font-weight="600" fill="white">${zip}</text>
      <text x="31" y="22" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="7" fill="white" opacity="0.8">click to predict</text>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [62, 30],
    iconAnchor: [31, 15],
  })
}

function FlyTo({ zip }) {
  const map = useMap()
  const prev = useRef(null)

  useEffect(() => {
    if (zip && zip !== prev.current) {
      const loc = ZIPS[zip] || MELISSA_ZIPS[zip]
      if (loc) {
        map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 13), { duration: 1 })
        prev.current = zip
      }
    }
  }, [zip, map])

  return null
}

export default function MapView({ onSelect, selectedZip, viewMode, topVulnerableZips }) {
  const [mode, setMode] = useState('markers')
  const [indicator, setIndicator] = useState('asthma')
  const vulnerableZipSet = new Set(topVulnerableZips?.map(z => z.ZIP?.toString()) || [])

  return (
    <div className={styles.wrap}>
      {/* Floating controls */}
      <div className={styles.controls}>
        <div className={styles.modePills}>
          <button
            className={`${styles.pill} ${mode === 'markers' ? styles.pillActive : ''}`}
            onClick={() => setMode('markers')}
          >
            <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
              <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M7 9c0 0 3 3.5 3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M7 9c0 0-3 3.5-3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Markers
          </button>
          <button
            className={`${styles.pill} ${mode === 'heatmap' ? styles.pillActive : ''}`}
            onClick={() => setMode('heatmap')}
          >
            <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" opacity="0.5"/>
            </svg>
            Heatmap
          </button>
        </div>

        {mode === 'heatmap' && (
          <div className={styles.indicatorPills}>
            {INDICATORS.map(({ key, label }) => (
              <button
                key={key}
                className={`${styles.indPill} ${indicator === key ? styles.indPillActive : ''}`}
                onClick={() => setIndicator(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {mode === 'heatmap' && (
        <div className={styles.legend}>
          <p className={styles.legendTitle}>
            {INDICATORS.find(i => i.key === indicator)?.label} — Statewide Percentile
          </p>
          <div className={styles.legendBar} />
          <div className={styles.legendLabels}>
            <span>Low (0)</span>
            <span>Moderate (50)</span>
            <span>High (100)</span>
          </div>
        </div>
      )}

      {viewMode === 'topVulnerable' && (
        <div className={styles.topVulnerableLegend}>
          <p className={styles.legendTitle}>
            Top 10 Most Vulnerable Areas Highlighted
          </p>
        </div>
      )}

      <MapContainer
        center={[33.72, -117.87]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {mode === 'markers' && Object.entries(MELISSA_ZIPS).map(([zip, mel]) => {
          const known = ZIPS[zip]
          if (known) {
            return (
              <Marker
                key={zip}
                position={[known.lat, known.lng]}
                icon={makeIcon(zip, known, vulnerableZipSet, viewMode)}
                eventHandlers={{ click: () => onSelect(zip, known) }}
              />
            )
          }
          return (
            <Marker
              key={zip}
              position={[mel.lat, mel.lng]}
              icon={makeUnknownIcon(zip)}
              eventHandlers={{ click: () => onSelect(zip, null) }}
            />
          )
        })}

        {mode === 'heatmap' && <HeatmapLayer indicator={indicator} />}

        <FlyTo zip={selectedZip} />
      </MapContainer>
    </div>
  )
}
