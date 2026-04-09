import express from "express";
import User from "../models/User.js";
import File from "../models/File.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const allFiles = await File.find({});
    const totalBytesUsed  = allFiles.reduce((acc, f) => acc + f.size, 0);

    const userStats = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const users = await User.find({}).select("-password");

    const userData = await Promise.all(
      users.map(async (user) => {
        const userFiles = await File.find({ userId: user._id });

        const totalUsed = userFiles.reduce((acc, f) => acc + f.size, 0);

        return {
          name: user.name,
          email: user.email,
          plan: user.plan,
          storageMB: (totalUsed / (1024 * 1024)).toFixed(2),
          createdAt: user.createdAt
        };
      })
    );

    res.json({
      totalUsers,
      totalStorageMB: (totalBytesUsed / (1024 * 1024)).toFixed(2),
      userStats,
      users: userData   // 🔥 ADD THIS
    });

  } catch (err) {
    console.error("ADMIN ERROR:", err);
    res.status(500).json({ msg: "Admin stats failed" });
  }
});

export default router;