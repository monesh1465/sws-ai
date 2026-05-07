import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import socket from './utils/socket'
import { fetchDocuments, fetchNotifications, markNotificationRead, markAllRead } from './utils/api'
import Header from './components/Header'
import UploadBox from './components/UploadBox'
import UploadProgressList from './components/UploadProgressList'
import DocumentTable from './components/DocumentTable'
import StatsBar from './components/StatsBar'
import { ToastContainer } from './components/Toast'

let uploadIdCounter = 0
const genId = () => `upload-${++uploadIdCounter}-${Date.now()}`

export default function App() {
  const [documents, setDocuments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [uploads, setUploads] = useState([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [toasts, setToasts] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const activeUploads = useRef(0)

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Load initial data
  useEffect(() => {
    const loadDocs = async () => {
      try {
        const res = await fetchDocuments()
        setDocuments(res.data.documents || [])
      } catch {
        addToast('Failed to load documents', 'error')
      } finally {
        setDocsLoading(false)
      }
    }

    const loadNotifs = async () => {
      try {
        const res = await fetchNotifications()
        setNotifications(res.data.notifications || [])
      } catch (e) {
        console.error('Failed to load notifications', e)
      }
    }

    loadDocs()
    loadNotifs()
  }, [])

  // Socket.io events
  useEffect(() => {
    socket.on('upload_complete', (data) => {
      addToast(`${data.count} file${data.count !== 1 ? 's' : ''} uploaded successfully`, 'success')
      // Refresh docs and notifications
      fetchDocuments().then(res => setDocuments(res.data.documents || []))
      fetchNotifications().then(res => setNotifications(res.data.notifications || []))
    })

    socket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev])
    })

    return () => {
      socket.off('upload_complete')
      socket.off('new_notification')
    }
  }, [addToast])

  const handleUpload = useCallback(async (files) => {
    if (files.length === 0) return

    const newUploads = files.map(file => ({
      id: genId(),
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
    }))

    setUploads(prev => [...newUploads, ...prev])
    setIsUploading(true)
    activeUploads.current += files.length

    // Upload each file individually for per-file progress
    const uploadPromises = newUploads.map(async (uploadItem) => {
      // Mark as uploading
      setUploads(prev =>
        prev.map(u => u.id === uploadItem.id ? { ...u, status: 'uploading' } : u)
      )

      try {
        const formData = new FormData()
        formData.append('files', uploadItem.file)

        await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (evt) => {
            const pct = Math.round((evt.loaded * 100) / evt.total)
            setUploads(prev =>
              prev.map(u => u.id === uploadItem.id ? { ...u, progress: pct } : u)
            )
          },
        })

        setUploads(prev =>
          prev.map(u => u.id === uploadItem.id ? { ...u, status: 'completed', progress: 100 } : u)
        )

        activeUploads.current -= 1

        // Reload docs list
        const res = await fetchDocuments()
        setDocuments(res.data.documents || [])

      } catch (err) {
        setUploads(prev =>
          prev.map(u => u.id === uploadItem.id ? { ...u, status: 'failed' } : u)
        )
        activeUploads.current -= 1
        addToast(`Failed to upload ${uploadItem.name}`, 'error')
      }
    })

    await Promise.all(uploadPromises)

    setIsUploading(false)

    // Refresh notifications after all uploads
    try {
      const notifRes = await fetchNotifications()
      setNotifications(notifRes.data.notifications || [])
    } catch (e) {
      console.error(e)
    }

    // Clear completed uploads after delay
    setTimeout(() => {
      setUploads(prev => prev.filter(u => u.status !== 'completed'))
    }, 5000)
  }, [addToast])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (e) {
      console.error(e)
    }
  }

  const isBulk = uploads.length > 3
  const activeUploadsArr = uploads.filter(u => u.status !== 'completed' || true) // Show all

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Header
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Document Management</h1>
          <p className="text-sm text-slate-400 mt-1">Upload, manage, and access your PDF documents</p>
        </div>

        {/* Stats */}
        <StatsBar documents={documents} />

        {/* Upload area */}
        <UploadBox onUpload={handleUpload} isUploading={isUploading} />

        {/* Upload progress */}
        {activeUploadsArr.length > 0 && (
          <UploadProgressList uploads={activeUploadsArr} isBulk={isBulk} />
        )}

        {/* Document table */}
        <DocumentTable documents={documents} loading={docsLoading} />
      </main>

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
