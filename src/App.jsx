import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import YieldCurve from './pages/YieldCurve'
import Inflation from './pages/Inflation'
import FedPolicy from './pages/FedPolicy'
import IndicatorProfile from './pages/IndicatorProfile'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <NavBar />
      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/indicator/:id" element={<IndicatorProfile />} />
          <Route path="/yield-curve" element={<YieldCurve />} />
          <Route path="/inflation" element={<Inflation />} />
          <Route path="/fed-policy" element={<FedPolicy />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
