import { useEffect, useMemo, useState } from 'react'
import GateCard from '../components/GateCard'
import { gates } from '../data/gates'

const gateWeights = {
  'industry-durability': 0.2,
  'competitive-advantage': 0.2,
  'business-model-quality': 0.2,
  'management-capital-allocation': 0.15,
  'financial-strength': 0.1,
  valuation: 0.1,
  'risk-assessment': 0.05,
}

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
  const [gateEvaluations, setGateEvaluations] = useState(gates)
  const [companyInfo, setCompanyInfo] = useState({
    ticker: '',
    companyName: '',
    industry: '',
    thesis: '',
    competitors: '',
    currentPrice: '',
    marketCap: '',
  })
  const [memoEdited, setMemoEdited] = useState(false)
  const [investmentMemo, setInvestmentMemo] = useState({
    companyOverview: '',
    scoreSummary: '',
    gateSummary: '',
    bullThesis: '',
    bearThesis: '',
    keyRisks: '',
    finalDecision: 'Research More',
  })

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
  const competitorsList = useMemo(
    () =>
      companyInfo.competitors
        .split(',')
        .map((competitor) => competitor.trim())
        .filter(Boolean),
    [companyInfo.competitors],
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
  }

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-700">Company Analysis</p>
            <h1 className="pixel-title mt-3 text-4xl font-black uppercase">Evaluate a business through investment gates</h1>
          </div>
        </div>
      </div>

      <section className="pixel-panel overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-black bg-[#fffbe6] px-4 py-3">
          <p className="pixel-title text-xl font-black lowercase">company_profile</p>
          <div className="flex gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-black bg-white" />
            <span className="h-4 w-4 rounded-full border-2 border-black bg-white" />
            <span className="h-4 w-4 rounded-full border-2 border-black bg-black" />
          </div>
        </div>

        <div className="grid gap-6 p-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
              <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Ticker</span>
              <input
                value={companyInfo.ticker}
                onChange={(event) => updateCompanyInfo('ticker', event.target.value.toUpperCase())}
                placeholder="AAPL"
                className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none placeholder:text-neutral-600 focus:bg-[#c9ff7a]"
              />
            </label>

            <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
              <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Company name</span>
              <input
                value={companyInfo.companyName}
                onChange={(event) => updateCompanyInfo('companyName', event.target.value)}
                placeholder="Apple Inc."
                className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none placeholder:text-neutral-600 focus:bg-[#c9ff7a]"
              />
            </label>

            <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
              <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Industry</span>
              <input
                value={companyInfo.industry}
                onChange={(event) => updateCompanyInfo('industry', event.target.value)}
                placeholder="Consumer Technology"
                className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none placeholder:text-neutral-600 focus:bg-[#c9ff7a]"
              />
            </label>

            <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
              <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Competitors</span>
              <input
                value={companyInfo.competitors}
                onChange={(event) => updateCompanyInfo('competitors', event.target.value)}
                placeholder="MSFT, GOOGL, Samsung"
                className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none placeholder:text-neutral-600 focus:bg-[#c9ff7a]"
              />
            </label>

            <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
              <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Current price</span>
              <input
                value={companyInfo.currentPrice}
                onChange={(event) => updateCompanyInfo('currentPrice', event.target.value)}
                placeholder="$190.50"
                className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none placeholder:text-neutral-600 focus:bg-[#c9ff7a]"
              />
            </label>

            <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
              <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Market cap</span>
              <input
                value={companyInfo.marketCap}
                onChange={(event) => updateCompanyInfo('marketCap', event.target.value)}
                placeholder="$2.9T"
                className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none placeholder:text-neutral-600 focus:bg-[#c9ff7a]"
              />
            </label>

            <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4 md:col-span-2">
              <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Brief personal thesis</span>
              <textarea
                value={companyInfo.thesis}
                onChange={(event) => updateCompanyInfo('thesis', event.target.value)}
                rows="5"
                placeholder="Why this company may deserve capital..."
                className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none placeholder:text-neutral-600 focus:bg-[#c9ff7a]"
              />
            </label>
          </div>

          <aside className="border-2 border-black bg-white p-5 shadow-pixel">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-700">Company snapshot</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="pixel-title text-4xl font-black uppercase">
                  {companyInfo.ticker || 'TICKER'}
                </p>
                <p className="mt-1 text-xl font-black">
                  {companyInfo.companyName || 'Company name'}
                </p>
              </div>

              <dl className="grid gap-3">
                <div className="border-2 border-black bg-[#fffbe6] p-3">
                  <dt className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Industry</dt>
                  <dd className="mt-1 font-black">{companyInfo.industry || 'Not entered'}</dd>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border-2 border-black bg-[#c9ff7a] p-3">
                    <dt className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Price</dt>
                    <dd className="mt-1 font-black">{companyInfo.currentPrice || 'TBD'}</dd>
                  </div>
                  <div className="border-2 border-black bg-[#c9ff7a] p-3">
                    <dt className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Market cap</dt>
                    <dd className="mt-1 font-black">{companyInfo.marketCap || 'TBD'}</dd>
                  </div>
                </div>
              </dl>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Competitors</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {competitorsList.length > 0 ? (
                    competitorsList.map((competitor) => (
                      <span key={competitor} className="border-2 border-black bg-white px-3 py-1 text-sm font-black shadow-[2px_2px_0_#111111]">
                        {competitor}
                      </span>
                    ))
                  ) : (
                    <span className="font-bold text-neutral-600">No competitors entered</span>
                  )}
                </div>
              </div>

              <div className="border-2 border-black bg-[#fffbe6] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Personal thesis</p>
                <p className="mt-2 whitespace-pre-wrap font-bold text-neutral-900">
                  {companyInfo.thesis || 'No thesis entered yet.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="pixel-panel overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-black bg-[#c9ff7a] px-4 py-3">
          <p className="pixel-title text-xl font-black lowercase">composite_score</p>
          <div className="flex gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-black bg-white" />
            <span className="h-4 w-4 rounded-full border-2 border-black bg-white" />
            <span className="h-4 w-4 rounded-full border-2 border-black bg-black" />
          </div>
        </div>

        <div className="grid gap-4 p-6 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="border-2 border-black bg-black p-5 text-[#fffdfa] shadow-pixel">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#c9ff7a]">Final score</p>
            <p className="mt-3 text-6xl font-black leading-none">{compositeScore}</p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.2em]">/ 100</p>
          </div>

          <div className="border-2 border-black bg-white p-5 shadow-pixel">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-700">Classification</p>
            <p className="mt-3 text-2xl font-black">{classification}</p>
          </div>

          <div className="border-2 border-black bg-white p-5 shadow-pixel">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-700">Gates passed</p>
            <p className="mt-3 text-5xl font-black">{gatesPassed}</p>
            <p className="mt-2 font-bold text-neutral-800">Strong Pass or Pass</p>
          </div>

          <div className="border-2 border-black bg-[#fffbe6] p-5 shadow-pixel">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-700">Concern / Fail</p>
            <p className="mt-3 text-5xl font-black">{concernFailGates}</p>
            <p className="mt-2 font-bold text-neutral-800">Gates needing attention</p>
          </div>
        </div>
      </section>

      <section className="pixel-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b-2 border-black bg-[#fffbe6] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="pixel-title text-xl font-black lowercase">investment_memo</p>
          <button
            type="button"
            onClick={refreshMemo}
            className="border-2 border-black bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#fffdfa] transition hover:bg-neutral-800"
          >
            Refresh draft
          </button>
        </div>

        <div className="grid gap-4 p-6 xl:grid-cols-2">
          <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
            <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Company overview</span>
            <textarea
              value={investmentMemo.companyOverview}
              onChange={(event) => updateMemo('companyOverview', event.target.value)}
              rows="4"
              className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none focus:bg-[#c9ff7a]"
            />
          </label>

          <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
            <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Final score & classification</span>
            <textarea
              value={investmentMemo.scoreSummary}
              onChange={(event) => updateMemo('scoreSummary', event.target.value)}
              rows="4"
              className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none focus:bg-[#c9ff7a]"
            />
          </label>

          <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4 xl:col-span-2">
            <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Gate-by-gate summary</span>
            <textarea
              value={investmentMemo.gateSummary}
              onChange={(event) => updateMemo('gateSummary', event.target.value)}
              rows="8"
              className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none focus:bg-[#c9ff7a]"
            />
          </label>

          <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
            <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Bull thesis</span>
            <textarea
              value={investmentMemo.bullThesis}
              onChange={(event) => updateMemo('bullThesis', event.target.value)}
              rows="6"
              className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none focus:bg-[#c9ff7a]"
            />
          </label>

          <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
            <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Bear thesis</span>
            <textarea
              value={investmentMemo.bearThesis}
              onChange={(event) => updateMemo('bearThesis', event.target.value)}
              rows="6"
              className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none focus:bg-[#c9ff7a]"
            />
          </label>

          <label className="space-y-2 border-2 border-black bg-[#fffbe6] p-4">
            <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Key risks</span>
            <textarea
              value={investmentMemo.keyRisks}
              onChange={(event) => updateMemo('keyRisks', event.target.value)}
              rows="5"
              className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none focus:bg-[#c9ff7a]"
            />
          </label>

          <label className="space-y-2 border-2 border-black bg-[#c9ff7a] p-4">
            <span className="block text-sm font-black uppercase tracking-[0.15em] text-neutral-700">Final decision</span>
            <select
              value={investmentMemo.finalDecision}
              onChange={(event) => updateMemo('finalDecision', event.target.value)}
              className="w-full border-2 border-black bg-white px-3 py-2 font-black text-black outline-none focus:bg-[#fffbe6]"
            >
              {['Buy', 'Watchlist', 'Avoid', 'Research More'].map((decision) => (
                <option key={decision} value={decision}>
                  {decision}
                </option>
              ))}
            </select>
            <p className="mt-4 border-2 border-black bg-white p-4 text-3xl font-black">{investmentMemo.finalDecision}</p>
          </label>
        </div>
      </section>

      <section className="space-y-6">
        <div className="pixel-panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-700">Gate checklist</p>
              <h2 className="pixel-title mt-3 text-3xl font-black uppercase">Company gate review</h2>
              <p className="mt-3 max-w-2xl font-bold text-neutral-800">
                View all seven investment gates and drill into questions and metrics for each evaluation area.
              </p>
            </div>
            <div className="border-2 border-black bg-white px-4 py-4 shadow-pixel">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-700">Status guide</p>
              <p className="mt-3 text-sm font-black text-neutral-900">Strong Pass, Pass, Neutral, Concern, Fail</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {gateEvaluations.map((gate) => (
            <GateCard key={gate.id} gate={gate} onChange={updateGate} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default CompanyAnalysis
