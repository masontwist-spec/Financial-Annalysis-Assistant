import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'New Analysis', path: '/company' },
  { label: 'Watchlist', path: '/watchlist' },
  { label: 'Investment Memo', path: '/company#investment-memo' },
  { label: 'Settings', path: '/settings' },
]

function NavBar() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-slate-950">Investment Gates</Link>
          <Link to="/company" className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">New</Link>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-slate-950 px-5 py-6 text-white lg:flex lg:flex-col">
        <Link to="/" className="block">
          <p className="text-xl font-bold">Investment Gates</p>
          <p className="mt-2 text-sm leading-5 text-slate-400">Equity research workspace</p>
        </Link>

        <nav className="mt-10 space-y-2 text-sm font-semibold">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-2.5 transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <p className="mt-2 text-sm text-slate-300">Frontend-only prototype. Local data stays in this browser.</p>
        </div>
      </aside>
    </>
  )
}

export default NavBar
