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
