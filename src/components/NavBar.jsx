import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Yield Curve', path: '/yield-curve' },
  { label: 'Inflation', path: '/inflation' },
  { label: 'Fed Policy', path: '/fed-policy' },
]

function NavBar() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
        <Link to="/" className="text-lg font-bold text-slate-950">MacroLab</Link>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-slate-950 px-5 py-6 text-white lg:flex lg:flex-col">
        <Link to="/" className="block">
          <p className="text-xl font-bold tracking-tight">MacroLab</p>
          <p className="mt-1.5 text-sm leading-5 text-slate-400">Macro economics for finance students</p>
        </Link>

        <nav className="mt-10 space-y-1 text-sm font-semibold">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-2.5 transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Data Source</p>
          <p className="mt-2 text-sm text-slate-300">Federal Reserve FRED API — free, official government data updated in real time.</p>
        </div>
      </aside>
    </>
  )
}

export default NavBar
