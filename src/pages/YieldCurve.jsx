import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { getLatest, getHistory, YIELD_MATURITIES } from '../services/fredService'

const fmtDate = (d) => {
  const [year, month] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(month) - 1]} '${year.slice(2)}`
}

function YieldCurve() {
  const [curveData, setCurveData] = useState([])
  const [spreadHistory, setSpreadHistory] = useState([])
  const [spread, setSpread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [maturities, spreadHist] = await Promise.all([
          Promise.allSettled(YIELD_MATURITIES.map((m) => getLatest(m.id))),
          getHistory('T10Y2Y', 48),
        ])

        const curve = YIELD_MATURITIES.map((m, i) => {
          const result = maturities[i]
          return {
            label: m.label,
            yield: result.status === 'fulfilled' && result.value
              ? parseFloat(Number(result.value.value).toFixed(2))
              : null,
          }
        }).filter((d) => d.yield !== null)

        const spreadData = spreadHist.map((obs) => ({
          label: fmtDate(obs.date),
          value: parseFloat(Number(obs.value).toFixed(2)),
        }))

        const latestSpread = spreadHist[spreadHist.length - 1]

        setCurveData(curve)
        setSpreadHistory(spreadData)
        setSpread(latestSpread ? Number(latestSpread.value) : null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const isInverted = spread !== null && spread < 0
  const isFlat = spread !== null && spread >= 0 && spread < 0.5
  const spreadLabel = spread !== null ? `${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%` : '—'

  const curveStatus = isInverted
    ? { label: 'Inverted', style: 'bg-red-100 text-red-800' }
    : isFlat
    ? { label: 'Flat', style: 'bg-amber-100 text-amber-800' }
    : { label: 'Normal', style: 'bg-emerald-100 text-emerald-800' }

  const lineColor = isInverted ? '#ef4444' : isFlat ? '#f59e0b' : '#059669'

  const interpretation = isInverted
    ? 'The yield curve is currently inverted — short-term rates exceed long-term rates. This has preceded every US recession since 1955. It signals that markets expect the Fed to cut rates in the future, typically in response to slowing growth.'
    : isFlat
    ? 'The yield curve is flat — the gap between short and long-term rates is narrow. This often signals a transition between a normal and inverted curve, and warrants close attention.'
    : 'The yield curve has a normal upward slope — long-term rates exceed short-term rates. This reflects a healthy growth environment and compensates investors for the time risk of holding longer-maturity bonds.'

  if (loading) return <div className="pixel-panel p-8 text-slate-500">Loading yield curve data...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div>

  return (
    <div className="space-y-8">
      <div className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Yield Curve</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Term Structure of Interest Rates</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The yield curve plots US Treasury yields across maturities. Its shape is one of the most closely watched signals in all of macroeconomics.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.32fr_0.68fr]">
        <div className="pixel-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">10Y – 2Y Spread</p>
          <p className="mt-3 text-5xl font-semibold tabular-nums text-slate-950">{spreadLabel}</p>
          <span className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${curveStatus.style}`}>
            {curveStatus.label}
          </span>
          <p className="mt-5 text-sm leading-6 text-slate-600">{interpretation}</p>
        </div>

        <div className="pixel-panel p-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">Current Yield Curve</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={curveData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} />
              <Tooltip
                formatter={(v) => [`${v.toFixed(2)}%`, 'Yield']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Line
                type="monotone"
                dataKey="yield"
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: lineColor }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pixel-panel overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Spread History</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">10Y – 2Y Spread over time</h2>
          <p className="mt-1 text-sm text-slate-600">When the line crosses below 0%, the curve is inverted.</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={spreadHistory} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} interval={7} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v) => [`${v >= 0 ? '+' : ''}${v.toFixed(2)}%`, 'Spread']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <ReferenceLine
                y={0}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: 'Inversion threshold', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }}
              />
              <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section className="pixel-panel p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-950">What to know for class</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-slate-950">What the yield curve shows</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A normal yield curve slopes upward — investors demand higher yields for lending money longer, compensating for time risk and inflation uncertainty. The 2-year yield is tightly anchored to current Fed policy. The 10-year reflects long-run growth and inflation expectations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Why inversion predicts recessions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              When the curve inverts, bond markets are pricing in future rate cuts — which only happen when the economy slows. The spread has preceded every US recession since 1955. The typical lag is 6–18 months, meaning inversion is an early warning signal, not an immediate one.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Pure Expectations Theory</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This theory says long-term rates equal the expected average of future short-term rates. If markets expect the Fed to cut rates (recession incoming), those expected future short rates pull long-term yields below current short-term yields — inverting the curve.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Liquidity Preference & Term Premium</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The Liquidity Preference Theory adds a term premium on top of rate expectations — compensation for holding less liquid, longer-dated bonds. This is why normal curves slope upward even when rate expectations are flat, and why deep inversions send such a strong signal despite the premium.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default YieldCurve
