import express from "express";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";
import { signup, login, sendOtp, verifyOtp, forgotPassword, resetPassword } from "../controllers/authController.js";
import { checkExpiry } from "../middleware/checkExpiry.js";
import { getFiles } from "../controllers/fileController.js";
import { sendEmail } from "../utils/sendEmail.js";
import { createNotification } from "../utils/sendNotification.js";
import nodemailer from "nodemailer";


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

    // 🔍 GET OLD USER (IMPORTANT)
    const user = await User.findById(userId);

    const oldPlan = user.plan;
    const oldStorage = user.storageLimit;

    // 🔥 SET EXPIRY (30 DAYS)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    // 🔥 UPDATE USER
    user.plan = plan;
    user.storageLimit = storage * 1024 * 1024;
    user.planExpiry = expiry;

    await user.save();
    const message = req.user?.role === "admin"
  ? `🎯 Admin upgraded your plan to ${plan}`
  : `🚀 You upgraded your plan to ${plan}`;

await createNotification(user._id, message, "plan");

    // 📧 SEND EMAIL AFTER SUCCESS
    await sendEmail(
      user.email,
      "🚀 CypherVault Plan Upgrade Successful",
      `
      <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#2563eb;">🔐 CypherVault</h2>

        <h3>🎉 Plan Upgrade Successful</h3>

        <p>Hello ${user.name || "User"},</p>

        <p>Your plan has been upgraded successfully.</p>

        <table style="margin-top:10px;">
          <tr>
            <td><b>Old Plan:</b></td>
            <td>${oldPlan}</td>
          </tr>
          <tr>
            <td><b>New Plan:</b></td>
            <td>${plan}</td>
          </tr>
          <tr>
            <td><b>Storage:</b></td>
            <td>${oldStorage / (1024 * 1024)}MB → ${storage}MB</td>
          </tr>
          <tr>
            <td><b>Valid Till:</b></td>
            <td>${expiry.toDateString()}</td>
          </tr>
        </table>

        <p style="margin-top:15px;">
          🔐 Enjoy your upgraded secure vault experience.
        </p>

        <hr />
        <small>CypherVault Team</small>
      </div>
      `
    );
    await createNotification(
  user._id,
  `🚀 Your plan upgraded to ${plan}`,
  "plan"
);
    

    res.json({
      success: true,
      user,
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