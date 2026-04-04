import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import ZIPS from '../data/zips'
import { scoreColor, scoreLabel } from '../utils/scores'

// Fix default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function makeIcon(zip, data) {
  const color = scoreColor(data.score)
  const label = scoreLabel(data.score)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="36" viewBox="0 0 72 36">
      <rect x="1" y="1" width="70" height="30" rx="7" fill="${color}" fill-opacity="0.93" stroke="white" stroke-width="1.5"/>
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

// Sub-component to fly to a zip when selected externally (e.g. from search)
function FlyTo({ zip }) {
  const map = useMap()
  if (zip && ZIPS[zip]) {
    const { lat, lng } = ZIPS[zip]
    map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 1 })
  }
  return null
}

export default function MapView({ onSelect, selectedZip }) {
  return (
    <MapContainer
      center={[33.72, -117.87]}
      zoom={11}
      style={{ flex: 1, height: '100%' }}
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />

      {Object.entries(ZIPS).map(([zip, data]) => (
        <Marker
          key={zip}
          position={[data.lat, data.lng]}
          icon={makeIcon(zip, data)}
          eventHandlers={{
            click: () => onSelect(zip, data),
          }}
        />
      ))}

      <FlyTo zip={selectedZip} />
    </MapContainer>
  )
}
