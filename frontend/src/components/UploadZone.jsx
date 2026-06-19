import { useState, useRef, useCallback } from "react"

export default function UploadZone({ onFileSelect, isLoading }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview]       = useState(null)
  const [fileName, setFileName]     = useState(null)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
    onFileSelect(file)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`
          relative w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer
          ${isDragging
            ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
            : "border-gray-700 bg-gray-900/50 hover:border-cyan-700 hover:bg-gray-900"}
          ${isLoading ? "cursor-not-allowed opacity-60" : ""}
        `}
      >
        {preview ? (
          /* Image Preview */
          <div className="p-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-72 object-contain rounded-xl"
            />
            <p className="text-center text-gray-400 text-sm mt-3">
              📎 {fileName}
              {!isLoading && (
                <span className="text-cyan-400 ml-2 cursor-pointer">
                  (click to change)
                </span>
              )}
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg mb-1">Drop your image here</p>
            <p className="text-gray-500 text-sm mb-4">or click to browse files</p>
            <div className="flex gap-2">
              {["JPG", "PNG", "WEBP"].map(fmt => (
                <span key={fmt} className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs font-mono">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 flex items-center justify-center">
            <p className="text-cyan-400 font-semibold text-lg">Release to upload</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}