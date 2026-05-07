import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import Header from './components/Header';
import UploadBox from './components/UploadBox';
import UploadProgressList from './components/UploadProgressList';
import DocumentTable from './components/DocumentTable';
import NotificationPanel from './components/NotificationPanel';
import Toast from './components/Toast';

const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');

export default function App() {
  const [uploads, setUploads] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [docsLoading, setDocsLoading] = useState(true);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
    loadNotifications();
  }, []);

  // Socket.io listeners
  useEffect(() => {
    socket.on('notification', (data) => {
      setNotifications((prev) => [
        { _id: Date.now(), message: data.message, type: data.type, isRead: false, timestamp: data.timestamp },
        ...prev,
      ]);
      showToast(data.message, data.type);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const loadDocuments = async () => {
    try {
      setDocsLoading(true);
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to load documents:', error);
      showToast('Failed to load documents', 'error');
    } finally {
      setDocsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast({ message: '', type: '', isVisible: false });
    }, 3000);
  };

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    const uploadIds = [];

    // Initialize upload entries
    fileArray.forEach((file, index) => {
      const id = `upload-${Date.now()}-${index}`;
      uploadIds.push(id);
      setUploads((prev) => [
        ...prev,
        {
          id,
          filename: file.name,
          fileSize: file.size,
          progress: 0,
          status: 'pending',
          error: null,
        },
      ]);
    });

    let successCount = 0;
    const showBanner = fileArray.length > 3;

    if (showBanner) {
      showToast(`Upload in progress — processing ${fileArray.length} files in background`, 'info');
    }

    // Upload files
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const uploadId = uploadIds[i];

      // Validate file
      if (file.type !== 'application/pdf') {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, status: 'failed', error: 'Only PDF files allowed' }
              : u
          )
        );
        continue;
      }

      if (file.size > 50 * 1024 * 1024) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, status: 'failed', error: 'File size exceeds 50MB' }
              : u
          )
        );
        continue;
      }

      // Update status to uploading
      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId ? { ...u, status: 'uploading', progress: 0 } : u
        )
      );

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/documents/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploads((prev) =>
              prev.map((u) =>
                u.id === uploadId ? { ...u, progress } : u
              )
            );
          },
        });

        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, status: 'completed', progress: 100 }
              : u
          )
        );

        successCount++;
      } catch (error) {
        console.error('Upload failed:', error);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: 'failed',
                  error: error.response?.data?.error || 'Upload failed',
                }
              : u
          )
        );
      }
    }

    // After all uploads complete
    await loadDocuments();

    if (successCount > 0) {
      // Emit upload complete event
      socket.emit('uploadComplete', { count: successCount });

      // Clear uploads after 2 seconds
      setTimeout(() => {
        setUploads([]);
      }, 2000);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(`${API_URL}/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const showCompactProgress = uploads.length > 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        unreadCount={unreadCount}
        onNotificationClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h2>
          <UploadBox onUpload={handleFileUpload} isUploading={uploads.length > 0} />
        </div>

        {/* Progress Section */}
        {uploads.length > 0 && (
          <div>
            {uploads.length > 3 && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium">
                  Upload in progress — processing {uploads.length} files in background
                </p>
              </div>
            )}
            <UploadProgressList uploads={uploads} showCompact={showCompactProgress} />
          </div>
        )}

        {/* Documents Table */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
          <DocumentTable documents={documents} isLoading={docsLoading} />
        </div>
      </main>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        notifications={notifications}
        onClose={() => setIsNotificationPanelOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </div>
  );
}
