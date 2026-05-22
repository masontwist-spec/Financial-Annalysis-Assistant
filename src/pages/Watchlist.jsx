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
        <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-700">Watchlist</p>
        <h1 className="pixel-title mt-3 text-4xl font-black uppercase">Saved company analyses</h1>
        <p className="mt-3 max-w-3xl font-bold text-neutral-800">
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
                className="group border-2 border-black bg-white p-5 shadow-pixel transition hover:-translate-y-1 hover:bg-[#fffbe6]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="pixel-title text-4xl font-black uppercase">{ticker}</p>
                    <h2 className="mt-2 text-2xl font-black">{companyName}</h2>
                    <p className="mt-2 font-bold text-neutral-800">{industry}</p>
                  </div>

                  <div className="border-2 border-black bg-[#c9ff7a] px-4 py-3 text-right">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Score</p>
                    <p className="mt-2 text-4xl font-black">{compositeScore}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="border-2 border-black bg-[#fffbe6] p-3">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Classification</p>
                    <p className="mt-1 font-black">{classification}</p>
                  </div>
                  <div className="border-2 border-black bg-[#fffbe6] p-3">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-700">Last updated</p>
                    <p className="mt-1 font-black">{formatDate(analysis.savedAt)}</p>
                  </div>
                </div>

                <p className="mt-5 inline-block border-2 border-black bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#fffdfa] transition group-hover:bg-neutral-800">
                  Reopen analysis
                </p>
              </Link>
            )
          })}
        </section>
      ) : (
        <section className="pixel-panel p-6 sm:p-8">
          <p className="pixel-title text-2xl font-black uppercase">No saved analyses yet</p>
          <p className="mt-3 font-bold text-neutral-800">
            Save an analysis from the Company Analysis page and it will appear here.
          </p>
          <Link
            to="/company"
            className="mt-6 inline-block border-2 border-black bg-[#c9ff7a] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-0.5"
          >
            Create analysis
          </Link>
        </section>
      )}
    </div>
  )
}

export default Watchlist
