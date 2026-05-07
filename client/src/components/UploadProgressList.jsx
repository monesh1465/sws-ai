export default function UploadProgressList({ uploads, showCompact }) {
  if (uploads.length === 0) return null;

  return (
    <div className={`space-y-3 ${showCompact ? 'max-h-64 overflow-y-auto' : ''}`}>
      {uploads.map((upload) => (
        <div
          key={upload.id}
          className={`bg-white border border-gray-200 rounded-lg p-4 ${
            showCompact ? 'py-3' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {upload.filename}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(upload.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                upload.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : upload.status === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {upload.status === 'uploading'
                  ? `${upload.progress}%`
                  : upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
              </span>
            </div>
          </div>

          {upload.status === 'uploading' && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${upload.progress}%` }}
              ></div>
            </div>
          )}

          {upload.error && (
            <p className="text-xs text-red-600 mt-2">{upload.error}</p>
          )}
        </div>
      ))}
    </div>
  );
}
