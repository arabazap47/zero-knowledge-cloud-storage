import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: String,
  type: {
    type: String,
    enum: ["plan", "file", "system"]
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);