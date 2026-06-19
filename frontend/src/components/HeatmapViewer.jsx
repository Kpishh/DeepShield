import { useState } from "react"

export default function HeatmapViewer({ original, heatmap }) {
  const [showHeatmap, setShowHeatmap] = useState(true)

  return (
    <div className="w-full rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Explainability View</p>
          <p className="text-gray-500 text-xs mt-0.5">
            Red regions = areas the AI focused on most
          </p>
        </div>
        {/* Toggle */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setShowHeatmap(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${!showHeatmap ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Original
          </button>
          <button
            onClick={() => setShowHeatmap(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${showHeatmap ? "bg-cyan-500/30 text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
          >
            Heatmap
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="p-4">
        <div className="relative rounded-xl overflow-hidden bg-gray-800">
          <img
            src={showHeatmap ? heatmap : original}
            alt={showHeatmap ? "Grad-CAM Heatmap" : "Original Image"}
            className="w-full object-contain max-h-72 transition-opacity duration-300"
          />
          {showHeatmap && (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm
              rounded-lg px-2 py-1">
              <p className="text-cyan-400 text-xs font-mono">GRAD-CAM</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 pb-4 flex items-center gap-4">
        <p className="text-gray-600 text-xs">Attention map:</p>
        <div className="flex items-center gap-1">
          <div className="w-16 h-2 rounded-full"
            style={{background: "linear-gradient(to right, #00f, #0ff, #0f0, #ff0, #f00)"}} />
        </div>
        <div className="flex justify-between w-16">
          <span className="text-blue-400 text-xs">Low</span>
          <span className="text-red-400 text-xs">High</span>
        </div>
      </div>
    </div>
  )
}