import { useState, useRef, useCallback } from 'react'

export default function UploadBox({ onUpload, isUploading }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = useCallback((files) => {
    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf')
    if (pdfs.length === 0) return
    onUpload(pdfs)
  }, [onUpload])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Upload Documents</h2>
          <p className="text-xs text-slate-400 mt-0.5">PDF files only · Single or multiple upload</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Browse files
        </button>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl transition-all cursor-pointer
          flex flex-col items-center justify-center py-10 px-6
          ${dragging
            ? 'border-blue-400 bg-blue-50 drop-active'
            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 bg-slate-50/50'
          }
          ${isUploading ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        {/* Cloud upload icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${dragging ? 'bg-blue-100' : 'bg-white border border-slate-200'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#2563eb' : '#94a3b8'} strokeWidth="1.75" strokeLinecap="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>

        {dragging ? (
          <p className="text-sm font-semibold text-blue-700">Drop your PDFs here</p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-600">Drag & drop PDFs here</p>
            <p className="text-xs text-slate-400 mt-1">or click to browse from your device</p>
          </>
        )}

        <div className="flex items-center gap-3 mt-5">
          {['PDF', 'Multiple files', 'No size limit'].map((tag, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] text-slate-400">
              {i > 0 && <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {tag}
            </span>
          ))}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="application/pdf"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>
    </div>
  )
}
