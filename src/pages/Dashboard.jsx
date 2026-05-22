const metrics = [
  { label: 'Companies tracked', value: '12' },
  { label: 'Research notes', value: '34' },
  { label: 'Gate progress', value: '78%' },
  { label: 'Watchlist health', value: 'Strong' },
]

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-500">Dashboard</p>
        <h1 className="pixel-title mt-3 text-4xl font-black uppercase">Portfolio research overview</h1>
        <p className="mt-4 max-w-2xl font-semibold text-neutral-600">
          A summary view of your tracked companies, gate progress, and research performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="pixel-card p-5">
            <p className="text-sm font-black uppercase text-neutral-500">{metric.label}</p>
            <p className="mt-4 text-3xl font-black">{metric.value}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="pixel-panel p-6 sm:p-8">
          <h2 className="pixel-title text-2xl font-black uppercase">Recent company reviews</h2>
          <p className="mt-3 font-semibold text-neutral-600">Your latest analysis items are listed below for quick follow-up.</p>
          <ul className="mt-6 space-y-4">
            {['Alpha Dynamics', 'GreenEdge Holdings', 'BluePeak Tech'].map((company) => (
              <li key={company} className="border-2 border-black bg-[#f8f5f5] p-4 shadow-pixel">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-black">{company}</p>
                  <span className="border-2 border-black bg-[#c9ff7a] px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
                    In review
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="pixel-panel p-6 sm:p-8">
          <h2 className="pixel-title text-2xl font-black uppercase">Research workflow</h2>
          <p className="mt-3 font-semibold text-neutral-600">Move through gate checkpoints for each company to build a stronger investment thesis.</p>
          <ol className="mt-6 space-y-4 font-bold">
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
