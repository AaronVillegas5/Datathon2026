import { Circle } from 'react-leaflet'
import ZIPS from '../data/zips'
import MELISSA_ZIPS from '../data/melissaZips'
import PREDICTED_ZIPS from '../data/predictedZips'

// Color gradient: deep blue → violet → magenta → red
// Avoids yellows/oranges that blend into OSM map tiles
const STOPS = [
  [0.00, [22,  60,  160]],
  [0.30, [120, 40,  200]],
  [0.55, [220, 30,  120]],
  [0.75, [230, 50,  50 ]],
  [1.00, [140, 0,   0  ]],
]

function toColor(t) {
  t = Math.max(0, Math.min(1, t))
  let lo = STOPS[0], hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t <= STOPS[i + 1][0]) { lo = STOPS[i]; hi = STOPS[i + 1]; break }
  }
  const f = (t - lo[0]) / (hi[0] - lo[0])
  const r = Math.round(lo[1][0] + f * (hi[1][0] - lo[1][0]))
  const g = Math.round(lo[1][1] + f * (hi[1][1] - lo[1][1]))
  const b = Math.round(lo[1][2] + f * (hi[1][2] - lo[1][2]))
  return `rgb(${r},${g},${b})`
}

// Three concentric rings per zip simulate a gaussian falloff
const RINGS = [
  { radiusM: 2800, opacity: 0.14 },
  { radiusM: 1800, opacity: 0.20 },
  { radiusM: 900,  opacity: 0.28 },
]

export default function HeatmapLayer({ indicator }) {
  return Object.entries(MELISSA_ZIPS).flatMap(([zip, mel]) => {
    const d = ZIPS[zip] || PREDICTED_ZIPS[zip]
    if (!d) return []
    const value = d[indicator] ?? 50
    const color = toColor(value / 100)
    return RINGS.map((ring, ri) => (
      <Circle
        key={`${zip}-${ri}`}
        center={[mel.lat, mel.lng]}
        radius={ring.radiusM}
        pathOptions={{ fillColor: color, fillOpacity: ring.opacity, stroke: false }}
      />
    ))
  })
}
