const mockFinancialSnapshots = {
  DEFAULT: {
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
  },
}

const normalizeTicker = (ticker) => ticker?.trim().toUpperCase() || 'DEFAULT'

export const getFinancialSnapshot = (ticker) => {
  const normalizedTicker = normalizeTicker(ticker)
  const snapshot = mockFinancialSnapshots[normalizedTicker] ?? mockFinancialSnapshots.DEFAULT

  return {
    ticker: normalizedTicker === 'DEFAULT' ? null : normalizedTicker,
    dataSource: 'Manual / Mock Data',
    asOf: 'Mock period',
    ...snapshot,
  }
}

export const getKeyMetrics = (ticker) => {
  const snapshot = getFinancialSnapshot(ticker)

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

export const getValuationMetrics = (ticker) => {
  const snapshot = getFinancialSnapshot(ticker)

  return {
    peRatio: snapshot.peRatio,
    evToEbitda: snapshot.evToEbitda,
    freeCashFlowYield: snapshot.freeCashFlowYield,
  }
}
