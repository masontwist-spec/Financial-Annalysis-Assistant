import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { getLatest, getHistory } from '../services/fredService'

const fmtDate = (d) => {
  const [year, month] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(month) - 1]} '${year.slice(2)}`
}

const fmtFullDate = (d) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

function FedPolicy() {
  const [currentRate, setCurrentRate] = useState(null)
  const [rateHistory, setRateHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [latest, history] = await Promise.all([
          getLatest('FEDFUNDS'),
          getHistory('FEDFUNDS', 48),
        ])
        setCurrentRate(latest)
        setRateHistory(history.map((obs) => ({
          label: fmtDate(obs.date),
          value: parseFloat(Number(obs.value).toFixed(2)),
        })))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const rate = currentRate ? Number(currentRate.value) : null

  const policyStatus = rate === null
    ? { label: '—', style: 'bg-slate-100 text-slate-700', text: '' }
    : rate >= 4.5
    ? {
        label: 'Restrictive',
        style: 'bg-amber-100 text-amber-800',
        text: 'The Fed is actively tightening financial conditions to slow the economy and bring inflation to target. Borrowing costs are elevated across mortgages, business loans, and credit cards.',
      }
    : rate >= 2
    ? {
        label: 'Neutral',
        style: 'bg-slate-100 text-slate-700',
        text: "The Fed is near its estimated neutral rate — neither stimulating nor restricting the economy significantly. This is roughly where policy settles once inflation is under control.",
      }
    : {
        label: 'Accommodative',
        style: 'bg-blue-100 text-blue-800',
        text: 'The Fed is stimulating the economy with low borrowing costs. Typically deployed during recessions or financial crises to encourage spending and investment.',
      }

  if (loading) return <div className="pixel-panel p-8 text-slate-500">Loading Fed policy data...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div>

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Fed Policy</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Federal Reserve Interest Rate Policy</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The Federal Funds Rate is the Fed's primary monetary policy tool. It sets the baseline for borrowing costs across the entire economy.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
        <div className="pixel-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Federal Funds Rate</p>
          <p className="mt-3 text-6xl font-semibold tabular-nums text-slate-950">
            {rate !== null ? `${rate.toFixed(2)}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">{fmtFullDate(currentRate?.date)}</p>
          <span className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${policyStatus.style}`}>
            {policyStatus.label}
          </span>
          {policyStatus.text && (
            <p className="mt-4 text-sm leading-6 text-slate-600">{policyStatus.text}</p>
          )}
        </div>

        <div className="pixel-panel p-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">4-Year Rate History</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={rateHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} interval={7} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} />
              <Tooltip
                formatter={(v) => [`${v.toFixed(2)}%`, 'Fed Funds Rate']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Line type="stepAfter" dataKey="value" stroke="#059669" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section className="pixel-panel p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-950">What to know for class</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-slate-950">The Fed's dual mandate</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The Federal Reserve has two congressionally-mandated goals: maximum employment and stable prices (2% inflation). These objectives often conflict — cutting rates helps employment but can fuel inflation; raising rates controls inflation but risks higher unemployment. The art of monetary policy is balancing both.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">How the Fed Funds Rate works</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The FOMC sets a target range for the overnight rate banks charge each other to borrow reserves. This ripples through the entire economy: it influences mortgage rates, corporate bond yields, savings rates, and the attractiveness of investing vs. saving. The Fed meets 8 times per year to review and adjust the target.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">The Taylor Rule</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The Taylor Rule provides a formula for what the rate "should" be given inflation and the output gap: Rate ≈ 2% + inflation + 0.5 × (inflation − 2%) + 0.5 × (GDP gap). It is a useful benchmark for judging whether current policy is too tight or too loose relative to economic conditions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Rate cycles and asset prices</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Rising rates increase the discount rate in DCF models, lowering the present value of future cash flows. This is why growth stocks — with cash flows far in the future — are especially sensitive to rate hikes. A falling rate environment does the opposite, expanding multiples for long-duration assets like equities and real estate.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FedPolicy
