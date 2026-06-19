import { useState, useEffect } from "react"
import { getHistory } from "../api/deepshield"

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getHistory(50)
        setHistory(data.history)
      } catch {
        setError("Could not load history. Is the backend running?")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Detection History</h1>
          <p className="text-gray-500 mt-1">All past image analyses stored in database</p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent
              rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading history...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-6 py-4">
            <p className="text-red-400">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-400 font-medium">No detections yet</p>
            <p className="text-gray-600 text-sm mt-1">Analyze some images first!</p>
          </div>
        )}

        {/* Table */}
        {history.length > 0 && (
          <div className="rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800">
                  {["ID", "Filename", "Type", "Prediction", "Confidence", "Date"].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-medium
                      text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 text-sm font-mono">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm max-w-48 truncate">
                      {item.filename}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">
                        {item.media_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${item.prediction === "AI-Generated"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-300">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}