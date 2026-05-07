import { formatRelativeTime } from '../utils/format'

const typeIcon = (type) => {
  if (type === 'upload_complete') return (
    <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
  )
  if (type === 'upload_error') return (
    <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
  )
  return (
    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
  )
}

export default function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onClose }) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 fade-in z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Notifications</p>
          {unread > 0 && (
            <p className="text-xs text-slate-400">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <p className="text-sm text-slate-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n._id}
              onClick={() => !n.read && onMarkRead(n._id)}
              className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                !n.read ? 'bg-blue-50/40' : ''
              }`}
            >
              {typeIcon(n.type)}
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${!n.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                  {n.message}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
              </div>
              {!n.read && (
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100">
          <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors w-full text-center">
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}
