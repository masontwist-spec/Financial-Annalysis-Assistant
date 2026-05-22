export const CURRENT_ANALYSIS_KEY = 'investment-gates-current-analysis'
export const WATCHLIST_KEY = 'investment-gates-watchlist'

export const readWatchlist = () => {
  if (typeof window === 'undefined') return []

  try {
    const savedWatchlist = window.localStorage.getItem(WATCHLIST_KEY)
    return savedWatchlist ? JSON.parse(savedWatchlist) : []
  } catch {
    return []
  }
}

export const writeWatchlist = (watchlist) => {
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
}

export const getWatchlistAnalysis = (analysisId) =>
  readWatchlist().find((analysis) => analysis.id === analysisId) ?? null

export const saveCurrentAnalysis = (analysis) => {
  window.localStorage.setItem(CURRENT_ANALYSIS_KEY, JSON.stringify(analysis))
}

export const loadCurrentAnalysis = () => {
  if (typeof window === 'undefined') return null

  try {
    const savedAnalysis = window.localStorage.getItem(CURRENT_ANALYSIS_KEY)
    return savedAnalysis ? JSON.parse(savedAnalysis) : null
  } catch {
    return null
  }
}

export const clearCurrentAnalysis = () => {
  window.localStorage.removeItem(CURRENT_ANALYSIS_KEY)
}

export const upsertWatchlistAnalysis = (analysis) => {
  const watchlist = readWatchlist()
  const existingIndex = watchlist.findIndex((item) => item.id === analysis.id)
  const nextWatchlist =
    existingIndex >= 0
      ? watchlist.map((item) => (item.id === analysis.id ? analysis : item))
      : [analysis, ...watchlist]

  writeWatchlist(nextWatchlist)
  return nextWatchlist
}
