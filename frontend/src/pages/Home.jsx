import { useState } from "react"
import UploadZone from "../components/UploadZone"
import ResultCard from "../components/ResultCard"
import HeatmapViewer from "../components/HeatmapViewer"
import { predictImage } from "../api/deepshield"

export default function Home() {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setResult(null)
    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(selectedFile)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const data = await predictImage(file)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20
            rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-sm font-medium">AI Detection Engine Active</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Is it <span className="text-cyan-400">real</span> or{" "}
            <span className="text-red-400">AI-generated</span>?
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload any image and DeepShield's neural network will detect if it was
            created by AI - with visual explainability showing exactly why.
          </p>
        </div>

        {/* Limitations & Coming Soon Banner */}
        <div className="mt-6 max-w-2xl mx-auto space-y-3 mb-8">
          
          {/* Current Limitation */}
          <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 
            rounded-xl px-4 py-3 text-left">
            <span className="text-yellow-400 mt-0.5">⚠️</span>
            <p className="text-yellow-300/80 text-sm">
              <span className="font-semibold text-yellow-400">Current limitation:</span> DeepShield 
              is optimized for detecting GAN-generated faces (e.g. 
              <a href="https://thispersondoesnotexist.com" target="_blank" 
                className="underline ml-1 hover:text-yellow-300">
                thispersondoesnotexist.com
              </a>). 
              Detection of latest diffusion-based images (ChatGPT, Claude, etc) 
              is an active area of improvement.
            </p>
          </div>

          {/* Coming Soon */}
          <div className="flex items-start gap-3 bg-cyan-500/10 border border-cyan-500/20 
            rounded-xl px-4 py-3 text-left">
            <span className="text-cyan-400 mt-0.5">🚀</span>
            <p className="text-cyan-300/80 text-sm">
              <span className="font-semibold text-cyan-400">Coming soon:</span> Diffusion model 
              detection, user accounts with private history, video deepfake analysis, 
              and browser extension.
            </p>
          </div>

        </div>


        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Upload */}
          <div className="flex flex-col gap-4">
            <UploadZone onFileSelect={handleFileSelect} isLoading={loading} />

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all
                ${file && !loading
                  ? "bg-cyan-500 hover:bg-cyan-400 text-gray-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01]"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : "🔍 Analyze Image"}
            </button>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
              </div>
            )}

            {/* Result Card */}
            {result && <ResultCard result={result} />}
          </div>

          {/* Right — Heatmap or Placeholder */}
          <div className="flex flex-col gap-4">
            {result ? (
              <HeatmapViewer original={preview} heatmap={result.heatmap} />
            ) : (
              <div className="w-full h-full min-h-64 rounded-2xl border-2 border-dashed
                border-gray-800 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center
                  justify-center mb-4">
                  <span className="text-3xl">🧠</span>
                </div>
                <p className="text-gray-500 font-medium">Explainability heatmap</p>
                <p className="text-gray-700 text-sm mt-1">
                  Upload and analyze an image to see which regions the AI focused on
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}