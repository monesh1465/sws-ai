import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', DocumentSchema);

export default Document;
