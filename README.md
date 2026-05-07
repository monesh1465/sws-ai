# Document Management Dashboard

A minimal, modern full-stack Document Management Dashboard with real-time file uploads, notifications, and document management.

## 🎯 Features

### File Upload System
- ✅ Drag-and-drop PDF upload interface
- ✅ Single and multiple file uploads
- ✅ Individual upload progress bars
- ✅ Real-time file size and status display
- ✅ Upload status tracking (pending, uploading, completed, failed)

### Smart Bulk Upload Notifications
- ✅ Inline progress bars for ≤3 files
- ✅ Banner notification for >3 files ("processing X files in background")
- ✅ Real-time Socket.io notifications
- ✅ Success toast after all uploads complete

### Notification Center
- ✅ Bell icon in header with unread badge count
- ✅ Notification dropdown panel
- ✅ Mark individual notifications as read
- ✅ Mark all notifications as read
- ✅ Persistent notifications in MongoDB
- ✅ Real-time notification updates

### Document Management
- ✅ Document table with filename, upload date, and size
- ✅ Download button for each document
- ✅ Auto-refresh after uploads

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Livvic Font** - Professional typography

### Backend
- **Node.js & Express.js** - REST API
- **MongoDB & Mongoose** - Database
- **Multer** - File upload handling
- **Socket.io** - Real-time events
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

## 📁 Project Structure

```
sws-ai/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Header.jsx
│   │   │   ├── UploadBox.jsx
│   │   │   ├── UploadProgressList.jsx
│   │   │   ├── DocumentTable.jsx
│   │   │   ├── NotificationPanel.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                      # Express backend
│   ├── models/
│   │   ├── Document.js          # Document schema
│   │   └── Notification.js      # Notification schema
│   ├── routes/
│   │   ├── documents.js         # Document APIs
│   │   └── notifications.js     # Notification APIs
│   ├── controllers/
│   │   ├── documentController.js
│   │   └── notificationController.js
│   ├── uploads/                 # Uploaded PDFs folder
│   ├── server.js                # Express server
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+ installed
- MongoDB running locally (or update `.env` with remote URI)

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Setup Environment Variables

```bash
# Create .env from template
cd server
cp .env.example .env
cd ..
```

### 4. Start MongoDB
```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or if installed locally
mongod
```

### 5. Run Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend will run on http://localhost:5173
```

### 6. Open Dashboard
Open your browser and navigate to: **http://localhost:5173**

---

## 📚 API Endpoints

### Documents
- `POST /api/documents/upload` - Upload a PDF file
- `GET /api/documents` - Get all documents
- `DELETE /api/documents/:id` - Delete a document

### Notifications
- `GET /api/notifications` - Get all notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read

---

## 🎨 UI Components

### Header
Sticky header with app logo and notification bell icon with unread badge.

### UploadBox
Drag-and-drop area with file input selector. Supports PDF files up to 50MB.

### UploadProgressList
Shows individual progress bars for each uploaded file with:
- Filename
- File size
- Upload percentage
- Status badge (pending, uploading, completed, failed)

### DocumentTable
Displays all uploaded documents with:
- Filename
- Upload date & time
- File size
- Download button

### NotificationPanel
Dropdown panel with:
- All notifications sorted by timestamp
- "Mark as read" on click
- "Mark all as read" button
- Unread notification indicator

### Toast
Floating notification toast for upload success/error messages.

---

## 🔧 Configuration

### MongoDB Connection
Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/document-dashboard
NODE_ENV=development
```

### Frontend API URL
Edit `client/src/App.jsx` - `API_URL` constant:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 📝 Development

### Add New Features
1. Create new components in `client/src/components/`
2. Create new routes in `server/routes/`
3. Create new models in `server/models/`
4. Create controllers in `server/controllers/`

### Styling
Uses Tailwind CSS. Edit `client/tailwind.config.js` to customize.

### Real-time Updates
Socket.io is configured in `server/server.js` and `client/src/App.jsx`.

---

## ✅ Testing the Dashboard

1. **Upload Single File**
   - Drag a PDF or click "Select Files"
   - Watch progress bar update
   - Document appears in table after upload

2. **Upload Multiple Files (≤3)**
   - Select 2-3 PDF files
   - Progress bars show inline
   - Success toast appears

3. **Upload Multiple Files (>3)**
   - Select 4+ PDF files
   - Blue banner appears ("processing X files in background")
   - Progress bars compact to save space
   - Success notification in panel

4. **Notifications**
   - Upload files to trigger notifications
   - Click bell icon to see notification panel
   - Click notification to mark as read
   - Unread badge updates

5. **Persistence**
   - Refresh page
   - Documents and notifications persist

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Port Already in Use
- Backend: `lsof -i :5000` and kill process
- Frontend: `lsof -i :5173` and kill process

### CORS Error
- Ensure backend runs on `http://localhost:5000`
- Ensure frontend runs on `http://localhost:5173`

### File Upload Fails
- Check file is PDF format
- Check file size < 50MB
- Check `server/uploads/` folder exists

---

## 📄 License

MIT License - feel free to use and modify

---

## 🎓 Built With

- React, Vite, Tailwind CSS
- Express.js, MongoDB, Mongoose
- Socket.io, Multer, Axios

Enjoy! 🚀
