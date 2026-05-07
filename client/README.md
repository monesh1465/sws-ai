# DocVault — Document Management Dashboard

A minimal, professional full-stack Document Management System with real-time upload tracking, smart bulk notifications, and a persistent notification center.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS, Axios, Socket.io-client |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB + Mongoose |
| File Storage | Multer (local `uploads/` folder) |
| Font | Livvic (Google Fonts) |

---

## Features

- **Drag & Drop PDF Upload** — Single or multiple files
- **Per-file Progress Bars** — With filename, size, and status badges
- **Smart Bulk Banner** — Shows background-processing notice when > 3 files
- **Real-time Notifications** — Socket.io emits events when uploads complete
- **Notification Center** — Bell icon with unread count, mark as read, persists after refresh
- **Document Table** — Lists all uploaded files with download links
- **Stats Bar** — Total files, storage used, files today

---

## Project Structure

```
dms/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UploadBox.jsx
│   │   │   ├── UploadProgressList.jsx
│   │   │   ├── DocumentTable.jsx
│   │   │   ├── NotificationPanel.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   └── Toast.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── format.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                  # Express backend
    ├── models/
    │   ├── Document.js
    │   └── Notification.js
    ├── routes/
    │   ├── upload.js
    │   ├── documents.js
    │   └── notifications.js
    ├── config/
    │   └── multer.js
    ├── uploads/             # Stored PDF files
    ├── index.js
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or a MongoDB Atlas URI)
- npm or yarn

---

### 1. Clone / Download

```bash
git clone <repo-url>
cd dms
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

Edit `.env` if your MongoDB URI is different:

```env
MONGO_URI=mongodb://localhost:27017/docvault
PORT=5000
```

Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server runs at **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend runs at **http://localhost:5173**

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload one or more PDFs (multipart/form-data, field: `files`) |
| `GET` | `/api/documents` | List all uploaded documents |
| `GET` | `/api/notifications` | List all notifications |
| `PATCH` | `/api/notifications/:id/read` | Mark a notification as read |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read |
| `GET` | `/api/health` | Server health check |

---

## Socket.io Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `upload_complete` | Server → Client | `{ count, documents }` |
| `new_notification` | Server → Client | Notification object |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/docvault` | MongoDB connection string |
| `PORT` | `5000` | Server port |

---

## Design Decisions

- **Minimal white-and-blue palette** — Clean SaaS admin aesthetic with Livvic font
- **Individual file uploads** — Each file is uploaded separately so per-file progress is accurate
- **Bulk banner threshold** — > 3 simultaneous uploads triggers the background-processing banner
- **Notifications persist** — Stored in MongoDB, survive page refreshes
- **No auth, no Redux** — Kept intentionally simple per requirements

---

## Notes

- Only PDF files are accepted (enforced on both frontend and backend)
- Max file size: 50MB per file
- Uploaded files are stored in `server/uploads/`
- On production, replace local file storage with S3 or similar
