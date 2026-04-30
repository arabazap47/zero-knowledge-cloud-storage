import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({
  fileId: String,
  ownerId: String,

  shareToken: String,
  password: String,

  encryptedFileKey: String,

  downloadCount: { type: Number, default: 0 },
  maxDownloads: Number,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Share", shareSchema);