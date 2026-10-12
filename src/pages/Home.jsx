import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLatest, getWithYoY } from '../services/fredService'
import { INDICATORS } from '../data/indicators'

const fmtFullDate = (d) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const LEFT_BORDER = {
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-red-500',
  blue: 'border-l-blue-500',
  slate: 'border-l-slate-300',
}

const STATUS_TEXT = {
  emerald: 'text-emerald-700',
  amber: 'text-amber-600',
  red: 'text-red-600',
  blue: 'text-blue-600',
  slate: 'text-slate-400',
}

const LIVE_FETCHES = [
  { id: 'fed-funds',     fetch: () => getLatest('FEDFUNDS') },
  { id: 'cpi',          fetch: () => getWithYoY('CPIAUCSL') },
  { id: 'unemployment', fetch: () => getLatest('UNRATE') },
  { id: 'yield-spread', fetch: () => getLatest('T10Y2Y') },
  { id: 'treasury-10y', fetch: () => getLatest('DGS10') },
  { id: 'breakeven',    fetch: () => getLatest('T10YIE') },
  { id: 'gdp-growth',   fetch: () => getLatest('A191RL1Q225SBEA') },
  { id: 'mortgage-rate',fetch: () => getLatest('MORTGAGE30US') },
  { id: 'credit-spread',fetch: () => getLatest('BAMLH0A0HYM2') },
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

function SummaryBar({ dataMap, loading }) {
  const ITEMS = [
    { id: 'fed-funds',     short: 'Fed Funds' },
    { id: 'cpi',           short: 'CPI YoY' },
    { id: 'yield-spread',  short: '10Y–2Y' },
    { id: 'treasury-10y',  short: '10Y Tsy' },
    { id: 'unemployment',  short: 'Unemp.' },
    { id: 'gdp-growth',    short: 'GDP' },
    { id: 'mortgage-rate', short: '30Y Mtg' },
    { id: 'credit-spread', short: 'HY Spread' },
  ]

  return (
    <div className="border border-slate-200 bg-white overflow-x-auto">
      <div className="flex divide-x divide-slate-200 min-w-max">
        {ITEMS.map(({ id, short }) => {
          const ind = INDICATORS[id]
          const raw = dataMap[id] ?? null
          const v = extractValue(id, raw)
          const status = ind.getStatus(v)
          const textColor = STATUS_TEXT[status?.color ?? 'slate']
          return (
            <Link
              key={id}
              to={`/indicator/${id}`}
              className="flex flex-col items-start px-4 py-2.5 hover:bg-slate-50 transition shrink-0"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{short}</p>
              {loading ? (
                <div className="mt-1 h-4 w-10 animate-pulse bg-slate-200" />
              ) : (
                <p className={`mt-0.5 text-sm font-bold tabular-nums ${textColor}`}>
                  {fmtVal(ind, v)}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function IndicatorCard({ id, label, category, value, date, status, description, textbook, loading }) {
  const borderColor = LEFT_BORDER[status?.color ?? 'slate']
  const statusTextColor = STATUS_TEXT[status?.color ?? 'slate']

  if (loading) {
    return (
      <div className={`border border-slate-200 border-l-4 border-l-slate-200 bg-white`}>
        <div className="animate-pulse p-4 space-y-3">
          <div className="h-2 w-14 bg-slate-200" />
          <div className="h-3 w-28 bg-slate-200" />
          <div className="h-8 w-20 bg-slate-200" />
          <div className="h-2 w-32 bg-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <Link
      to={`/indicator/${id}`}
      className={`block border border-slate-200 border-l-4 ${borderColor} bg-white transition hover:bg-slate-50`}
    >
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{category}</p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-slate-900">{label}</p>
        </div>
        {status && (
          <span className={`ml-2 shrink-0 text-[10px] font-bold uppercase tracking-wide ${statusTextColor}`}>
            {status.label}
          </span>
        )}
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-3xl font-bold tabular-nums leading-none text-slate-950">{value ?? '—'}</p>
        <p className="mt-1 text-xs text-slate-400">{fmtFullDate(date)}</p>
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        <p className="line-clamp-2 text-xs leading-5 text-slate-500">{description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="truncate text-[10px] text-slate-400">{textbook}</p>
          <span className="ml-2 shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Profile ›
          </span>
        </div>
      </div>
    </Link>
  )
}

const CARD_IDS = [
  'fed-funds', 'cpi', 'unemployment',
  'yield-spread', 'treasury-10y', 'breakeven',
  'gdp-growth', 'mortgage-rate', 'credit-spread', 'cape-ratio',
]

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

  const cards = CARD_IDS.map((id) => {
    const ind = INDICATORS[id]
    const raw = dataMap[id] ?? null
    const v = extractValue(id, raw)
    return {
      id,
      label: ind.label,
      category: ind.category,
      value: fmtVal(ind, v),
      date: extractDate(id, raw),
      status: ind.getStatus(v),
      description: ind.description,
      textbook: ind.textbook,
    }
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-slate-950">Macro Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live economic indicators from the Federal Reserve. Click any card to view the full profile.
        </p>
      </div>

      <SummaryBar dataMap={dataMap} loading={loading} />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          Failed to load some data: {error}
        </div>
      )}

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Indicators</p>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cards.map((card) => (
            <IndicatorCard key={card.id} {...card} loading={loading} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
