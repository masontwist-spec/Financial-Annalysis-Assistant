import { Link } from 'react-router-dom'
import { readWatchlist } from '../utils/analysisStorage'

function Dashboard() {
  const savedAnalyses = readWatchlist()
  const averageScore = savedAnalyses.length
    ? Math.round(savedAnalyses.reduce((total, analysis) => total + (analysis.compositeScore ?? 0), 0) / savedAnalyses.length)
    : 0
  const strongCandidates = savedAnalyses.filter((analysis) =>
    ['Elite Compounder', 'Strong Candidate'].includes(analysis.classification),
  ).length
  const metrics = [
    { label: 'Companies tracked', value: savedAnalyses.length },
    { label: 'Average score', value: averageScore || 'TBD' },
    { label: 'High-quality candidates', value: strongCandidates },
    { label: 'Workspace mode', value: 'Local' },
  ]
  const recentAnalyses = savedAnalyses.slice(0, 3)

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Research command center</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Track saved analyses, monitor scoring quality, and jump back into company research.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="pixel-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{metric.value}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="pixel-panel p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-950">Recent company reviews</h2>
          <p className="mt-3 text-slate-600">Your latest saved analysis items are listed below for quick follow-up.</p>
          <ul className="mt-6 space-y-4">
            {recentAnalyses.length > 0 ? (
              recentAnalyses.map((analysis) => (
                <li key={analysis.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{analysis.companyInfo?.companyName || 'Unnamed company'}</p>
                      <p className="text-sm text-slate-500">{analysis.companyInfo?.ticker || 'No ticker'}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {analysis.classification || 'Unclassified'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                No saved analyses yet.
              </li>
            )}
          </ul>
        </article>

        <article className="pixel-panel p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-950">Research workflow</h2>
          <p className="mt-3 text-slate-600">Move through gate checkpoints for each company to build a stronger investment thesis.</p>
          <ol className="mt-6 space-y-4 text-sm font-medium text-slate-700">
            <li>1. Add company to watchlist</li>
            <li>2. Complete gate evaluation</li>
            <li>3. Record conviction and risk notes</li>
          </ol>
          <Link
            to="/company"
            className="mt-6 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Start new analysis
          </Link>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
