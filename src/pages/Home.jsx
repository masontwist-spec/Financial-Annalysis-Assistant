import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLatest, getWithYoY } from '../services/fredService'
import { INDICATORS } from '../data/indicators'

const fmtFullDate = (d) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const STATUS_STYLES = {
  emerald: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  slate: 'bg-slate-100 text-slate-700',
}

function IndicatorCard({ id, label, value, date, status, description, textbook, loading }) {
  const inner = loading ? (
    <div className="animate-pulse p-5">
      <div className="h-3 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-10 w-28 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-16 rounded bg-slate-200" />
      <div className="mt-4 h-5 w-20 rounded-full bg-slate-200" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-3/4 rounded bg-slate-200" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold tabular-nums text-slate-950">{value ?? '—'}</p>
      <p className="mt-1 text-xs text-slate-400">{fmtFullDate(date)}</p>
      {status && (
        <span className={`mt-3 w-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status.color] ?? STATUS_STYLES.slate}`}>
          {status.label}
        </span>
      )}
      <p className="mt-4 flex-1 text-sm text-slate-600">{description}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">{textbook}</p>
        <span className="text-xs font-semibold text-emerald-700">View profile →</span>
      </div>
    </div>
  )

  return (
    <Link
      to={`/indicator/${id}`}
      className="pixel-card block transition hover:border-emerald-300 hover:shadow-md"
    >
      {inner}
    </Link>
  )
}

const LIVE_FETCHES = [
  { id: 'fed-funds',      fetch: () => getLatest('FEDFUNDS') },
  { id: 'cpi',            fetch: () => getWithYoY('CPIAUCSL') },
  { id: 'unemployment',   fetch: () => getLatest('UNRATE') },
  { id: 'yield-spread',   fetch: () => getLatest('T10Y2Y') },
  { id: 'treasury-10y',   fetch: () => getLatest('DGS10') },
  { id: 'breakeven',      fetch: () => getLatest('T10YIE') },
  { id: 'gdp-growth',     fetch: () => getLatest('A191RL1Q225SBEA') },
  { id: 'mortgage-rate',  fetch: () => getLatest('MORTGAGE30US') },
  { id: 'credit-spread',  fetch: () => getLatest('BAMLH0A0HYM2') },
]

function extractValue(id, raw) {
  if (!raw) return null
  if (id === 'cpi') return raw.yoy ? Number(raw.yoy) : null
  return Number(raw.value)
}

function extractDate(id, raw) {
  if (!raw) return null
  if (id === 'cpi') return raw.latest?.date ?? null
  return raw.date ?? null
}

function fmtVal(ind, v) {
  if (v === null) return '—'
  const num = v.toFixed(ind.precision)
  if (ind.showSign && v >= 0) return `+${num}${ind.unit}`
  return `${num}${ind.unit}`
}

function Home() {
  const [dataMap, setDataMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const results = await Promise.allSettled(LIVE_FETCHES.map((f) => f.fetch()))
        const map = {}
        LIVE_FETCHES.forEach(({ id }, i) => {
          if (results[i].status === 'fulfilled') map[id] = results[i].value
        })
        setDataMap(map)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const CARD_IDS = [
    'fed-funds', 'cpi', 'unemployment',
    'yield-spread', 'treasury-10y', 'breakeven',
    'gdp-growth', 'mortgage-rate', 'credit-spread', 'cape-ratio',
  ]

  const cards = CARD_IDS.map((id) => {
    const ind = INDICATORS[id]
    const raw = dataMap[id] ?? null
    const value = extractValue(id, raw)
    const date = extractDate(id, raw)
    return {
      id,
      label: ind.label,
      value: fmtVal(ind, value),
      date,
      status: ind.getStatus(value),
      description: ind.description,
      textbook: ind.textbook,
    }
  })

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">MacroLab</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Macro Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Live economic indicators from the Federal Reserve, explained for finance students. Click any card to explore the full profile — what it is, how it's calculated, and why it matters.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Failed to load some data: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <IndicatorCard key={card.id} {...card} loading={loading} />
        ))}
      </div>
    </div>
  )
}

export default Home
