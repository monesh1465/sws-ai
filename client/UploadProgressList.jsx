import { formatBytes } from '../utils/format'

const StatusBadge = ({ status }) => {
  const styles = {
    pending:    'bg-slate-100 text-slate-500',
    uploading:  'bg-blue-50 text-blue-600',
    completed:  'bg-green-50 text-green-600',
    failed:     'bg-red-50 text-red-500',
  }
  const icons = {
    pending: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    uploading: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
    ),
    completed: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    ),
    failed: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    ),
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  )
}

export default function UploadProgressList({ uploads, isBulk }) {
  if (uploads.length === 0) return null

  const allDone = uploads.every(u => u.status === 'completed' || u.status === 'failed')
  const inProgress = uploads.filter(u => u.status === 'uploading' || u.status === 'pending').length

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden fade-in">
      {/* Bulk banner */}
      {isBulk && !allDone && (
        <div className="bg-blue-600 px-5 py-3 flex items-center gap-3">
          <div className="w-5 h-5 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="animate-pulse">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
          </div>
          <p className="text-white text-sm font-medium">
            Upload in progress — processing <span className="font-bold">{inProgress}</span> file{inProgress !== 1 ? 's' : ''} in background
          </p>
        </div>
      )}

      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">
            {allDone ? 'Upload Complete' : 'Uploading Files'}
          </p>
          <p className="text-xs text-slate-400">
            {uploads.filter(u => u.status === 'completed').length}/{uploads.length} done
          </p>
        </div>

        <div className={`space-y-${isBulk ? '2' : '3'}`}>
          {uploads.map(upload => (
            <div key={upload.id} className={`${isBulk ? '' : ''}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {/* PDF icon */}
                  <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[160px]">{upload.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-slate-400">{formatBytes(upload.size)}</span>
                  <StatusBadge status={upload.status} />
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
                    upload.status === 'completed' ? 'bg-green-400' :
                    upload.status === 'failed' ? 'bg-red-400' :
                    upload.status === 'uploading' ? 'progress-shimmer' : 'bg-slate-200'
                  }`}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>

              {!isBulk && (
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-slate-400">{upload.progress}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
