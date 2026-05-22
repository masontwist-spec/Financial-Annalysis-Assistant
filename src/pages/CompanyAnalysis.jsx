import { useState } from 'react'
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

function CompanyAnalysis() {
  const [gateEvaluations, setGateEvaluations] = useState(gates)

  const updateGate = (gateId, updates) => {
    setGateEvaluations((currentGates) =>
      currentGates.map((gate) => (gate.id === gateId ? { ...gate, ...updates } : gate)),
    )
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

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-700">Company Analysis</p>
            <h1 className="pixel-title mt-3 text-4xl font-black uppercase">Evaluate a business through investment gates</h1>
          </div>
          <div className="border-2 border-black bg-white px-4 py-4 shadow-pixel sm:min-w-80">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-700">Enter company</p>
            <input
              placeholder="Search ticker or company name"
              className="mt-3 w-full border-2 border-black bg-[#fffbe6] px-4 py-3 font-bold text-black outline-none transition placeholder:text-neutral-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

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
