import { useState } from 'react'
import { confidenceLevels, gateStatuses } from '../data/gates'

const statusStyles = {
  'Strong Pass': 'bg-emerald-900 text-white ring-emerald-900',
  Pass: 'bg-emerald-600 text-white ring-emerald-600',
  Neutral: 'bg-slate-200 text-slate-700 ring-slate-200',
  Concern: 'bg-amber-500 text-slate-950 ring-amber-500',
  Fail: 'bg-red-600 text-white ring-red-600',
}

const confidenceLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function GateCard({ gate, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const scoreLabel = gate.score != null ? gate.score : 'TBD'
  const confidenceLabel = gate.confidenceLevel ? confidenceLabels[gate.confidenceLevel] : 'Unassigned'
  const badgeClass = statusStyles[gate.status] ?? statusStyles.Neutral
  const notesValue = gate.notes ?? ''
  const redFlagsValue = gate.redFlagsText ?? gate.redFlags?.join('\n') ?? ''

  const handleScoreChange = (event) => {
    const nextValue = event.target.value

    onChange(gate.id, {
      score: nextValue === '' ? null : Math.min(10, Math.max(0, Number(nextValue))),
    })
  }

  const handleRedFlagsChange = (event) => {
    const nextValue = event.target.value

    onChange(gate.id, {
      redFlagsText: nextValue,
      redFlags: nextValue
        .split('\n')
        .map((flag) => flag.trim())
        .filter(Boolean),
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{gate.id}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeClass}`}>
          {gate.status}
        </span>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Confidence</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{confidenceLabel}</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">{gate.title}</h2>
            <p className="text-slate-600">{gate.shortDescription}</p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right sm:min-w-[10rem]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Score</p>
            <p className="mt-2 text-4xl font-semibold text-emerald-900">{scoreLabel}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Core question</p>
          <p className="mt-3 font-medium text-slate-800">{gate.coreQuestion}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 border-t border-slate-200 bg-slate-950 px-6 py-4 text-left text-white transition hover:bg-slate-800"
      >
        <span className="font-semibold">{isOpen ? 'Hide details' : 'Open scoring console'}</span>
        <span className="text-2xl leading-none">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Manual scoring</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-4">
                <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block text-sm font-semibold text-slate-700">Status</span>
                  <select
                    value={gate.status}
                    onChange={(event) => onChange(gate.id, { status: event.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    {gateStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block text-sm font-semibold text-slate-700">Score</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={gate.score ?? ''}
                    onChange={handleScoreChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="0-10"
                  />
                </label>

                <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block text-sm font-semibold text-slate-700">Confidence</span>
                  <select
                    value={gate.confidenceLevel ?? ''}
                    onChange={(event) => onChange(gate.id, { confidenceLevel: event.target.value || null })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">Unassigned</option>
                    {confidenceLevels.map((level) => (
                      <option key={level} value={level}>
                        {confidenceLabels[level]}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block text-sm font-semibold text-slate-700">Current read</span>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {gate.status} / {scoreLabel} / {confidenceLabel}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block text-sm font-semibold text-slate-700">Notes</span>
                  <textarea
                    value={notesValue}
                    onChange={(event) => onChange(gate.id, { notes: event.target.value })}
                    rows="5"
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Capture thesis notes, evidence, and open questions."
                  />
                </label>

                <label className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block text-sm font-semibold text-slate-700">Red flags</span>
                  <textarea
                    value={redFlagsValue}
                    onChange={handleRedFlagsChange}
                    rows="5"
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Add one red flag per line."
                  />
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Key questions</h3>
              <ul className="mt-4 space-y-3 text-sm font-medium text-slate-700">
                {gate.keyQuestions.length > 0 ? (
                  gate.keyQuestions.map((question) => (
                    <li key={question} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      {question}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No key questions defined yet.</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Key metrics</h3>
              <ul className="mt-4 space-y-3 text-sm font-medium text-slate-700">
                {gate.keyMetrics.length > 0 ? (
                  gate.keyMetrics.map((metric) => (
                    <li key={metric} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      {metric}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No key metrics defined yet.</li>
                )}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Saved notes & red flags</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="min-h-24 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {notesValue ? notesValue : <span className="text-slate-500">No notes added yet.</span>}
                </div>
                <div className="min-h-24 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {gate.redFlags?.length > 0 ? (
                    <ul className="space-y-2">
                      {gate.redFlags.map((flag) => (
                        <li key={flag}>{flag}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-500">No red flags added yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GateCard
