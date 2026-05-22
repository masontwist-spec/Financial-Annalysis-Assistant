import { useState } from 'react'
import { confidenceLevels, gateStatuses } from '../data/gates'

const statusStyles = {
  'Strong Pass': 'bg-[#c9ff7a]',
  Pass: 'bg-[#ddffad]',
  Neutral: 'bg-[#f8f5f5]',
  Concern: 'bg-[#ffd35a]',
  Fail: 'bg-[#ff8a8a]',
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
    <div className="overflow-hidden border-2 border-black bg-[#f8f5f5] shadow-pixel">
      <div className="flex items-center justify-between border-b-2 border-black bg-[#f2eeee] px-4 py-3">
        <p className="pixel-title text-xl font-black lowercase">{gate.id}</p>
        <div className="flex gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-black bg-[#f2eeee]" />
          <span className="h-4 w-4 rounded-full border-2 border-black bg-[#f2eeee]" />
          <span className="h-4 w-4 rounded-full border-2 border-black bg-black" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${badgeClass}`}>
                {gate.status}
              </span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-500">Confidence</span>
              <span className="border-2 border-black bg-white px-3 py-1 text-xs font-black">{confidenceLabel}</span>
            </div>
            <h2 className="pixel-title text-2xl font-black uppercase">{gate.title}</h2>
            <p className="font-semibold text-neutral-600">{gate.shortDescription}</p>
          </div>

          <div className="border-2 border-black bg-white px-4 py-3 text-right sm:min-w-[10rem]">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Score</p>
            <p className="mt-2 text-4xl font-black">{scoreLabel}</p>
          </div>
        </div>

        <div className="mt-6 border-2 border-black bg-[#f2eeee] p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Core question</p>
          <p className="mt-3 font-bold text-neutral-800">{gate.coreQuestion}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 border-t-2 border-black bg-black px-6 py-4 text-left text-[#f2eeee] transition hover:bg-neutral-800"
      >
        <span className="font-black uppercase tracking-[0.1em]">{isOpen ? 'Hide details' : 'View scoring console'}</span>
        <span className="text-2xl leading-none">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="border-t-2 border-black bg-[#f8f5f5] px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Manual scoring</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-4">
                <label className="space-y-2 border-2 border-black bg-[#f2eeee] p-4">
                  <span className="block text-sm font-black">Status</span>
                  <select
                    value={gate.status}
                    onChange={(event) => onChange(gate.id, { status: event.target.value })}
                    className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none transition focus:bg-[#c9ff7a]"
                  >
                    {gateStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 border-2 border-black bg-[#f2eeee] p-4">
                  <span className="block text-sm font-black">Score</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={gate.score ?? ''}
                    onChange={handleScoreChange}
                    className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none transition focus:bg-[#c9ff7a]"
                    placeholder="0-10"
                  />
                </label>

                <label className="space-y-2 border-2 border-black bg-[#f2eeee] p-4">
                  <span className="block text-sm font-black">Confidence</span>
                  <select
                    value={gate.confidenceLevel ?? ''}
                    onChange={(event) => onChange(gate.id, { confidenceLevel: event.target.value || null })}
                    className="w-full border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none transition focus:bg-[#c9ff7a]"
                  >
                    <option value="">Unassigned</option>
                    {confidenceLevels.map((level) => (
                      <option key={level} value={level}>
                        {confidenceLabels[level]}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="border-2 border-black bg-[#f2eeee] p-4">
                  <span className="block text-sm font-black">Current read</span>
                  <p className="mt-3 text-sm font-bold text-neutral-600">
                    {gate.status} / {scoreLabel} / {confidenceLabel}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 border-2 border-black bg-[#f2eeee] p-4">
                  <span className="block text-sm font-black">Notes</span>
                  <textarea
                    value={notesValue}
                    onChange={(event) => onChange(gate.id, { notes: event.target.value })}
                    rows="5"
                    className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none transition placeholder:text-neutral-500 focus:bg-[#fffbe6]"
                    placeholder="Capture thesis notes, evidence, and open questions."
                  />
                </label>

                <label className="space-y-2 border-2 border-black bg-[#f2eeee] p-4">
                  <span className="block text-sm font-black">Red flags</span>
                  <textarea
                    value={redFlagsValue}
                    onChange={handleRedFlagsChange}
                    rows="5"
                    className="w-full resize-y border-2 border-black bg-white px-3 py-2 font-bold text-black outline-none transition placeholder:text-neutral-500 focus:bg-[#fffbe6]"
                    placeholder="Add one red flag per line."
                  />
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Key questions</h3>
              <ul className="mt-4 space-y-3 font-bold text-neutral-800">
                {gate.keyQuestions.length > 0 ? (
                  gate.keyQuestions.map((question) => (
                    <li key={question} className="border-2 border-black bg-white px-4 py-3">
                      {question}
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500">No key questions defined yet.</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Key metrics</h3>
              <ul className="mt-4 space-y-3 font-bold text-neutral-800">
                {gate.keyMetrics.length > 0 ? (
                  gate.keyMetrics.map((metric) => (
                    <li key={metric} className="border-2 border-black bg-white px-4 py-3">
                      {metric}
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500">No key metrics defined yet.</li>
                )}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Saved notes & red flags</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="min-h-24 whitespace-pre-wrap border-2 border-black bg-white px-4 py-3 font-bold text-neutral-800">
                  {notesValue ? notesValue : <span className="text-neutral-500">No notes added yet.</span>}
                </div>
                <div className="min-h-24 border-2 border-black bg-white px-4 py-3 font-bold text-neutral-800">
                  {gate.redFlags?.length > 0 ? (
                    <ul className="space-y-2">
                      {gate.redFlags.map((flag) => (
                        <li key={flag}>{flag}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-neutral-500">No red flags added yet.</span>
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
