const FRED_BASE = '/fred-api'

const fetchObservations = async (seriesId, limit, sortOrder = 'desc') => {
  const apiKey = import.meta.env.VITE_FRED_API_KEY
  if (!apiKey) throw new Error('Missing VITE_FRED_API_KEY in .env')

  const url = new URL(`${FRED_BASE}/series/observations`, window.location.origin)
  url.searchParams.set('series_id', seriesId)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('file_type', 'json')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('sort_order', sortOrder)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`FRED ${seriesId} — HTTP ${res.status}`)

  const json = await res.json()
  if (json.error_message) throw new Error(`FRED: ${json.error_message}`)

  return (json.observations ?? []).filter(o => o.value !== '.')
}

// Most recent valid observation
export const getLatest = async (seriesId) => {
  const obs = await fetchObservations(seriesId, 5)
  return obs[0] ?? null
}

// Returns `limit` observations oldest-to-newest
export const getHistory = async (seriesId, limit = 36) => {
  const obs = await fetchObservations(seriesId, limit)
  return obs.reverse()
}

// { latest, yoy } — year-over-year % change for monthly series
export const getWithYoY = async (seriesId) => {
  const obs = await fetchObservations(seriesId, 15)
  if (obs.length < 13) return { latest: obs[0] ?? null, yoy: null }

  const current = Number(obs[0].value)
  const yearAgo = Number(obs[12].value)
  const yoy = ((current - yearAgo) / Math.abs(yearAgo)) * 100

  return { latest: obs[0], yoy: yoy.toFixed(1) }
}

// Array of YoY % values over `months` months (oldest-to-newest)
export const getYoYHistory = async (seriesId, months = 36) => {
  const obs = await fetchObservations(seriesId, months + 14)
  const valid = obs.reverse()

  const result = []
  for (let i = 12; i < valid.length; i++) {
    const current = Number(valid[i].value)
    const yearAgo = Number(valid[i - 12].value)
    if (!yearAgo) continue
    result.push({
      date: valid[i].date,
      value: parseFloat(((current - yearAgo) / Math.abs(yearAgo) * 100).toFixed(2)),
    })
  }

  return result.slice(-months)
}

export const YIELD_MATURITIES = [
  { label: '1M', id: 'DGS1MO' },
  { label: '3M', id: 'DGS3MO' },
  { label: '6M', id: 'DGS6MO' },
  { label: '1Y', id: 'DGS1' },
  { label: '2Y', id: 'DGS2' },
  { label: '5Y', id: 'DGS5' },
  { label: '10Y', id: 'DGS10' },
  { label: '20Y', id: 'DGS20' },
  { label: '30Y', id: 'DGS30' },
]
