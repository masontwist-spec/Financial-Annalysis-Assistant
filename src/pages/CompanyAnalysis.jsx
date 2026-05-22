import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import GateCard from '../components/GateCard'
import { gates } from '../data/gates'
import {
  clearCurrentAnalysis,
  getWatchlistAnalysis,
  loadCurrentAnalysis,
  saveCurrentAnalysis,
  upsertWatchlistAnalysis,
} from '../utils/analysisStorage'
import {
  getFinancialSnapshot,
  mockFinancialSnapshot,
  resolveCompanySearch,
} from '../services/financialDataService'

const gateWeights = {
  'industry-durability': 0.2,
  'competitive-advantage': 0.2,
  'business-model-quality': 0.2,
  'management-capital-allocation': 0.15,
  'financial-strength': 0.1,
  valuation: 0.1,
  'risk-assessment': 0.05,
}

const defaultCompanyInfo = {
  ticker: '',
  companyName: '',
  industry: '',
  thesis: '',
  competitors: '',
  currentPrice: '',
  marketCap: '',
}

const defaultInvestmentMemo = {
  companyOverview: '',
  scoreSummary: '',
  gateSummary: '',
  bullThesis: '',
  bearThesis: '',
  keyRisks: '',
  finalDecision: 'Research More',
}

const financialSnapshotSections = [
  {
    title: 'Growth & Scale',
    metrics: [
      { label: 'Revenue', key: 'revenue' },
      { label: 'Revenue growth', key: 'revenueGrowth' },
      { label: 'Net income', key: 'netIncome' },
      { label: 'Free cash flow', key: 'freeCashFlow' },
    ],
  },
  {
    title: 'Profitability',
    metrics: [
      { label: 'Gross margin', key: 'grossMargin' },
      { label: 'Operating margin', key: 'operatingMargin' },
      { label: 'ROIC', key: 'roic' },
    ],
  },
  {
    title: 'Balance Sheet',
    metrics: [
      { label: 'Debt / EBITDA', key: 'debtToEbitda' },
      { label: 'Interest coverage', key: 'interestCoverage' },
    ],
  },
  {
    title: 'Valuation',
    metrics: [
      { label: 'P/E ratio', key: 'peRatio' },
      { label: 'EV / EBITDA', key: 'evToEbitda' },
      { label: 'FCF yield', key: 'freeCashFlowYield' },
    ],
  },
]

const getEvidenceLabel = (metricKey, rawValue) => {
  const value = Number.parseFloat(rawValue)

  if (Number.isNaN(value)) return 'Watch'

  if (metricKey === 'grossMargin') {
    if (value >= 50) return 'Strong'
    if (value >= 35) return 'Healthy'
    if (value >= 20) return 'Watch'
    return 'Weak'
  }

  if (metricKey === 'operatingMargin') {
    if (value >= 25) return 'Strong'
    if (value >= 15) return 'Healthy'
    if (value >= 8) return 'Watch'
    return 'Weak'
  }

  if (metricKey === 'roic') {
    if (value >= 20) return 'Strong'
    if (value >= 12) return 'Healthy'
    if (value >= 7) return 'Watch'
    return 'Weak'
  }

  if (metricKey === 'debtToEbitda') {
    if (value <= 1) return 'Strong'
    if (value <= 2.5) return 'Healthy'
    if (value <= 4) return 'Watch'
    return 'Weak'
  }

  if (metricKey === 'interestCoverage') {
    if (value >= 15) return 'Strong'
    if (value >= 6) return 'Healthy'
    if (value >= 3) return 'Watch'
    return 'Weak'
  }

  if (metricKey === 'peRatio' || metricKey === 'evToEbitda') {
    if (value <= 15) return 'Strong'
    if (value <= 25) return 'Healthy'
    if (value <= 40) return 'Watch'
    return 'Weak'
  }

  if (metricKey === 'freeCashFlowYield') {
    if (value >= 5) return 'Strong'
    if (value >= 3) return 'Healthy'
    if (value >= 1.5) return 'Watch'
    return 'Weak'
  }

  return 'Healthy'
}

const evidenceExplanations = {
  grossMargin: 'Gross margin helps show pricing power, product mix quality, and room to absorb cost pressure.',
  operatingMargin: 'Operating margin shows how efficiently revenue converts into operating profit after core expenses.',
  freeCashFlow: 'Free cash flow indicates whether accounting earnings are converting into cash that can be reinvested or returned.',
  roic: 'ROIC helps judge whether the company earns attractive returns on the capital required to operate.',
  debtToEbitda: 'Debt / EBITDA gives a quick view of leverage relative to operating cash earnings.',
  interestCoverage: 'Interest coverage helps assess whether operating profit can comfortably service debt costs.',
  revenueStability: 'Revenue stability is useful for judging cyclicality, customer durability, and downside resilience.',
  peRatio: 'P/E ratio gives a quick read on the market price relative to current earnings power.',
  evToEbitda: 'EV / EBITDA helps compare valuation across companies with different capital structures.',
  freeCashFlowYield: 'Free cash flow yield compares cash generation to market value and can indicate margin of safety.',
}

const evidenceLabels = {
  grossMargin: 'Gross margin',
  operatingMargin: 'Operating margin',
  freeCashFlow: 'Free cash flow',
  roic: 'ROIC',
  debtToEbitda: 'Debt / EBITDA',
  interestCoverage: 'Interest coverage',
  revenueStability: 'Revenue stability',
  peRatio: 'P/E ratio',
  evToEbitda: 'EV / EBITDA',
  freeCashFlowYield: 'Free cash flow yield',
}

const buildSuggestedEvidence = (financialData) => {
  const createEvidence = (metricKey, fallbackValue = null) => {
    const value = financialData[metricKey] ?? fallbackValue ?? 'Not available'

    return {
      name: evidenceLabels[metricKey],
      value,
      label: getEvidenceLabel(metricKey, value),
      explanation: evidenceExplanations[metricKey],
    }
  }

  return {
    'business-model-quality': [
      createEvidence('grossMargin'),
      createEvidence('operatingMargin'),
      createEvidence('freeCashFlow'),
      createEvidence('roic'),
    ],
    'financial-strength': [
      createEvidence('debtToEbitda'),
      createEvidence('interestCoverage'),
      createEvidence('freeCashFlow'),
      createEvidence('revenueStability', 'Not available'),
    ],
    valuation: [
      createEvidence('peRatio'),
      createEvidence('evToEbitda'),
      createEvidence('freeCashFlowYield'),
    ],
  }
}

const defaultAnalysis = {
  id: null,
  gateEvaluations: gates,
  companyInfo: defaultCompanyInfo,
  investmentMemo: defaultInvestmentMemo,
  memoEdited: false,
  savedAt: null,
}

const mergeSavedGates = (savedGates = []) =>
  gates.map((gate) => {
    const savedGate = savedGates.find((item) => item.id === gate.id)

    return savedGate ? { ...gate, ...savedGate } : gate
  })

const hydrateAnalysis = (savedAnalysis) => {
  if (!savedAnalysis) return defaultAnalysis

  return {
    id: savedAnalysis.id ?? null,
    gateEvaluations: mergeSavedGates(savedAnalysis.gateEvaluations),
    companyInfo: { ...defaultCompanyInfo, ...savedAnalysis.companyInfo },
    investmentMemo: { ...defaultInvestmentMemo, ...savedAnalysis.investmentMemo },
    memoEdited: Boolean(savedAnalysis.memoEdited),
    savedAt: savedAnalysis.savedAt ?? null,
  }
}

const loadSavedAnalysis = (analysisId) =>
  hydrateAnalysis(analysisId ? getWatchlistAnalysis(analysisId) : loadCurrentAnalysis())

const getInvestmentClassification = (score) => {
  if (score >= 85) return 'Elite Compounder'
  if (score >= 70) return 'Strong Candidate'
  if (score >= 55) return 'Watchlist / Needs Work'
  if (score >= 40) return 'Speculative'
  return 'Avoid'
}

const getFinalDecision = (score, concernFailGates) => {
  if (score < 40) return 'Avoid'
  if (score >= 70 && concernFailGates <= 1) return 'Buy'
  if (score >= 55) return 'Watchlist'
  return 'Research More'
}

const isGateComplete = (gate) => gate.score != null && gate.confidenceLevel && gate.status !== 'Neutral'

const formatGateLine = (gate) => {
  const score = gate.score != null ? `${gate.score}/10` : 'TBD'
  const confidence = gate.confidenceLevel ? gate.confidenceLevel : 'unassigned'
  const notes = gate.notes ? ` Notes: ${gate.notes}` : ''
  const redFlags = gate.redFlags?.length ? ` Red flags: ${gate.redFlags.join('; ')}` : ''

  return `${gate.title}: ${gate.status}, score ${score}, confidence ${confidence}.${notes}${redFlags}`
}

const buildInvestmentMemo = ({
  companyInfo,
  competitorsList,
  gateEvaluations,
  compositeScore,
  classification,
  finalDecision,
}) => {
  const companyName = companyInfo.companyName || 'This company'
  const ticker = companyInfo.ticker ? ` (${companyInfo.ticker})` : ''
  const industry = companyInfo.industry || 'an unspecified industry'
  const competitorText = competitorsList.length ? competitorsList.join(', ') : 'not entered'
  const passedGates = gateEvaluations.filter((gate) => ['Strong Pass', 'Pass'].includes(gate.status))
  const concernGates = gateEvaluations.filter((gate) => ['Concern', 'Fail'].includes(gate.status))
  const riskGate = gateEvaluations.find((gate) => gate.id === 'risk-assessment')
  const allRedFlags = gateEvaluations.flatMap((gate) => gate.redFlags ?? [])
  const strongestGates = passedGates.length
    ? passedGates.map((gate) => `${gate.title} (${gate.status})`).join(', ')
    : 'No gates are currently marked as passed.'
  const weakestGates = concernGates.length
    ? concernGates.map((gate) => `${gate.title} (${gate.status})`).join(', ')
    : 'No gates are currently marked Concern or Fail.'

  return {
    companyOverview: `${companyName}${ticker} operates in ${industry}. Current price: ${
      companyInfo.currentPrice || 'not entered'
    }. Market cap: ${companyInfo.marketCap || 'not entered'}. Key competitors: ${competitorText}.`,
    scoreSummary: `Final composite score: ${compositeScore}/100. Classification: ${classification}. Final decision: ${finalDecision}.`,
    gateSummary: gateEvaluations.map(formatGateLine).join('\n'),
    bullThesis: companyInfo.thesis
      ? `${companyInfo.thesis}\n\nStrongest supporting gates: ${strongestGates}.`
      : `Bull case is not fully written yet. Strongest supporting gates: ${strongestGates}.`,
    bearThesis: `Primary pushback: ${weakestGates}. ${
      allRedFlags.length ? `Red flags to investigate: ${allRedFlags.join('; ')}.` : 'No red flags have been entered yet.'
    }`,
    keyRisks: riskGate
      ? formatGateLine(riskGate)
      : 'Risk assessment gate has not been configured yet.',
    finalDecision,
  }
}

function CompanyAnalysis() {
  const { analysisId: routeAnalysisId } = useParams()
  const initialAnalysis = useMemo(() => loadSavedAnalysis(routeAnalysisId), [routeAnalysisId])
  const [analysisId, setAnalysisId] = useState(initialAnalysis.id)
  const [gateEvaluations, setGateEvaluations] = useState(initialAnalysis.gateEvaluations)
  const [companyInfo, setCompanyInfo] = useState(initialAnalysis.companyInfo)
  const [memoEdited, setMemoEdited] = useState(initialAnalysis.memoEdited)
  const [investmentMemo, setInvestmentMemo] = useState(initialAnalysis.investmentMemo)
  const [savedAt, setSavedAt] = useState(initialAnalysis.savedAt)
  const [storageMessage, setStorageMessage] = useState(initialAnalysis.savedAt ? 'Saved analysis loaded.' : '')
  const [financialSnapshot, setFinancialSnapshot] = useState(mockFinancialSnapshot)
  const [financialDataLoading, setFinancialDataLoading] = useState(false)
  const [financialDataError, setFinancialDataError] = useState('')
  const [companySearchInput, setCompanySearchInput] = useState(
    initialAnalysis.companyInfo.ticker || initialAnalysis.companyInfo.companyName || '',
  )
  const [companyLookupLoading, setCompanyLookupLoading] = useState(false)
  const [companyLookupError, setCompanyLookupError] = useState('')

  useEffect(() => {
    setAnalysisId(initialAnalysis.id)
    setGateEvaluations(initialAnalysis.gateEvaluations)
    setCompanyInfo(initialAnalysis.companyInfo)
    setMemoEdited(initialAnalysis.memoEdited)
    setInvestmentMemo(initialAnalysis.investmentMemo)
    setSavedAt(initialAnalysis.savedAt)
    setStorageMessage(initialAnalysis.savedAt ? 'Saved analysis loaded.' : '')
    setCompanySearchInput(initialAnalysis.companyInfo.ticker || initialAnalysis.companyInfo.companyName || '')
  }, [initialAnalysis])

  const updateGate = (gateId, updates) => {
    setGateEvaluations((currentGates) =>
      currentGates.map((gate) => (gate.id === gateId ? { ...gate, ...updates } : gate)),
    )
  }

  const updateCompanyInfo = (field, value) => {
    setCompanyInfo((currentInfo) => ({
      ...currentInfo,
      [field]: value,
    }))
  }

  const compositeScore = Math.round(
    gateEvaluations.reduce((total, gate) => {
      const weight = gateWeights[gate.id] ?? 0
      const score = gate.score ?? 0

      return total + score * 10 * weight
    }, 0),
  )
  const classification = getInvestmentClassification(compositeScore)
  const gatesPassed = gateEvaluations.filter((gate) => ['Strong Pass', 'Pass'].includes(gate.status)).length
  const concernFailGates = gateEvaluations.filter((gate) => ['Concern', 'Fail'].includes(gate.status)).length
  const finalDecision = getFinalDecision(compositeScore, concernFailGates)
  const completedGates = gateEvaluations.filter(isGateComplete).length
  const progressPercent = Math.round((completedGates / gateEvaluations.length) * 100)
  const competitorsList = useMemo(
    () =>
      companyInfo.competitors
        .split(',')
        .map((competitor) => competitor.trim())
        .filter(Boolean),
    [companyInfo.competitors],
  )
  const suggestedEvidenceByGate = useMemo(
    () => buildSuggestedEvidence(financialSnapshot),
    [financialSnapshot],
  )
  const generatedMemo = useMemo(
    () =>
      buildInvestmentMemo({
        companyInfo,
        competitorsList,
        gateEvaluations,
        compositeScore,
        classification,
        finalDecision,
      }),
    [companyInfo, competitorsList, gateEvaluations, compositeScore, classification, finalDecision],
  )

  useEffect(() => {
    if (!memoEdited) {
      setInvestmentMemo(generatedMemo)
    }
  }, [generatedMemo, memoEdited])

  const loadFinancialData = async (ticker = companyInfo.ticker) => {
    setFinancialDataLoading(true)
    setFinancialDataError('')

    const snapshot = await getFinancialSnapshot(ticker)

    setFinancialSnapshot(snapshot)
    setFinancialDataError(snapshot.error ?? '')
    setFinancialDataLoading(false)

    return snapshot
  }

  useEffect(() => {
    if (initialAnalysis.companyInfo.ticker) {
      loadFinancialData(initialAnalysis.companyInfo.ticker)
    } else {
      setFinancialSnapshot(mockFinancialSnapshot)
      setFinancialDataError('')
    }
  }, [initialAnalysis])

  useEffect(() => {
    const currentAnalysis = {
      id: analysisId,
      gateEvaluations,
      companyInfo,
      investmentMemo: memoEdited ? investmentMemo : generatedMemo,
      memoEdited,
      savedAt,
      compositeScore,
      classification,
    }

    saveCurrentAnalysis(currentAnalysis)

    if (analysisId) {
      upsertWatchlistAnalysis(currentAnalysis)
    }
  }, [
    analysisId,
    gateEvaluations,
    companyInfo,
    investmentMemo,
    memoEdited,
    generatedMemo,
    savedAt,
    compositeScore,
    classification,
  ])

  const updateMemo = (field, value) => {
    setMemoEdited(true)
    setInvestmentMemo((currentMemo) => ({
      ...currentMemo,
      [field]: value,
    }))
  }

  const refreshMemo = () => {
    setInvestmentMemo(generatedMemo)
    setMemoEdited(false)
    setStorageMessage('Memo preview generated from current inputs.')
  }

  const startAnalysis = async (event) => {
    event.preventDefault()

    const query = companySearchInput.trim()

    if (!query) {
      setCompanyLookupError('Enter a company name or ticker to start.')
      return
    }

    setCompanyLookupLoading(true)
    setCompanyLookupError('')

    try {
      const resolvedCompany = await resolveCompanySearch(query)

      setCompanyInfo((currentInfo) => ({
        ...currentInfo,
        ticker: resolvedCompany.symbol,
        companyName: resolvedCompany.name || currentInfo.companyName || query,
      }))

      const snapshot = await loadFinancialData(resolvedCompany.symbol)

      setCompanyInfo((currentInfo) => ({
        ...currentInfo,
        ticker: resolvedCompany.symbol,
        companyName: resolvedCompany.name || currentInfo.companyName || query,
        currentPrice: snapshot.price || currentInfo.currentPrice,
        marketCap: snapshot.marketCap || currentInfo.marketCap,
      }))

      setStorageMessage(`Analysis started for ${resolvedCompany.symbol}.`)

      if (resolvedCompany.warning) {
        setCompanyLookupError(`${resolvedCompany.warning} Using "${resolvedCompany.symbol}" as a manual ticker fallback.`)
      }
    } catch (error) {
      setCompanyLookupError(error.message)
    } finally {
      setCompanyLookupLoading(false)
    }
  }

  const createAnalysisId = () => {
    const identity = companyInfo.ticker || companyInfo.companyName || 'analysis'
    const slug = identity
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    return `${slug || 'analysis'}-${Date.now()}`
  }

  const saveAnalysis = () => {
    const nextSavedAt = new Date().toISOString()
    const nextAnalysisId = analysisId || createAnalysisId()
    const memoToSave = memoEdited ? investmentMemo : generatedMemo
    const analysisToSave = {
      id: nextAnalysisId,
      gateEvaluations,
      companyInfo,
      investmentMemo: memoToSave,
      memoEdited,
      savedAt: nextSavedAt,
      compositeScore,
      classification,
    }

    saveCurrentAnalysis(analysisToSave)
    upsertWatchlistAnalysis(analysisToSave)
    setAnalysisId(nextAnalysisId)
    setInvestmentMemo(memoToSave)
    setSavedAt(nextSavedAt)
    setStorageMessage('Analysis saved locally and added to Watchlist.')
  }

  const clearAnalysis = () => {
    clearCurrentAnalysis()
    setAnalysisId(null)
    setGateEvaluations(gates)
    setCompanyInfo(defaultCompanyInfo)
    setInvestmentMemo(defaultInvestmentMemo)
    setMemoEdited(false)
    setSavedAt(null)
    setFinancialSnapshot(mockFinancialSnapshot)
    setFinancialDataError('')
    setCompanySearchInput('')
    setCompanyLookupError('')
    setStorageMessage('Analysis reset.')
  }

  const savedAtLabel = savedAt ? new Date(savedAt).toLocaleString() : 'Not saved yet'
  const financialLastUpdatedLabel = financialSnapshot.lastUpdated
    ? new Date(financialSnapshot.lastUpdated).toLocaleString()
    : 'Not loaded yet'

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Analysis Workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Build a professional equity research report
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Start with company context, score each investment gate, and generate a memo preview from your own inputs.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Local workspace</p>
            <p className="mt-2 text-sm font-medium text-slate-700">Last saved: {savedAtLabel}</p>
            {storageMessage ? <p className="mt-1 text-sm font-semibold text-emerald-700">{storageMessage}</p> : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveAnalysis}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Save analysis
              </button>
              <button
                type="button"
                onClick={clearAnalysis}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-700"
              >
                Reset Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="pixel-panel overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Research report setup</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Company input</h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter a ticker or company name, submit it, then begin the gate analysis workflow.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <form onSubmit={startAnalysis} className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <label className="block">
              <span className="text-sm font-semibold text-emerald-900">Start a company analysis</span>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  value={companySearchInput}
                  onChange={(event) => setCompanySearchInput(event.target.value)}
                  placeholder="Enter ticker or company name, e.g. AAPL or Apple"
                  className="min-w-0 flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
                <button
                  type="submit"
                  disabled={companyLookupLoading || financialDataLoading}
                  className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
                >
                  {companyLookupLoading || financialDataLoading ? 'Starting...' : 'Start Analysis'}
                </button>
              </div>
            </label>
            {companyLookupError ? (
              <p className="mt-3 text-sm font-semibold text-amber-800">{companyLookupError}</p>
            ) : (
              <p className="mt-3 text-sm text-emerald-900">
                This resolves the company, loads available financial data, and keeps gate scoring manual.
              </p>
            )}
          </form>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700">Ticker</span>
              <input
                value={companyInfo.ticker}
                onChange={(event) => updateCompanyInfo('ticker', event.target.value.toUpperCase())}
                placeholder="AAPL"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700">Company name</span>
              <input
                value={companyInfo.companyName}
                onChange={(event) => updateCompanyInfo('companyName', event.target.value)}
                placeholder="Apple Inc."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700">Industry</span>
              <input
                value={companyInfo.industry}
                onChange={(event) => updateCompanyInfo('industry', event.target.value)}
                placeholder="Consumer Technology"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700">Competitors</span>
              <input
                value={companyInfo.competitors}
                onChange={(event) => updateCompanyInfo('competitors', event.target.value)}
                placeholder="MSFT, GOOGL, Samsung"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700">Current price</span>
              <input
                value={companyInfo.currentPrice}
                onChange={(event) => updateCompanyInfo('currentPrice', event.target.value)}
                placeholder="$190.50"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700">Market cap</span>
              <input
                value={companyInfo.marketCap}
                onChange={(event) => updateCompanyInfo('marketCap', event.target.value)}
                placeholder="$2.9T"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="block text-sm font-semibold text-slate-700">Brief personal thesis</span>
              <textarea
                value={companyInfo.thesis}
                onChange={(event) => updateCompanyInfo('thesis', event.target.value)}
                rows="5"
                placeholder="Why this company may deserve capital..."
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Company snapshot</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-4xl font-semibold uppercase text-slate-950">
                  {companyInfo.ticker || 'TICKER'}
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-800">
                  {companyInfo.companyName || 'Company name'}
                </p>
              </div>

              <dl className="grid gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Industry</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{companyInfo.industry || 'Not entered'}</dd>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Price</dt>
                    <dd className="mt-1 font-semibold text-slate-950">{companyInfo.currentPrice || 'TBD'}</dd>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Market cap</dt>
                    <dd className="mt-1 font-semibold text-slate-950">{companyInfo.marketCap || 'TBD'}</dd>
                  </div>
                </div>
              </dl>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Competitors</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {competitorsList.length > 0 ? (
                    competitorsList.map((competitor) => (
                      <span key={competitor} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">
                        {competitor}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-slate-500">No competitors entered</span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Personal thesis</p>
                <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-slate-700">
                  {companyInfo.thesis || 'No thesis entered yet.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
        </div>
      </section>

      <section className="pixel-panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Financial Snapshot</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {companyInfo.ticker || companyInfo.companyName ? `${companyInfo.ticker || companyInfo.companyName} fundamentals` : 'Mock fundamentals'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Live-ready financial profile with mock fallback when the API is unavailable.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <span
              className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-semibold ${
                financialSnapshot.dataSource === 'Financial Modeling Prep'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              Data Source: {financialSnapshot.dataSource}
            </span>
            <p className="text-xs font-medium text-slate-500">Last Updated: {financialLastUpdatedLabel}</p>
            <button
              type="button"
              onClick={() => loadFinancialData()}
              disabled={financialDataLoading}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {financialDataLoading ? 'Loading financial data...' : 'Refresh Financial Data'}
            </button>
          </div>
        </div>

        {(financialDataLoading || financialDataError) && (
          <div className="border-b border-slate-200 px-6 py-3">
            {financialDataLoading ? (
              <p className="text-sm font-semibold text-slate-600">Loading financial data...</p>
            ) : (
              <p className="text-sm font-semibold text-amber-700">
                Financial Modeling Prep request failed. Showing mock fallback data. {financialDataError}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 p-6 xl:grid-cols-4">
          {financialSnapshotSections.map((section) => (
            <article key={section.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{section.title}</h3>
              <dl className="mt-5 space-y-4">
                {section.metrics.map((metric) => (
                  <div key={metric.key} className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <dt className="text-sm font-medium text-slate-600">{metric.label}</dt>
                    <dd className="text-right text-lg font-semibold text-slate-950">{financialSnapshot[metric.key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="pixel-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Gate progress</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                {completedGates} of {gateEvaluations.length} gates complete
              </h2>
            </div>
            <p className="text-4xl font-semibold text-emerald-700">{progressPercent}%</p>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-600">A gate is complete when it has a non-neutral status, score, and confidence level.</p>
        </div>

        <div className="pixel-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace controls</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={refreshMemo}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Generate Memo Preview
            </button>
            <button
              type="button"
              onClick={saveAnalysis}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Save to Watchlist
            </button>
            <button
              type="button"
              onClick={clearAnalysis}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-700"
            >
              Reset Analysis
            </button>
          </div>
        </div>
      </section>

      <section className="pixel-panel overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Composite score</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Investment quality summary</h2>
        </div>

        <div className="grid gap-4 p-6 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="rounded-xl bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Final score</p>
            <p className="mt-3 text-6xl font-semibold leading-none">{compositeScore}</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">/ 100</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Classification</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{classification}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Gates passed</p>
            <p className="mt-3 text-5xl font-semibold text-emerald-700">{gatesPassed}</p>
            <p className="mt-2 text-sm font-medium text-slate-600">Strong Pass or Pass</p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Concern / Fail</p>
            <p className="mt-3 text-5xl font-semibold text-amber-800">{concernFailGates}</p>
            <p className="mt-2 text-sm font-medium text-amber-800">Gates needing attention</p>
          </div>
        </div>
      </section>

      <section id="investment-memo" className="pixel-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Investment memo</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Memo preview</h2>
          </div>
          <button
            type="button"
            onClick={refreshMemo}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Generate Memo Preview
          </button>
        </div>

        <div className="grid gap-4 p-6 xl:grid-cols-2">
          <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-sm font-semibold text-slate-700">Company overview</span>
            <textarea
              value={investmentMemo.companyOverview}
              onChange={(event) => updateMemo('companyOverview', event.target.value)}
              rows="4"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-sm font-semibold text-slate-700">Final score & classification</span>
            <textarea
              value={investmentMemo.scoreSummary}
              onChange={(event) => updateMemo('scoreSummary', event.target.value)}
              rows="4"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 xl:col-span-2">
            <span className="block text-sm font-semibold text-slate-700">Gate-by-gate summary</span>
            <textarea
              value={investmentMemo.gateSummary}
              onChange={(event) => updateMemo('gateSummary', event.target.value)}
              rows="8"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-sm font-semibold text-slate-700">Bull thesis</span>
            <textarea
              value={investmentMemo.bullThesis}
              onChange={(event) => updateMemo('bullThesis', event.target.value)}
              rows="6"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-sm font-semibold text-slate-700">Bear thesis</span>
            <textarea
              value={investmentMemo.bearThesis}
              onChange={(event) => updateMemo('bearThesis', event.target.value)}
              rows="6"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-sm font-semibold text-slate-700">Key risks</span>
            <textarea
              value={investmentMemo.keyRisks}
              onChange={(event) => updateMemo('keyRisks', event.target.value)}
              rows="5"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <span className="block text-sm font-semibold text-emerald-800">Final decision</span>
            <select
              value={investmentMemo.finalDecision}
              onChange={(event) => updateMemo('finalDecision', event.target.value)}
              className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 font-semibold text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {['Buy', 'Watchlist', 'Avoid', 'Research More'].map((decision) => (
                <option key={decision} value={decision}>
                  {decision}
                </option>
              ))}
            </select>
            <p className="mt-4 rounded-lg border border-emerald-200 bg-white p-4 text-3xl font-semibold text-emerald-800">{investmentMemo.finalDecision}</p>
          </label>
        </div>
      </section>

      <section className="space-y-6">
        <div className="pixel-panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Gate checklist</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Company gate review</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                View all seven investment gates and drill into questions and metrics for each evaluation area.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Status guide</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-emerald-900 px-3 py-1 text-white">Strong Pass</span>
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-white">Pass</span>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">Neutral</span>
                <span className="rounded-full bg-amber-500 px-3 py-1 text-slate-950">Concern</span>
                <span className="rounded-full bg-red-600 px-3 py-1 text-white">Fail</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {gateEvaluations.map((gate) => (
            <GateCard
              key={gate.id}
              gate={gate}
              onChange={updateGate}
              suggestedEvidence={suggestedEvidenceByGate[gate.id] ?? []}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default CompanyAnalysis
