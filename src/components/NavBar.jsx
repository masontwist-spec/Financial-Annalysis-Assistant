import { Link, NavLink } from 'react-router-dom'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/' }],
  },
  {
    label: 'Deep Dives',
    items: [
      { label: 'Yield Curve', path: '/yield-curve' },
      { label: 'Inflation', path: '/inflation' },
      { label: 'Fed Policy', path: '/fed-policy' },
    ],
  },
]

function NavBar() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-950">MacroLab</Link>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-800 bg-slate-950 lg:flex lg:flex-col">
        <div className="border-b border-slate-800 px-5 py-4">
          <Link to="/">
            <p className="text-sm font-bold uppercase tracking-widest text-white">MacroLab</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Economic Dashboard
            </p>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {section.label}
              </p>
              <div className="space-y-px">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center border-l-2 px-3 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? 'border-l-emerald-500 bg-white/5 text-white'
                          : 'border-l-transparent text-slate-400 hover:border-l-slate-600 hover:bg-white/5 hover:text-slate-200'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">FRED API — Live</p>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-600">Federal Reserve Economic Data</p>
        </div>
      </aside>
    </>
  )
}

export default NavBar
