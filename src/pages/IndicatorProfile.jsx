import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { getLatest, getHistory, getWithYoY, getYoYHistory } from '../services/fredService'
import { INDICATORS } from '../data/indicators'

const STATUS_BG = {
  emerald: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  slate: 'bg-slate-100 text-slate-600',
}

const THRESHOLD_LEFT = {
  emerald: 'border-l-4 border-l-emerald-500 border border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-l-4 border-l-amber-500 border border-amber-200 bg-amber-50 text-amber-900',
  red: 'border-l-4 border-l-red-500 border border-red-200 bg-red-50 text-red-900',
  blue: 'border-l-4 border-l-blue-500 border border-blue-200 bg-blue-50 text-blue-900',
  slate: 'border-l-4 border-l-slate-300 border border-slate-200 bg-slate-50 text-slate-700',
}

const RESOURCE_TAG = {
  Concept: 'bg-violet-100 text-violet-700',
  Data: 'bg-emerald-100 text-emerald-700',
  'Primary Source': 'bg-blue-100 text-blue-700',
  Related: 'bg-slate-100 text-slate-600',
}

const fmtFullDate = (d) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const fmtChartLabel = (d, frequency) => {
  if (!d) return ''
  const [year, month] = d.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (frequency === 'quarterly') {
    const q = Math.ceil(parseInt(month) / 3)
    return `Q${q} '${year.slice(2)}`
  }
  return `${months[parseInt(month) - 1]} '${year.slice(2)}`
}

function IndicatorProfile() {
  const { id } = useParams()
  const indicator = INDICATORS[id]

  const [currentData, setCurrentData] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!indicator || !indicator.fredId) {
      setLoading(false)
      return
    }
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        if (indicator.dataType === 'yoy') {
          const [current, history] = await Promise.all([
            getWithYoY(indicator.fredId),
            getYoYHistory(indicator.fredId, indicator.chartLimit),
          ])
          setCurrentData(current)
          setChartData(history.map((p) => ({
            label: fmtChartLabel(p.date, indicator.frequency),
            value: p.value,
          })))
        } else {
          const [current, history] = await Promise.all([
            getLatest(indicator.fredId),
            getHistory(indicator.fredId, indicator.chartLimit),
          ])
          setCurrentData(current)
          setChartData(history.map((obs) => ({
            label: fmtChartLabel(obs.date, indicator.frequency),
            value: parseFloat(Number(obs.value).toFixed(indicator.precision)),
          })))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!indicator) {
    return (
      <div className="border border-slate-200 bg-white p-8">
        <p className="text-slate-500">Indicator not found.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  const currentValue = indicator.dataType === 'yoy'
    ? (currentData?.yoy ? Number(currentData.yoy) : null)
    : (currentData ? Number(currentData.value) : null)

  const currentDate = indicator.dataType === 'yoy'
    ? currentData?.latest?.date
    : currentData?.date

  const status = indicator.getStatus(currentValue)

  const fmtValue = (v) => {
    if (v === null) return '—'
    const num = v.toFixed(indicator.precision)
    if (indicator.showSign && v >= 0) return `+${num}${indicator.unit}`
    return `${num}${indicator.unit}`
  }

  const xInterval = Math.max(1, Math.floor(chartData.length / 7))

  return (
    <div className="space-y-4">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition">
        ← Dashboard
      </Link>

      {/* Hero */}
      <div className="border border-slate-200 bg-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{indicator.category}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{indicator.label}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{indicator.description}</p>

        <div className="mt-5 flex flex-wrap items-end gap-4 border-t border-slate-100 pt-4">
          {loading ? (
            <div className="h-12 w-28 animate-pulse bg-slate-200" />
          ) : indicator.fredId === null ? (
            <div className="border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Data</p>
              <p className="mt-1 text-sm text-slate-500">Not available via FRED — see external sources below.</p>
            </div>
          ) : error ? (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          ) : (
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Value</p>
                <p className="mt-1 text-5xl font-bold tabular-nums text-slate-950">{fmtValue(currentValue)}</p>
                <p className="mt-1 text-xs text-slate-400">{fmtFullDate(currentDate)}</p>
              </div>
              {status && (
                <span className={`mb-1 inline-block px-3 py-1.5 text-xs font-bold ${STATUS_BG[status.color] ?? STATUS_BG.slate}`}>
                  {status.label}
                </span>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 inline-block border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {indicator.textbook}
        </p>
      </div>

      {/* What Is It? */}
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">What is it?</h2>
        <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
          {indicator.what.map((para, i) => (
            <p key={i} className="text-sm leading-7 text-slate-600">{para}</p>
          ))}
        </div>
      </div>

      {/* How Is It Calculated? */}
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">How is it calculated?</h2>
        <pre className="mt-4 overflow-x-auto bg-slate-950 px-5 py-4 text-xs leading-7 text-emerald-300 font-mono whitespace-pre-wrap">
          {indicator.howCalculated.formula}
        </pre>
        <div className="mt-3 border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Worked Example</p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-700">
            {indicator.howCalculated.example}
          </pre>
        </div>
      </div>

      {/* Why It Matters */}
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Why it matters</h2>
        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-3">
          {indicator.whyMatters.map((item, i) => (
            <div key={i} className="border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-950">{item.heading}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Thresholds */}
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Key thresholds</h2>
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {indicator.thresholds.map((t, i) => {
            const isActive = status?.label === t.label
            return (
              <div
                key={i}
                className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-5 ${
                  THRESHOLD_LEFT[t.color] ?? THRESHOLD_LEFT.slate
                } ${isActive ? 'ring-2 ring-slate-400 ring-offset-1' : ''}`}
              >
                <div className="min-w-[160px]">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {t.label}
                    {isActive && <span className="text-xs font-normal opacity-60">(current)</span>}
                  </p>
                  <p className="mt-0.5 text-xs opacity-70">{t.range}</p>
                </div>
                <p className="flex-1 text-sm leading-6">{t.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Historical Chart */}
      {indicator.fredId && (
        <div className="border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Historical Data</p>
            <p className="mt-0.5 text-base font-semibold text-slate-950">
              {indicator.dataType === 'yoy' ? 'Year-over-Year % Change' : `${indicator.label} Over Time`}
            </p>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="h-56 animate-pulse bg-slate-100" />
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData} margin={{ top: 5, right: 25, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} interval={xInterval} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}${indicator.unit}`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${indicator.showSign && v >= 0 ? '+' : ''}${v.toFixed(indicator.precision)}${indicator.unit}`,
                      indicator.label,
                    ]}
                    contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 2 }}
                  />
                  {indicator.id === 'yield-spread' && (
                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" />
                  )}
                  {indicator.id === 'cpi' && (
                    <ReferenceLine
                      y={2}
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      label={{ value: 'Fed 2% target', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
                    />
                  )}
                  <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Study Resources */}
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Study resources</h2>
        <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2">
          {indicator.resources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
            >
              <div className="min-w-0">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${RESOURCE_TAG[r.tag] ?? RESOURCE_TAG.Related}`}>
                  {r.tag}
                </span>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900">{r.title}</p>
              </div>
              <span className="shrink-0 text-slate-400 text-sm">↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* In the News */}
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">In the news</h2>
        <p className="mt-1 text-xs text-slate-400">Opens a Google News search in a new tab.</p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {indicator.newsSearches.map((n, i) => (
            <a
              key={i}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
            >
              {n.label} <span className="opacity-50">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IndicatorProfile
