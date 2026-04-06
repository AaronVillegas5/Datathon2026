export const scoreColor = (s) =>
  s >= 75 ? '#E24B4A' : s >= 50 ? '#EF9F27' : s >= 25 ? '#97C459' : '#1D9E75'

export const barColor = (s) =>
  s >= 75 ? '#E24B4A' : s >= 50 ? '#EF9F27' : s >= 25 ? '#BA7517' : '#639922'

export const scoreLabel = (s) =>
  s >= 75 ? 'Very High' : s >= 50 ? 'High' : s >= 25 ? 'Moderate' : 'Low'

export const pillClass = (s) =>
  s >= 75 ? 'pill-very-high' : s >= 50 ? 'pill-high' : s >= 25 ? 'pill-moderate' : 'pill-low'

export const suggestion = (score) => {
  if (score >= 75)
    return {
      level: 'High priority area.',
      color: '#A32D2D',
      text: 'Consider HEPA air filtration, request soil testing via OC EHS, check for lead paint if home is pre-1978, and track local industrial emissions via EPA ECHO.',
    }
  if (score >= 50)
    return {
      level: 'Moderate risk.',
      color: '#854F0B',
      text: 'Use an air purifier with a HEPA filter, check AQI before outdoor exercise, and review nearby facility permits via EPA ECHO.',
    }
  return {
    level: 'Lower burden area.',
    color: '#3B6D11',
    text: 'Maintain good ventilation and monitor AQI on high-traffic days. Review annual CES reports for trend changes.',
  }
}
