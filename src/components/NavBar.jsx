import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Company Analysis', path: '/company' },
]

function NavBar() {
  return (
    <header className="border-b-2 border-black bg-[#f2eeee]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="pixel-title text-2xl font-black uppercase">Investment Gates</p>
          <p className="mt-1 text-sm font-semibold text-neutral-600">A raw scoring engine for disciplined equity research</p>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'border-2 border-black bg-black px-4 py-2 text-[#f2eeee]'
                  : 'border-2 border-black bg-[#f2eeee] px-4 py-2 text-black transition hover:bg-[#dfd9d9]'
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
