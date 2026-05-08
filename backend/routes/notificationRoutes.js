import express from "express";
import verifyToken from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// 🔔 GET USER NOTIFICATIONS
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch notifications" });
  }
});

// 🔕 MARK AS READ
router.post("/read", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id },
      { isRead: true }
    );

    res.json({ msg: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update" });
  }
});
router.get("/test", (req, res) => {
  res.json({ msg: "Notification route working ✅" });
});
router.get("/create-test", async (req, res) => {
  const notif = await Notification.create({
    userId: "69f0d7ca9b61e8d75a795337",
    message: "🔥 Test Notification Working!",
    type: "system"
  });

  res.json(notif);
});
export default router;