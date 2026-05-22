import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Company Analysis', path: '/company' },
]

function NavBar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-emerald-300">Investment Gates</p>
          <p className="text-sm text-slate-400">A modern framework for disciplined equity research</p>
        </div>

        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-200 transition'
                  : 'rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-slate-100'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default NavBar
