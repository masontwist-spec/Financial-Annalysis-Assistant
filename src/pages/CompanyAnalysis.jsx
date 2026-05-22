const gates = [
  'Industry Durability',
  'Competitive Advantage / Moat',
  'Business Model Quality',
  'Management & Capital Allocation',
  'Financial Strength',
  'Valuation',
  'Risk Assessment',
]

function CompanyAnalysis() {
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

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Gate checklist</p>
          <p className="mt-3 text-slate-400">Review each gate to build a comprehensive company scorecard.</p>
          <ul className="mt-6 space-y-4">
            {gates.map((gate) => (
              <li key={gate} className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-4">
                <p className="font-medium text-white">{gate}</p>
                <p className="mt-2 text-sm text-slate-400">Add notes and observations for this gate.</p>
              </li>
            ))}
          </ul>
        </aside>

        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Analysis panel</p>
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <h2 className="text-xl font-semibold text-white">Industry durability</h2>
              <p className="mt-3 text-slate-400">Assess long-term demand, secular trends, and the industry’s ability to withstand disruption.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <h2 className="text-xl font-semibold text-white">Valuation snapshot</h2>
              <p className="mt-3 text-slate-400">Record valuation observations and compare them with qualitative business strength.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <h2 className="text-xl font-semibold text-white">Risk assessment</h2>
              <p className="mt-3 text-slate-400">Capture key downside risks and portfolio considerations for the company.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

export default CompanyAnalysis
