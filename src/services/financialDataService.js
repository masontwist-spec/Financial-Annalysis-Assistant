const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3'

export const mockFinancialSnapshot = {
  price: '$190.50',
  marketCap: '$2.9T',
  revenue: '$394.3B',
  revenueGrowth: '6.4%',
  grossMargin: '44.1%',
  operatingMargin: '30.8%',
  netIncome: '$97.0B',
  freeCashFlow: '$99.6B',
  roic: '31.2%',
  debtToEbitda: '0.8x',
  interestCoverage: '28.4x',
  peRatio: '29.7x',
  evToEbitda: '22.1x',
  freeCashFlowYield: '3.4%',
  revenueStability: 'Not available',
  dataSource: 'Manual / Mock Data',
  lastUpdated: null,
}

const normalizeTicker = (ticker) => ticker?.trim().toUpperCase()

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(Number(value))) return null

  const absoluteValue = Math.abs(Number(value))
  const sign = Number(value) < 0 ? '-' : ''

  if (absoluteValue >= 1e12) return `${sign}$${(absoluteValue / 1e12).toFixed(2)}T`
  if (absoluteValue >= 1e9) return `${sign}$${(absoluteValue / 1e9).toFixed(2)}B`
  if (absoluteValue >= 1e6) return `${sign}$${(absoluteValue / 1e6).toFixed(2)}M`

  return `${sign}$${absoluteValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

const formatPercent = (value) => {
  if (value == null || Number.isNaN(Number(value))) return null

  const number = Number(value)
  const percent = Math.abs(number) <= 1 ? number * 100 : number

  return `${percent.toFixed(1)}%`
}

const formatMultiple = (value) => {
  if (value == null || Number.isNaN(Number(value))) return null
  return `${Number(value).toFixed(1)}x`
}

const fetchFmp = async (path, ticker, params = {}) => {
  const apiKey = import.meta.env.VITE_FMP_API_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_FMP_API_KEY.')
  }

  const normalizedTicker = normalizeTicker(ticker)

  if (!normalizedTicker) {
    throw new Error('Enter a ticker to load financial data.')
  }

  const url = new URL(`${FMP_BASE_URL}/${path}/${normalizedTicker}`)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  url.searchParams.set('apikey', apiKey)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Financial Modeling Prep request failed: ${response.status}`)
  }

  const data = await response.json()

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No Financial Modeling Prep data returned for ${normalizedTicker}.`)
  }

  return data
}

const withMockFallback = (normalizedSnapshot, error = null) => ({
  ...mockFinancialSnapshot,
  ...normalizedSnapshot,
  error,
})

export async function getFinancialSnapshot(ticker) {
  try {
    if (!normalizeTicker(ticker)) {
      return {
        ...mockFinancialSnapshot,
        lastUpdated: new Date().toISOString(),
        error: null,
      }
    }

    const [quoteData, incomeData, keyMetricsData, ratiosData] = await Promise.all([
      fetchFmp('quote', ticker),
      fetchFmp('income-statement', ticker, { period: 'annual', limit: '2' }),
      fetchFmp('key-metrics', ticker, { period: 'annual', limit: '1' }),
      fetchFmp('ratios', ticker, { period: 'annual', limit: '1' }),
    ])

    const quote = quoteData[0] ?? {}
    const latestIncome = incomeData[0] ?? {}
    const priorIncome = incomeData[1] ?? {}
    const keyMetrics = keyMetricsData[0] ?? {}
    const ratios = ratiosData[0] ?? {}
    const revenueGrowth =
      latestIncome.revenue != null && priorIncome.revenue
        ? (latestIncome.revenue - priorIncome.revenue) / priorIncome.revenue
        : null

    return withMockFallback({
      price: formatCurrency(quote.price),
      marketCap: formatCurrency(quote.marketCap),
      revenue: formatCurrency(latestIncome.revenue),
      revenueGrowth: formatPercent(revenueGrowth),
      grossMargin: formatPercent(ratios.grossProfitMargin ?? latestIncome.grossProfitRatio),
      operatingMargin: formatPercent(ratios.operatingProfitMargin ?? latestIncome.operatingIncomeRatio),
      netIncome: formatCurrency(latestIncome.netIncome),
      freeCashFlow:
        formatCurrency(keyMetrics.freeCashFlow) ??
        (keyMetrics.freeCashFlowPerShare != null ? `${formatCurrency(keyMetrics.freeCashFlowPerShare)} / share` : null),
      roic: formatPercent(keyMetrics.roic ?? ratios.returnOnCapitalEmployed),
      debtToEbitda: formatMultiple(keyMetrics.netDebtToEBITDA ?? keyMetrics.debtToEquity),
      interestCoverage: formatMultiple(ratios.interestCoverage),
      peRatio: formatMultiple(ratios.priceEarningsRatio ?? quote.pe),
      evToEbitda: formatMultiple(keyMetrics.enterpriseValueOverEBITDA),
      freeCashFlowYield: formatPercent(keyMetrics.freeCashFlowYield),
      revenueStability: incomeData.length > 1 ? 'Available' : 'Not available',
      dataSource: 'Financial Modeling Prep',
      lastUpdated: new Date().toISOString(),
      error: null,
    })
  } catch (error) {
    return withMockFallback(
      {
        dataSource: 'Manual / Mock Data',
        lastUpdated: new Date().toISOString(),
      },
      error.message,
    )
  }
}

export async function getKeyMetrics(ticker) {
  const snapshot = await getFinancialSnapshot(ticker)

  return {
    revenue: snapshot.revenue,
    revenueGrowth: snapshot.revenueGrowth,
    grossMargin: snapshot.grossMargin,
    operatingMargin: snapshot.operatingMargin,
    netIncome: snapshot.netIncome,
    freeCashFlow: snapshot.freeCashFlow,
    roic: snapshot.roic,
    debtToEbitda: snapshot.debtToEbitda,
    interestCoverage: snapshot.interestCoverage,
    revenueStability: snapshot.revenueStability,
  }
}

export async function getValuationMetrics(ticker) {
  const snapshot = await getFinancialSnapshot(ticker)

  return {
    peRatio: snapshot.peRatio,
    evToEbitda: snapshot.evToEbitda,
    freeCashFlowYield: snapshot.freeCashFlowYield,
  }
}
