function Home() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="pixel-panel space-y-6 p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-500">Welcome</p>
          <h1 className="pixel-title text-4xl font-black uppercase sm:text-6xl">Investment Gates</h1>
          <p className="max-w-2xl text-lg font-semibold text-neutral-700">
            Evaluate companies through a disciplined series of investment gates built for long-term equity research.
            Start with industry durability, business quality, valuation, and risk assessment.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="pixel-card p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Focus</p>
            <h2 className="mt-3 text-xl font-black">Disciplined gating</h2>
            <p className="mt-2 font-semibold text-neutral-600">Review each dimension of the business before forming a conviction.</p>
          </article>

          <article className="pixel-card p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Design</p>
            <h2 className="mt-3 text-xl font-black">Clean research flow</h2>
            <p className="mt-2 font-semibold text-neutral-600">A modern, responsive interface built to organize and compare thesis areas.</p>
          </article>
        </div>
      </div>

      <aside className="pixel-panel space-y-6 p-6 sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-500">Core gates</p>
          <h2 className="pixel-title text-3xl font-black uppercase">Seven evaluation pillars</h2>
          <p className="font-semibold text-neutral-600">
            Industry durability, competitive advantage, business model quality, management, financial strength, valuation,
            and risk assessment.
          </p>
        </div>

        <ul className="space-y-3 font-bold">
          {[
            'Industry Durability',
            'Competitive Advantage / Moat',
            'Business Model Quality',
            'Management & Capital Allocation',
            'Financial Strength',
            'Valuation',
            'Risk Assessment',
          ].map((gate) => (
            <li key={gate} className="border-2 border-black bg-[#f8f5f5] px-4 py-3 shadow-pixel">
              {gate}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}

export default Home
