function Home() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Welcome</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Investment Gates</h1>
          <p className="max-w-2xl text-slate-300">
            Evaluate companies through a disciplined series of investment gates built for long-term equity research.
            Start with industry durability, business quality, valuation, and risk assessment.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl bg-slate-950/80 p-6 shadow-soft border border-slate-800">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Focus</p>
            <h2 className="mt-3 text-xl font-semibold text-white">Disciplined gating</h2>
            <p className="mt-2 text-slate-400">Review each dimension of the business before forming a conviction.</p>
          </article>

          <article className="rounded-3xl bg-slate-950/80 p-6 shadow-soft border border-slate-800">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Design</p>
            <h2 className="mt-3 text-xl font-semibold text-white">Clean research flow</h2>
            <p className="mt-2 text-slate-400">A modern, responsive interface built to organize and compare thesis areas.</p>
          </article>
        </div>
      </div>

      <aside className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Core gates</p>
          <h2 className="text-3xl font-semibold text-white">Seven evaluation pillars</h2>
          <p className="text-slate-400">
            Industry durability, competitive advantage, business model quality, management, financial strength, valuation,
            and risk assessment.
          </p>
        </div>

        <ul className="space-y-3 text-slate-300">
          {[
            'Industry Durability',
            'Competitive Advantage / Moat',
            'Business Model Quality',
            'Management & Capital Allocation',
            'Financial Strength',
            'Valuation',
            'Risk Assessment',
          ].map((gate) => (
            <li key={gate} className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
              {gate}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}

export default Home
