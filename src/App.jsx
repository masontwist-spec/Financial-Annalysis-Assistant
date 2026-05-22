import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CompanyAnalysis from './pages/CompanyAnalysis'
import Watchlist from './pages/Watchlist'

function App() {
  return (
    <div className="min-h-screen bg-[#f4f1ec] text-black">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<CompanyAnalysis />} />
          <Route path="/company/:analysisId" element={<CompanyAnalysis />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
