# Detailed Setup Guide

## Complete Installation Instructions

### Part 1: System Requirements

Check you have Node.js installed:
```bash
node --version
# Should show v16.0.0 or higher
```

If not, download from: https://nodejs.org/

### Part 2: MongoDB Setup

#### Option A: Local MongoDB Installation
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download installer from https://www.mongodb.com/try/download/community
# Follow installation wizard
```

#### Option B: Docker (Recommended)
```bash
# Install Docker: https://www.docker.com/products/docker-desktop

# Run MongoDB container
docker run -d \
  -p 27017:27017 \
  --name document-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo

# Verify it's running
docker ps | grep document-mongodb
```

### Part 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if using Docker MongoDB with auth
# MONGODB_URI=mongodb://admin:password@localhost:27017/document-dashboard?authSource=admin
```

**Dependencies installed:**
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `multer` - File upload middleware
- `socket.io` - Real-time events
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `nodemon` - Dev server auto-reload

### Part 4: Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Verify Vite is configured
# (vite.config.js already created)

# Verify Tailwind CSS is configured
# (tailwind.config.js already created)
```

**Dependencies installed:**
- `react` - UI library
- `react-dom` - React DOM
- `vite` - Build tool
- `axios` - HTTP client
- `socket.io-client` - Real-time client
- `tailwindcss` - CSS framework

### Part 5: Running the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev

# Expected output:
# ✓ MongoDB connected
# ✓ Server running on http://localhost:5000
# ✓ Socket.io listening for real-time events
```

**Terminal 2 - Frontend Dev Server:**
```bash
cd client
npm run dev

# Expected output:
# ✓ ready in XXms
# ➜ Local: http://localhost:5173
```

### Part 6: Accessing the Dashboard

1. Open browser
2. Go to: http://localhost:5173
3. You should see the Document Management Dashboard

---

## Environment Variables

### Server (.env)

```env
# Server Port
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/document-dashboard

# Environment
NODE_ENV=development
```

### Frontend (hardcoded in App.jsx)

```javascript
const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');
```

---

## Project Folder Structure Explained

### Backend Structure
```
server/
├── models/
│   ├── Document.js          # Mongoose schema for documents
│   └── Notification.js      # Mongoose schema for notifications
│
├── routes/
│   ├── documents.js         # REST endpoints for files
│   └── notifications.js     # REST endpoints for notifications
│
├── controllers/
│   ├── documentController.js    # Business logic for documents
│   └── notificationController.js # Business logic for notifications
│
├── uploads/                 # Folder where PDFs are saved
├── server.js               # Main Express server
├── package.json
├── .env.example
└── .gitignore
```

### Frontend Structure
```
client/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Top navigation bar
│   │   ├── UploadBox.jsx           # Drag-drop upload area
│   │   ├── UploadProgressList.jsx  # File upload progress
│   │   ├── DocumentTable.jsx       # Table of all documents
│   │   ├── NotificationPanel.jsx   # Bell icon panel
│   │   └── Toast.jsx               # Floating notifications
│   │
│   ├── App.jsx              # Main component & state management
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind CSS imports
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## API Endpoints Reference

### Document Upload
```http
POST /api/documents/upload
Content-Type: multipart/form-data

Body: { file: <PDF file> }

Response: {
  "success": true,
  "document": {
    "id": "xxx",
    "filename": "my-doc.pdf",
    "fileSize": 1024000,
    "uploadedAt": "2024-01-01T10:00:00Z"
  }
}
```

### Get All Documents
```http
GET /api/documents

Response: [
  {
    "id": "xxx",
    "filename": "doc1.pdf",
    "fileSize": 1024000,
    "uploadedAt": "2024-01-01T10:00:00Z"
  }
]
```

### Get Notifications
```http
GET /api/notifications

Response: [
  {
    "_id": "xxx",
    "message": "2 files uploaded successfully",
    "type": "success",
    "isRead": false,
    "timestamp": "2024-01-01T10:00:00Z"
  }
]
```

### Mark Notification as Read
```http
PATCH /api/notifications/:id/read

Response: { notification object with isRead: true }
```

### Mark All Notifications as Read
```http
PATCH /api/notifications/read-all

Response: { "success": true, "message": "All notifications marked as read" }
```

---

## File Upload Configuration

**Upload Location:** `server/uploads/`

**File Restrictions:**
- Only PDF files allowed
- Maximum 50MB per file
- Multiple files supported

**How It Works:**
1. Frontend validates file type & size
2. Multer stores file in `uploads/` folder
3. Document metadata saved to MongoDB
4. Frontend receives document object
5. Table refreshes automatically

---

## Socket.io Real-time Events

### uploadComplete (Client → Server)
Fired when frontend finishes uploading files
```javascript
socket.emit('uploadComplete', { count: 3 });
```

### notification (Server → Client)
Sent to all clients when uploads complete
```javascript
socket.on('notification', (data) => {
  // data: { message, type, timestamp }
});
```

---

## Development Tips

### Hot Reload
- **Backend:** Nodemon auto-restarts on file changes
- **Frontend:** Vite HMR auto-updates

### Database Inspection
```bash
# Connect to MongoDB
mongosh

# View databases
show databases

# Use document-dashboard database
use document-dashboard

# View collections
show collections

# View documents
db.documents.find()
db.notifications.find()
```

### Browser DevTools
- Check Network tab for API calls
- Check Console for Socket.io events
- Check Application tab for data

---

## Troubleshooting

### Server won't start
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
→ MongoDB not running. Start with `mongod` or Docker

### Port already in use
```bash
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Kill process using port 5173
lsof -i :5173
kill -9 <PID>
```

### File upload fails
- Check file is .pdf format
- Check file size < 50MB
- Check `server/uploads/` folder exists
- Check server logs for multer errors

### MongoDB connection timeout
- Verify MongoDB is running
- Check connection string in .env
- Increase timeout in `mongoose.connect()`

---

## Next Steps

1. ✅ Follow this setup guide
2. ✅ Verify all components load
3. ✅ Test file upload
4. ✅ Test notifications
5. ✅ Read the main README.md for architecture details

Enjoy your Document Management Dashboard! 🚀
