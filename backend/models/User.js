import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // For your OTP logic
  salt: { type: String, required: true },
  plan: { type: String, enum: ["free", "pro", "Business"], default: "free" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);