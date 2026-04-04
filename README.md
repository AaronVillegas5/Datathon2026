# Healthy Home Audit

An environmental justice tool built with React + Leaflet using CalEnviroScreen 4.0 data for Orange County, CA.

## Features

- Interactive map with real OpenStreetMap tiles via Leaflet
- Color-coded zip code markers by CES 4.0 burden level (green → red)
- Sidebar with health risk indicators, demographics, ethnicity breakdown, and AI resilience suggestions
- Zip code search

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── MapView.jsx        # Leaflet map with markers
│   ├── Sidebar.jsx        # Left panel with zip data
│   ├── Sidebar.module.css
│   └── ScoreRing.jsx      # Canvas ring chart
├── data/
│   └── zips.js            # CalEnviroScreen zip data (replace with full CSV)
├── utils/
│   └── scores.js          # Color, label, suggestion helpers
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Extending with Real CSV Data

The `src/data/zips.js` file contains a representative sample. To load your full CalEnviroScreen CSV:

1. Place your CSV in `public/calenviroscreen.csv`
2. In `App.jsx`, fetch and parse it with [PapaParse](https://www.papaparse.com/):

```js
import Papa from 'papaparse'

useEffect(() => {
  Papa.parse('/calenviroscreen.csv', {
    download: true,
    header: true,
    complete: ({ data }) => {
      const zips = {}
      data.forEach(row => {
        zips[row['ZIP']] = {
          name: row['California County'],
          score: parseFloat(row['CES 4.0 Score']),
          // ... map other columns
        }
      })
      setZips(zips)
    }
  })
}, [])
```

## Next Steps for Datathon

- [ ] Load full CalEnviroScreen CSV via PapaParse
- [ ] Add GeoJSON zip polygon boundaries for true choropleth shading
- [ ] Integrate Anthropic Claude API for dynamic AI resilience suggestions
- [ ] Add filter controls (score range slider, highlight high-burden areas)
- [ ] Add charts (recharts) for historical trend data

## Data Sources

- [CalEnviroScreen 4.0](https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40)
- [EPA ECHO](https://echo.epa.gov)
- [PurpleAir API](https://www2.purpleair.com)
- [OpenStreetMap](https://www.openstreetmap.org)
