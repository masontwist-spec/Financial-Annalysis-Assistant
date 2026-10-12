import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import { getWithYoY, getYoYHistory } from '../services/fredService'

const fmtDate = (d) => {
  const [year, month] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(month) - 1]} '${year.slice(2)}`
}

const fmtFullDate = (d) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const getCpiStatus = (v) => {
  if (v === null) return { label: '—', style: 'bg-slate-100 text-slate-700' }
  if (v >= 4) return { label: 'High', style: 'bg-red-100 text-red-800' }
  if (v >= 2.5) return { label: 'Elevated', style: 'bg-amber-100 text-amber-800' }
  if (v >= 1.5) return { label: 'Near Target', style: 'bg-emerald-100 text-emerald-800' }
  return { label: 'Below Target', style: 'bg-blue-100 text-blue-800' }
}

function Inflation() {
  const [headline, setHeadline] = useState(null)
  const [core, setCore] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [headlineYoY, coreYoY, headlineHist, coreHist] = await Promise.all([
          getWithYoY('CPIAUCSL'),
          getWithYoY('CPILFESL'),
          getYoYHistory('CPIAUCSL', 36),
          getYoYHistory('CPILFESL', 36),
        ])

        setHeadline(headlineYoY)
        setCore(coreYoY)

        const combined = headlineHist.map((point, i) => ({
          label: fmtDate(point.date),
          headline: point.value,
          core: coreHist[i]?.value ?? null,
        }))
        setChartData(combined)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const headlineVal = headline?.yoy ? Number(headline.yoy) : null
  const coreVal = core?.yoy ? Number(core.yoy) : null
  const headlineStatus = getCpiStatus(headlineVal)
  const coreStatus = getCpiStatus(coreVal)

  if (loading) return <div className="pixel-panel p-8 text-slate-500">Loading inflation data...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div>

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Inflation</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Consumer Price Index</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          CPI measures the average change in prices paid by consumers. The Federal Reserve targets 2% inflation as the definition of price stability.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="pixel-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Headline CPI (YoY)</p>
          <p className="mt-3 text-5xl font-semibold tabular-nums text-slate-950">
            {headlineVal !== null ? `${headlineVal.toFixed(1)}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">{fmtFullDate(headline?.latest?.date)}</p>
          <span className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${headlineStatus.style}`}>
            {headlineStatus.label}
          </span>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            All items including food and energy. This is the number most widely reported in the news and felt directly by consumers at the grocery store and gas pump.
          </p>
        </div>

        <div className="pixel-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Core CPI (YoY)</p>
          <p className="mt-3 text-5xl font-semibold tabular-nums text-slate-950">
            {coreVal !== null ? `${coreVal.toFixed(1)}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">{fmtFullDate(core?.latest?.date)}</p>
          <span className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${coreStatus.style}`}>
            {coreStatus.label}
          </span>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Excludes volatile food and energy prices. The Fed watches Core CPI more closely when setting policy because it better reflects persistent, underlying inflation trends.
          </p>
        </div>
      </div>

      <div className="pixel-panel overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">3-Year Trend</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Headline vs. Core Inflation</h2>
          <p className="mt-1 text-sm text-slate-600">Year-over-year % change. Dashed line marks the Fed's 2% target.</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} interval={5} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v, name) => [`${v.toFixed(1)}%`, name === 'headline' ? 'Headline CPI' : 'Core CPI']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <ReferenceLine
                y={2}
                stroke="#94a3b8"
                strokeDasharray="5 5"
                label={{ value: 'Fed Target 2%', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
              />
              <Legend
                formatter={(v) => v === 'headline' ? 'Headline CPI' : 'Core CPI'}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line type="monotone" dataKey="headline" stroke="#059669" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="core" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section className="pixel-panel p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-950">What to know for class</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-slate-950">Headline vs. Core CPI</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Headline CPI captures the full basket of consumer goods. Core CPI removes food and energy because they're driven by supply shocks — weather, geopolitics — that monetary policy can't fix. The Fed actually targets PCE inflation, not CPI, but CPI is the most widely cited public measure.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">The Fisher Effect</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Real interest rate ≈ Nominal rate − Inflation. When inflation rises, lenders demand higher nominal rates to preserve real returns. This is why rising inflation leads to rising interest rates — and why bond prices fall when inflation surprises to the upside.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Why the Fed targets 2% and not 0%</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A small positive inflation rate gives the Fed room to cut real rates below zero when needed, and prevents the deflation trap — where falling prices cause consumers to delay spending, compounding the downturn. Zero inflation leaves no buffer. The 2% target has been in place since 2012.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Inflation and bond duration</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bond prices move inversely with yields, and yields rise when inflation expectations increase. A 1% surprise jump in inflation can cause significant losses on long-duration bonds. Duration quantifies a bond's sensitivity to rate changes — higher duration means higher inflation risk.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Inflation
