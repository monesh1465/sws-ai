import Document from '../models/Document.js';

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    await document.save();

    res.status(201).json({
      success: true,
      document: {
        id: document._id,
        filename: document.originalName,
        fileSize: document.fileSize,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: -1 });

    const formattedDocs = documents.map((doc) => ({
      id: doc._id,
      filename: doc.originalName,
      fileSize: doc.fileSize,
      uploadedAt: doc.uploadedAt,
      filePath: doc.filePath,
    }));

    res.json(formattedDocs);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};
