const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const Document = require('../models/Document')
const Notification = require('../models/Notification')

// POST /api/upload
router.post('/', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' })
    }

    const io = req.app.get('io')

    // Save each file's metadata to MongoDB
    const savedDocs = await Promise.all(
      req.files.map(async (file) => {
        const doc = new Document({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          path: file.path,
        })
        return doc.save()
      })
    )

    const count = savedDocs.length

    // Create a notification
    const notif = new Notification({
      message: count === 1
        ? `"${savedDocs[0].originalName}" uploaded successfully`
        : `${count} files uploaded successfully`,
      type: 'upload_complete',
      metadata: { count, fileIds: savedDocs.map(d => d._id) },
    })
    await notif.save()

    // Emit socket events
    if (io) {
      io.emit('upload_complete', { count, documents: savedDocs })
      io.emit('new_notification', notif)
    }

    res.json({
      success: true,
      message: `${count} file(s) uploaded`,
      documents: savedDocs,
    })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ success: false, message: err.message || 'Upload failed' })
  }
})

module.exports = router
