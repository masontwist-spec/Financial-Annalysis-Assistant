import { useEffect, useState } from 'react'
import { getLatest, getWithYoY } from '../services/fredService'

const fmtFullDate = (d) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const STATUS_STYLES = {
  emerald: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  slate: 'bg-slate-100 text-slate-700',
}

function IndicatorCard({ label, value, date, status, description, textbook, loading }) {
  if (loading) {
    return (
      <div className="pixel-card animate-pulse p-5">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="mt-4 h-10 w-28 rounded bg-slate-200" />
        <div className="mt-3 h-3 w-16 rounded bg-slate-200" />
        <div className="mt-4 h-5 w-20 rounded-full bg-slate-200" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-3/4 rounded bg-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="pixel-card flex flex-col p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold tabular-nums text-slate-950">{value ?? '—'}</p>
      <p className="mt-1 text-xs text-slate-400">{fmtFullDate(date)}</p>
      {status && (
        <span className={`mt-3 w-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status.color] ?? STATUS_STYLES.slate}`}>
          {status.label}
        </span>
      )}
      <p className="mt-4 flex-1 text-sm text-slate-600">{description}</p>
      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">{textbook}</p>
    </div>
  )
}

function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [fedFunds, cpi, unemployment, spread, treasury10, breakeven] = await Promise.all([
          getLatest('FEDFUNDS'),
          getWithYoY('CPIAUCSL'),
          getLatest('UNRATE'),
          getLatest('T10Y2Y'),
          getLatest('DGS10'),
          getLatest('T10YIE'),
        ])
        setData({ fedFunds, cpi, unemployment, spread, treasury10, breakeven })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const n = (obs) => (obs ? Number(obs.value) : null)

  const fedFundsVal = n(data?.fedFunds)
  const cpiYoY = data?.cpi?.yoy ? Number(data.cpi.yoy) : null
  const unemployVal = n(data?.unemployment)
  const spreadVal = n(data?.spread)
  const t10Val = n(data?.treasury10)
  const breakevenVal = n(data?.breakeven)

  const cards = [
    {
      label: 'Fed Funds Rate',
      value: fedFundsVal !== null ? `${fedFundsVal.toFixed(2)}%` : '—',
      date: data?.fedFunds?.date,
      status: fedFundsVal === null ? null
        : fedFundsVal >= 4.5 ? { label: 'Restrictive', color: 'amber' }
        : fedFundsVal >= 2 ? { label: 'Neutral', color: 'slate' }
        : { label: 'Accommodative', color: 'blue' },
      description: 'The overnight rate banks charge each other to borrow, set by the Federal Reserve at 8 FOMC meetings per year.',
      textbook: 'Monetary Policy · Taylor Rule · FOMC',
    },
    {
      label: 'CPI Inflation (YoY)',
      value: cpiYoY !== null ? `${cpiYoY.toFixed(1)}%` : '—',
      date: data?.cpi?.latest?.date,
      status: cpiYoY === null ? null
        : cpiYoY >= 4 ? { label: 'High', color: 'red' }
        : cpiYoY >= 2.5 ? { label: 'Elevated', color: 'amber' }
        : cpiYoY >= 1.5 ? { label: 'Near Target', color: 'emerald' }
        : { label: 'Below Target', color: 'blue' },
      description: 'Year-over-year change in the Consumer Price Index — how much more expensive goods and services are than 12 months ago.',
      textbook: 'Price Stability · Fisher Effect · Real vs. Nominal',
    },
    {
      label: 'Unemployment Rate',
      value: unemployVal !== null ? `${unemployVal.toFixed(1)}%` : '—',
      date: data?.unemployment?.date,
      status: unemployVal === null ? null
        : unemployVal < 4 ? { label: 'Tight Labor Market', color: 'emerald' }
        : unemployVal < 5 ? { label: 'Normal', color: 'slate' }
        : unemployVal < 7 ? { label: 'Elevated', color: 'amber' }
        : { label: 'High', color: 'red' },
      description: "Share of the labor force actively seeking work. One half of the Fed's dual mandate alongside price stability.",
      textbook: "Dual Mandate · Phillips Curve · NAIRU",
    },
    {
      label: '10Y – 2Y Spread',
      value: spreadVal !== null ? `${spreadVal >= 0 ? '+' : ''}${spreadVal.toFixed(2)}%` : '—',
      date: data?.spread?.date,
      status: spreadVal === null ? null
        : spreadVal >= 1 ? { label: 'Normal', color: 'emerald' }
        : spreadVal >= 0 ? { label: 'Flat', color: 'amber' }
        : { label: 'Inverted', color: 'red' },
      description: 'Difference between 10-year and 2-year Treasury yields. An inverted spread has preceded every US recession since 1955.',
      textbook: 'Yield Curve · Expectations Theory · Term Premium',
    },
    {
      label: '10-Year Treasury',
      value: t10Val !== null ? `${t10Val.toFixed(2)}%` : '—',
      date: data?.treasury10?.date,
      status: t10Val === null ? null
        : t10Val >= 4.5 ? { label: 'High Yield Env.', color: 'amber' }
        : t10Val >= 2.5 ? { label: 'Normal Range', color: 'slate' }
        : { label: 'Low Yield Env.', color: 'blue' },
      description: "The yield on 10-year US government bonds. Used as the 'risk-free rate' in virtually every finance model and DCF valuation.",
      textbook: 'Risk-Free Rate · CAPM · DCF Valuation',
    },
    {
      label: '10Y Breakeven Inflation',
      value: breakevenVal !== null ? `${breakevenVal.toFixed(2)}%` : '—',
      date: data?.breakeven?.date,
      status: breakevenVal === null ? null
        : breakevenVal >= 2.7 ? { label: 'Above Target', color: 'amber' }
        : breakevenVal >= 1.8 ? { label: 'Anchored', color: 'emerald' }
        : { label: 'Below Target', color: 'blue' },
      description: "What bond markets expect inflation to average over the next 10 years, derived from TIPS vs. nominal Treasury spreads.",
      textbook: 'Fisher Equation · Real Rates · Inflation Expectations',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">MacroLab</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Macro Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Live economic indicators from the Federal Reserve, explained for finance students. Each metric connects directly to the theory behind it.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Failed to load data: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <IndicatorCard key={card.label} {...card} loading={loading} />
        ))}
      </div>
    </div>
  )
}

export default Home
