import { useState, useRef } from 'react'
import ScoreRing from './ScoreRing'
import { scoreLabel, pillClass, barColor, suggestion } from '../utils/scores'
import styles from './Sidebar.module.css'

const ETHNICITY = [
  { label: 'Hispanic/Latino', key: 'hispanic', color: '#378ADD' },
  { label: 'White',           key: 'white',    color: '#1D9E75' },
  { label: 'Asian',           key: 'asian',    color: '#BA7517' },
  { label: 'Black',           key: 'black',    color: '#D85A30' },
]

const RISKS = [
  {
    label: 'Toxic release (air)',
    key: 'toxRelease',
    title: 'Toxic Air Releases',
    description: 'Measures the toxicity-weighted concentration of chemical releases into the air from nearby industrial facilities and off-site incineration. Residents in high-scoring areas are regularly breathing air contaminated by factory emissions, which can cause respiratory illness, neurological damage, and increased cancer risk over time.',
  },
  {
    label: 'Asthma rate',
    key: 'asthma',
    title: 'Asthma Prevalence',
    description: 'Reflects the rate of emergency department visits for asthma among residents. A high score means people in this zip code are significantly more likely to suffer asthma attacks serious enough to require emergency care — often triggered by poor air quality, diesel exhaust, and indoor pollutants.',
  },
  {
    label: 'Cardiovascular disease',
    key: 'cardio',
    title: 'Cardiovascular Disease',
    description: 'Tracks the rate of heart attack and cardiovascular emergency visits among adults. Long-term exposure to air pollution, especially fine particles, causes inflammation in blood vessels and increases the risk of heart attacks and strokes. High scores indicate a community already bearing this health burden.',
  },
  {
    label: 'Low birth weight',
    key: 'lowBirth',
    title: 'Low Birth Weight',
    description: 'Measures the percentage of live births where the baby weighs less than 2,500g. Environmental pollution — including air pollutants and toxics — during pregnancy is linked to low birth weight, which raises the risk of developmental delays, chronic illness, and infant mortality.',
  },
  {
    label: 'PM2.5 (fine particles)',
    key: 'pm25',
    title: 'Fine Particulate Matter (PM2.5)',
    description: 'PM2.5 refers to microscopic particles smaller than 2.5 microns — about 30 times thinner than a human hair. These particles penetrate deep into the lungs and enter the bloodstream. Even short-term exposure causes coughing and shortness of breath; long-term exposure is linked to lung cancer, heart disease, and premature death.',
  },
  {
    label: 'Traffic density',
    key: 'traffic',
    title: 'Traffic Density',
    description: 'Measures the volume of vehicle traffic on roads near residential areas, weighted by proximity to homes. High-traffic areas are exposed to elevated levels of nitrogen oxides, diesel particulates, and carbon monoxide from exhaust. People living near busy roads face higher rates of asthma, lung disease, and cardiovascular problems — and children are especially vulnerable.',
  },
]

export default function Sidebar({ selected, onZipSearch, loading, viewMode, topVulnerable, onLoadTopVulnerable, onBackToNormal }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1>Healthy Home Audit</h1>
        <p>CalEnviroScreen 4.0 · Orange County, CA</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${viewMode === 'normal' ? styles.tabActive : ''}`}
          onClick={onBackToNormal}
        >
          Search
        </button>
        <button 
          className={`${styles.tab} ${viewMode === 'topVulnerable' ? styles.tabActive : ''}`}
          onClick={() => onLoadTopVulnerable(10)}
        >
          Top 10 Vulnerable
        </button>
      </div>

      <div className={styles.searchWrap}>
        {viewMode === 'normal' && (
          <input
            className={styles.input}
            type="text"
            placeholder="Enter zip code (e.g. 92703)..."
            maxLength={5}
            onChange={(e) => {
              if (e.target.value.length === 5) onZipSearch(e.target.value)
            }}
          />
        )}
      </div>

      <div className={styles.content}>
        {viewMode === 'topVulnerable' ? (
          loading ? (
            <div className={styles.empty}>
              <div className={styles.spinner} />
              <p>Loading vulnerable areas...</p>
            </div>
          ) : (
            <TopVulnerableList data={topVulnerable} />
          )
        ) : !selected ? (
          <div className={styles.empty}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" />
              <path d="M18 10v9l5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p>Click any marker on the map or enter a zip code to see environmental risk data.</p>
          </div>
        ) : loading ? (
          <div className={styles.empty}>
            <div className={styles.spinner} />
            <p>Loading predictions...</p>
          </div>
        ) : (
          <ZipDetail zip={selected.zip} data={selected.data} />
        )}
      </div>
    </aside>
  )
}

function RiskTooltip({ risk, value, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={styles.riskRow}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>{risk.title}</span>
            <span
              className={styles.tooltipScore}
              style={{ background: barColor(value) + '22', color: barColor(value) }}
            >
              {value}th pctl
            </span>
          </div>
          <p className={styles.tooltipBody}>{risk.description}</p>
        </div>
      )}
    </div>
  )
}

function ZipDetail({ zip, data: d }) {
  const s = suggestion(d.score)
  return (
    <div>
      <span className={styles.zipBadge}>{zip}</span>
      <p className={styles.zipName}>{d.name}</p>

      <div className={styles.ringWrap}>
        <div style={{ position: 'relative', width: 84, height: 84 }}>
          <ScoreRing score={d.score} size={84} />
          <div className={styles.ringLabel}>
            <span className={styles.scoreNum}>{d.score}</span>
            <span className={styles.scoreSub}>CES score</span>
          </div>
        </div>
        <span className={`${styles.pill} ${styles[pillClass(d.score)]}`}>
          {scoreLabel(d.score)} burden
        </span>
      </div>

      <p className={styles.sectionLabel}>
        Health risk indicators
        <span className={styles.hoverHint}>hover for details</span>
      </p>

      {RISKS.map((risk) => (
        <RiskTooltip key={risk.key} risk={risk} value={d[risk.key]}>
          <span className={styles.riskLabel}>
            {risk.label}
            <svg className={styles.infoIcon} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 6.5v3.5M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </span>
          <div className={styles.barWrap}>
            <div className={styles.bar} style={{ width: `${d[risk.key]}%`, background: barColor(d[risk.key]) }} />
          </div>
          <span className={styles.riskVal}>{d[risk.key]}</span>
        </RiskTooltip>
      ))}

      <p className={styles.sectionLabel}>Demographics</p>
      <div className={styles.demoGrid}>
        <DemoCard label="Total population" value={d.totalPop?.toLocaleString()} />
        <DemoCard
          label="Poverty pctl"
          value={`${d.poverty}`}
          tooltip="Percentage of the population living below twice the federal poverty level. High poverty percentiles indicate communities with fewer resources to cope with environmental hazards — and are a key factor in CalEnviroScreen's cumulative vulnerability score."
        />
        <DemoCard
          label="Education pctl"
          value={`${d.education}`}
          tooltip="Percentage of adults over 25 without a high school diploma, expressed as a statewide percentile. Lower educational attainment correlates with reduced access to environmental health information, fewer job options away from industrial areas, and higher overall vulnerability to pollution impacts."
        />
        <DemoCard label="Census tracts"    value={d.tractCount} />
      </div>

      <p className={styles.sectionLabel} style={{ marginTop: 12 }}>Ethnicity</p>
      {ETHNICITY.map(({ label, key, color }) => (
        <div key={key} className={styles.ethRow}>
          <span className={styles.ethLabel}>{label}</span>
          <div className={styles.ethBarWrap}>
            <div style={{ width: `${d[key]}%`, height: '100%', background: color, borderRadius: 2 }} />
          </div>
          <span className={styles.ethVal}>{d[key]}%</span>
        </div>
      ))}

      {(d.asthma || d.cardio) && (
        <>
          <p className={styles.sectionLabel}>AI-Powered Risk Predictions</p>
          {d.asthma && (
            <div className={styles.predictionCard}>
              <div className={styles.predHeader}>
                <span>Asthma Risk</span>
                <span style={{
                  fontSize: 12,
                  background: '#E24B4A22',
                  color: '#E24B4A',
                  padding: '2px 6px',
                  borderRadius: 3
                }}>
                  {Math.round(d.asthma.state_percentile_asthma)}th pctl
                </span>
              </div>
              <div className={styles.predValue}>
                {d.asthma.pred_asthma?.toFixed(1)}
              </div>
              <div className={styles.predDetails}>
                <div>State: {d.asthma.state_percentile_asthma?.toFixed(0)}%</div>
                <div>County: {d.asthma.county_percentile_asthma?.toFixed(0)}%</div>
              </div>
            </div>
          )}
          {d.cardio && (
            <div className={styles.predictionCard}>
              <div className={styles.predHeader}>
                <span>Cardiovascular Risk</span>
                <span style={{
                  fontSize: 12,
                  background: '#D85A3022',
                  color: '#D85A30',
                  padding: '2px 6px',
                  borderRadius: 3
                }}>
                  {Math.round(d.cardio.state_percentile_cardio)}th pctl
                </span>
              </div>
              <div className={styles.predValue}>
                {d.cardio.pred_cardio?.toFixed(1)}
              </div>
              <div className={styles.predDetails}>
                <div>State: {d.cardio.state_percentile_cardio?.toFixed(0)}%</div>
                <div>County: {d.cardio.county_percentile_cardio?.toFixed(0)}%</div>
              </div>
            </div>
          )}
        </>
      )}

      {d.hvi && (
        <>
          <p className={styles.sectionLabel}>Health Vulnerability Index</p>
          <div className={styles.hviCard}>
            <div className={styles.hviHeader}>
              <span>HVI Score</span>
            </div>
            <div className={styles.hviValue}>
              {d.hvi.HVI?.toFixed(2)}
            </div>
            <div className={styles.hviDetails}>
              <div>Percentile: {d.hvi.HVI_Pctl?.toFixed(1)}%</div>
            </div>
          </div>
        </>
      )}

      <p className={styles.sectionLabel}>Resilience suggestions</p>
      <div className={styles.suggestion}>
        <strong style={{ color: s.color }}>{s.level}</strong> {s.text}
      </div>
    </div>
  )
}

function TopVulnerableList({ data }) {
  return (
    <>
      <p style={{ fontSize: 12, color: '#666', padding: '12px 0 8px', margin: 0 }}>
        Top 10 Most Vulnerable ZIP Codes by HVI Score
      </p>
      {data && data.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.map((item, idx) => (
            <div key={idx} className={styles.vulnerableItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>
                  #{idx + 1} {item.ZIP}
                </span>
                <span style={{
                  fontSize: 11,
                  background: '#E24B4A22',
                  color: '#E24B4A',
                  padding: '2px 6px',
                  borderRadius: 3
                }}>
                  {item.HVI?.toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: 10, color: '#999', marginBottom: 3 }}>
                {item['California County']} County
              </div>
              <div style={{ fontSize: 10, color: '#666', lineHeight: 1.4 }}>
                <div>Asthma Risk: {item.pred_asthma?.toFixed(1)} ({item.state_percentile_asthma?.toFixed(0)}th pctl)</div>
                <div>Cardio Risk: {item.pred_cardio?.toFixed(1)} ({item.state_percentile_cardio?.toFixed(0)}th pctl)</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#999', fontSize: 11 }}>No vulnerability data available</p>
      )}
    </>
  )
}

function DemoCard({ label, value, tooltip }) {
  const [pos, setPos] = useState(null)
  const cardRef = useRef(null)

  function handleMouseEnter() {
    if (!tooltip || !cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    setPos({ top: r.top, left: r.left, width: r.width })
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.demoCard} ${tooltip ? styles.demoCardTip : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setPos(null)}
    >
      <p className={styles.demoLabel}>
        {label}
        {tooltip && (
          <svg className={styles.infoIcon} viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 6.5v3.5M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </p>
      <p className={styles.demoVal}>{value}</p>
      {pos && (
        <div
          className={styles.demoTooltip}
          style={{ top: pos.top - 8, left: pos.left, width: pos.width }}
        >
          <p className={styles.tooltipBody}>{tooltip}</p>
        </div>
      )}
    </div>
  )
}