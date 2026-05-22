import { useState } from 'react'
import GateCard from '../components/GateCard'
import { gates } from '../data/gates'

function CompanyAnalysis() {
  const [gateEvaluations, setGateEvaluations] = useState(gates)

  const updateGate = (gateId, updates) => {
    setGateEvaluations((currentGates) =>
      currentGates.map((gate) => (gate.id === gateId ? { ...gate, ...updates } : gate)),
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Company Analysis</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Evaluate a business through investment gates</h1>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-slate-300 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Enter company</p>
            <input
              placeholder="Search ticker or company name"
              className="mt-3 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/25"
            />
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Gate checklist</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Company gate review</h2>
              <p className="mt-3 max-w-2xl text-slate-400">
                View all seven investment gates and drill into questions and metrics for each evaluation area.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-slate-300 shadow-soft">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Status guide</p>
              <p className="mt-3 text-sm text-slate-400">Strong Pass, Pass, Neutral, Concern, Fail</p>
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
