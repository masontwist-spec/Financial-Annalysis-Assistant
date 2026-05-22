import { useState } from 'react'

const statusStyles = {
  'Strong Pass': 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30',
  Pass: 'bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/25',
  Neutral: 'bg-slate-800 text-slate-200 ring-1 ring-slate-700',
  Concern: 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-400/30',
  Fail: 'bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/30',
}

function GateCard({ gate }) {
  const [isOpen, setIsOpen] = useState(false)
  const scoreLabel = gate.score != null ? gate.score : 'TBD'
  const confidenceLabel = gate.confidenceLevel ? gate.confidenceLevel : 'Unassigned'
  const badgeClass = statusStyles[gate.status] ?? statusStyles.Neutral

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 shadow-soft">
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${badgeClass}`}>
                {gate.status}
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Confidence</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{confidenceLabel}</span>
            </div>
            <h2 className="text-2xl font-semibold text-white">{gate.title}</h2>
            <p className="text-slate-400">{gate.shortDescription}</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/95 px-4 py-3 text-right text-slate-200 sm:min-w-[10rem]">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Score</p>
            <p className="mt-2 text-3xl font-semibold text-white">{scoreLabel}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Core question</p>
          <p className="mt-3 text-slate-300">{gate.coreQuestion}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 border-t border-slate-800 bg-slate-900/95 px-6 py-4 text-left text-slate-300 transition hover:bg-slate-800"
      >
        <span className="font-medium text-slate-100">{isOpen ? 'Hide details' : 'View key questions & metrics'}</span>
        <span className="text-2xl leading-none">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950/90 px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Key questions</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                {gate.keyQuestions.length > 0 ? (
                  gate.keyQuestions.map((question) => (
                    <li key={question} className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3">
                      {question}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No key questions defined yet.</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Key metrics</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                {gate.keyMetrics.length > 0 ? (
                  gate.keyMetrics.map((metric) => (
                    <li key={metric} className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3">
                      {metric}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No key metrics defined yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GateCard
