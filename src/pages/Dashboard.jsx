const metrics = [
  { label: 'Companies tracked', value: '12' },
  { label: 'Research notes', value: '34' },
  { label: 'Gate progress', value: '78%' },
  { label: 'Watchlist health', value: 'Strong' },
]

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Portfolio research overview</h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          A summary view of your tracked companies, gate progress, and research performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Recent company reviews</h2>
          <p className="mt-3 text-slate-400">Your latest analysis items are listed below for quick follow-up.</p>
          <ul className="mt-6 space-y-4">
            {['Alpha Dynamics', 'GreenEdge Holdings', 'BluePeak Tech'].map((company) => (
              <li key={company} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-white">{company}</p>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                    In review
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Research workflow</h2>
          <p className="mt-3 text-slate-400">Move through gate checkpoints for each company to build a stronger investment thesis.</p>
          <ol className="mt-6 space-y-4 text-slate-300">
            <li>1. Add company to watchlist</li>
            <li>2. Complete gate evaluation</li>
            <li>3. Record conviction and risk notes</li>
          </ol>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
