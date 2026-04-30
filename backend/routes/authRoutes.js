import express from "express";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";
import { signup, login, sendOtp, verifyOtp, forgotPassword, resetPassword } from "../controllers/authController.js";
import { checkExpiry } from "../middleware/checkExpiry.js";
import { getFiles } from "../controllers/fileController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/update-plan", verifyToken, async (req, res) => {
  try {
    const { plan, storage } = req.body;

    const userId = req.user.id;

    // 🔥 SET EXPIRY (30 DAYS)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        plan,
        storageLimit: storage * 1024 * 1024,
        planExpiry: expiry,
      },
      { new: true }
    );

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update plan" });
  }
});
router.get("/files", verifyToken, checkExpiry, getFiles);
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;