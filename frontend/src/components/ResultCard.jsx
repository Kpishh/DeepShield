export default function ResultCard({ result }) {
  const isFake       = result.prediction === "AI-Generated"
  const confidencePct = (result.confidence * 100).toFixed(1)

  return (
    <div className="w-full rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">

      {/* Header */}
      <div className={`px-6 py-4 border-b border-gray-800 flex items-center justify-between
        ${isFake ? "bg-red-500/5" : "bg-green-500/5"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse
            ${isFake ? "bg-red-400" : "bg-green-400"}`} />
          <span className="text-white font-bold text-lg">
            {isFake ? "⚠️ AI-Generated" : "✅ Authentic"}
          </span>
        </div>
        <span className={`text-2xl font-bold font-mono
          ${isFake ? "text-red-400" : "text-green-400"}`}>
          {confidencePct}%
        </span>
      </div>

      {/* Confidence Bar */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Confidence</span>
          <span>{confidencePct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000
              ${isFake ? "bg-red-400" : "bg-green-400"}`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {/* Probability Breakdown */}
      <div className="px-6 py-4 border-b border-gray-800">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">
          Probability Breakdown
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* FAKE */}
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-red-400 text-xs font-medium mb-1">AI-Generated</p>
            <p className="text-white font-bold text-xl font-mono">
              {(result.all_probs.FAKE * 100).toFixed(1)}%
            </p>
          </div>
          {/* REAL */}
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3">
            <p className="text-green-400 text-xs font-medium mb-1">Authentic</p>
            <p className="text-white font-bold text-xl font-mono">
              {(result.all_probs.REAL * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="px-6 py-3 flex items-center justify-between">
        <span className="text-gray-600 text-xs">📁 {result.filename}</span>
        <span className="text-gray-600 text-xs">ID #{result.id}</span>
      </div>
    </div>
  )
}