import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  isFavorite: {
  type: Boolean,
  default: false
},
filePath: { type: String },
isDeleted: {
  type: Boolean,
  default: false
},
fileHash: { type: String, required: true },
encryptedFileKey: { type: String, required: true },
});

export default mongoose.model("File", fileSchema);