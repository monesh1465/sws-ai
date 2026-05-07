# Quick Start Guide - 3 Minutes ⚡

## Step 1: Prerequisites (1 min)
```bash
# Make sure you have Node.js 16+
node --version

# Make sure MongoDB is running
# Option A: Local MongoDB
mongod

# Option B: Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

## Step 2: Install & Setup (1 min)
```bash
# From project root
cd server && npm install && cd ..
cd client && npm install && cd ..

# Create .env file
cd server
cp .env.example .env
cd ..
```

## Step 3: Run Both Servers (1 min)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# Waits for ✓ Server running on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
# Waits for ✓ Local: http://localhost:5173
```

## Step 4: Open Dashboard
Visit: **http://localhost:5173**

---

## 🎯 Test It Out

1. **Upload a PDF** - Drag and drop or click "Select Files"
2. **See Progress** - Watch the progress bar update
3. **View Document** - See it appear in the Documents table
4. **Check Notifications** - Click the bell icon in top-right
5. **Refresh Page** - Everything persists!

---

## 💡 That's It!

Your Document Management Dashboard is now running. 

**Tip:** To upload multiple files at once, select 2+ PDFs and watch the upload handling adapt!

---

## 🆘 Issues?

- Backend won't start? Check MongoDB is running
- Port error? Another app is using 5000 or 5173
- File upload fails? Make sure it's a PDF < 50MB

For full docs, see `README.md`
