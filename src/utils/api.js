const API_BASE = 'http://localhost:8000'

/**
 * Fetch asthma predictions for one or more ZIP codes
 */
export const fetchAsthmaData = async (zipCodes) => {
  try {
    const response = await fetch(`${API_BASE}/predict-asthma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zip_codes: zipCodes })
    })
    if (!response.ok) throw new Error('Asthma prediction failed')
    return await response.json()
  } catch (error) {
    console.error('Asthma API error:', error)
    return null
  }
}

/**
 * Fetch cardiovascular predictions for one or more ZIP codes
 */
export const fetchCardioData = async (zipCodes) => {
  try {
    const response = await fetch(`${API_BASE}/predict-cardiovascular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zip_codes: zipCodes })
    })
    if (!response.ok) throw new Error('Cardiovascular prediction failed')
    return await response.json()
  } catch (error) {
    console.error('Cardio API error:', error)
    return null
  }
}

/**
 * Fetch Health Vulnerability Index for one or more ZIP codes
 */
export const fetchHVI = async (zipCodes) => {
  try {
    const response = await fetch(`${API_BASE}/get-hvi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zip_codes: zipCodes })
    })
    if (!response.ok) throw new Error('HVI fetch failed')
    return await response.json()
  } catch (error) {
    console.error('HVI API error:', error)
    return null
  }
}

/**
 * Get top 10 most vulnerable areas
 */
export const fetchTopVulnerable = async (n = 10) => {
  try {
    const response = await fetch(`${API_BASE}/top-vulnerable?n=${n}`)
    if (!response.ok) throw new Error('Top vulnerable fetch failed')
    return await response.json()
  } catch (error) {
    console.error('Top vulnerable API error:', error)
    return null
  }
}

/**
 * Get top risk asthma areas
 */
export const fetchTopAsthma = async (percentile = 90) => {
  try {
    const response = await fetch(`${API_BASE}/top-risk-asthma?percentile=${percentile}`)
    if (!response.ok) throw new Error('Top asthma fetch failed')
    return await response.json()
  } catch (error) {
    console.error('Top asthma API error:', error)
    return null
  }
}
