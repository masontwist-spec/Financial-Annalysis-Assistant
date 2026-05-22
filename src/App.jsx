import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CompanyAnalysis from './pages/CompanyAnalysis'
import Watchlist from './pages/Watchlist'
import Settings from './pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <NavBar />
      <main className="px-4 py-6 sm:px-6 lg:ml-72 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<CompanyAnalysis />} />
          <Route path="/company/:analysisId" element={<CompanyAnalysis />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
