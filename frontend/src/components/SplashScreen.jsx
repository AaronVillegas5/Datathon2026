import { useState } from 'react'
import ZIPS from '../data/zips'
import styles from './SplashScreen.module.css'

export default function SplashScreen({ onEnter }) {
  const [zip, setZip] = useState('')
  const [error, setError] = useState('')
  const [exiting, setExiting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setExiting(true)
    // Pass null for data if not in local dataset — App will call the prediction API
    setTimeout(() => onEnter(zip, ZIPS[zip] || null), 600)
  }

  function handleChange(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5)
    setZip(val)
    if (error) setError('')
  }

  return (
    <div className={`${styles.splash} ${exiting ? styles.exit : ''}`}>
      <div className={styles.bg} />

      <div className={styles.card}>
        <div className={styles.badge}>CalEnviroScreen 4.0 · Orange County, CA</div>

        <h1 className={styles.title}>
          Healthy<br />Home Audit
        </h1>

        <p className={styles.subtitle}>
          Understand the environmental health risks in your neighborhood — from air pollution and toxic releases to asthma rates and traffic exposure.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
            <svg className={styles.pinIcon} viewBox="0 0 20 20" fill="none">
              <path d="M10 1.5C7.1 1.5 4.75 3.85 4.75 6.75c0 4.125 5.25 11.75 5.25 11.75s5.25-7.625 5.25-11.75C15.25 3.85 12.9 1.5 10 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <circle cx="10" cy="6.75" r="1.75" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              placeholder="Enter your zip code..."
              value={zip}
              onChange={handleChange}
              autoFocus
            />
            <button
              className={styles.btn}
              type="submit"
              disabled={zip.length < 5}
            >
              Explore
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <p className={styles.hint}>Try 92703 (Santa Ana) or 92660 (Newport Beach)</p>
      </div>

      <div className={styles.footer}>
        Data sourced from OEHHA · California Office of Environmental Health Hazard Assessment
      </div>
    </div>
  )
}
