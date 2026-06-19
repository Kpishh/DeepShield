import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import History from "./pages/History"

function NavBar() {
  const location = useLocation()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-900/40 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <span className="text-cyan-400 text-sm font-bold">DS</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Deep<span className="text-cyan-400">Shield</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Detect
          </Link>
          <Link
            to="/history"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/history"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  )
}