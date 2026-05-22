import { Link } from 'react-router-dom'
import { readWatchlist } from '../utils/analysisStorage'

const formatDate = (dateValue) => {
  if (!dateValue) return 'Not saved'

  return new Date(dateValue).toLocaleString()
}

function Watchlist() {
  const savedAnalyses = readWatchlist()

  return (
    <div className="space-y-8">
      <section className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Watchlist</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Saved company analyses</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Reopen saved analyses from localStorage and continue scoring, editing, or updating the memo.
        </p>
      </section>

      {savedAnalyses.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {savedAnalyses.map((analysis) => {
            const companyInfo = analysis.companyInfo ?? {}
            const ticker = companyInfo.ticker || 'TICKER'
            const companyName = companyInfo.companyName || 'Unnamed company'
            const industry = companyInfo.industry || 'Industry not entered'
            const compositeScore = analysis.compositeScore ?? 0
            const classification = analysis.classification || 'Unclassified'

            return (
              <Link
                key={analysis.id}
                to={`/company/${analysis.id}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-4xl font-semibold uppercase text-slate-950">{ticker}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{companyName}</h2>
                    <p className="mt-2 text-slate-600">{industry}</p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Score</p>
                    <p className="mt-2 text-4xl font-semibold text-emerald-900">{compositeScore}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Classification</p>
                    <p className="mt-1 font-semibold text-slate-950">{classification}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Last updated</p>
                    <p className="mt-1 font-semibold text-slate-950">{formatDate(analysis.savedAt)}</p>
                  </div>
                </div>

                <p className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-emerald-700">
                  Reopen analysis
                </p>
              </Link>
            )
          })}
        </section>
      ) : (
        <section className="pixel-panel p-6 sm:p-8">
          <p className="text-2xl font-semibold text-slate-950">No saved analyses yet</p>
          <p className="mt-3 text-slate-600">
            Save an analysis from the Company Analysis page and it will appear here.
          </p>
          <Link
            to="/company"
            className="mt-6 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Create analysis
          </Link>
        </section>
      )}
    </div>
  )
}

export default Watchlist
