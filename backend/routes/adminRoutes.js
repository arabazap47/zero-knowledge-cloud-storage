// import express from "express";
// import User from "../models/User.js";
// import File from "../models/File.js";

// const router = express.Router();

// router.get("/stats", async (req, res) => {
//   try {
//     // 🔹 TOTAL USERS
//     const totalUsers = await User.countDocuments();

//     // 🔹 ALL FILES
//     const allFiles = await File.find({});
//     const totalBytesUsed = allFiles.reduce((acc, f) => acc + (f.size || 0), 0);

//     // 🔹 USER LIST
//     const users = await User.find({}).select("-password");

//     // 🔹 USER STORAGE PER USER
//     const userData = await Promise.all(
//       users.map(async (user) => {
//         const userFiles = await File.find({ userId: user._id });

//         const totalUsed = userFiles.reduce((acc, f) => acc + (f.size || 0), 0);

//         return {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           plan: user.plan,
//           isDisabled: user.isDisabled || false,
//           storageMB: (totalUsed / (1024 * 1024)).toFixed(2),
//           createdAt: user.createdAt
//         };
//       })
//     );

//     // 🔥 1. STORAGE BREAKDOWN (Pie Chart)
//     let images = 0, videos = 0, docs = 0, others = 0;

//     allFiles.forEach(f => {
//       const type = f.mimeType || "";

//       if (type.includes("image")) images += f.size;
//       else if (type.includes("video")) videos += f.size;
//       else if (type.includes("pdf") || type.includes("text")) docs += f.size;
//       else others += f.size;
//     });

//     const storageBreakdown = {
//       images: Math.round(images / (1024 * 1024)),
//       videos: Math.round(videos / (1024 * 1024)),
//       docs: Math.round(docs / (1024 * 1024)),
//       others: Math.round(others / (1024 * 1024))
//     };

//     // 🔥 2. STORAGE ACTIVITY TREND (REAL)
//     const storageActivityRaw = await File.aggregate([
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: "$uploadedAt" },
//             month: { $month: "$uploadedAt" }
//           },
//           totalSize: { $sum: "$size" }
//         }
//       },
//       { $sort: { "_id.month": 1, "_id.day": 1 } }
//     ]);

//     const storageActivity = storageActivityRaw.map(item => ({
//       date: `${item._id.day}/${item._id.month}`,
//       sizeMB: Math.round(item.totalSize / (1024 * 1024))
//     }));

//     // 🔥 3. USER ACTIVITY BREAKDOWN (by plan)
//     const userActivityRaw = await User.aggregate([
//       {
//         $group: {
//           _id: "$plan",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const userActivity = userActivityRaw.map(u => ({
//       name: u._id,
//       value: u.count
//     }));

//     // 🔥 4. TOP USERS BY STORAGE
//     const topUsers = [...userData]
//       .sort((a, b) => parseFloat(b.storageMB) - parseFloat(a.storageMB))
//       .slice(0, 5);

//     // 🔥 5. USER GROWTH (MONTHLY)
//     const userStats = await User.aggregate([
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { "_id": 1 } }
//     ]);

//     // 🔥 6. REVENUE (SIMULATED)
//     const proUsers = users.filter(u => u.plan === "Pro").length;
//     const businessUsers = users.filter(u => u.plan === "Business").length;

//     const revenue = {
//       total: (proUsers * 499) + (businessUsers * 999),
//       proUsers,
//       businessUsers
//     };

//     // 🔥 FINAL RESPONSE
//     res.json({
//       totalUsers,
//       totalStorageMB: (totalBytesUsed / (1024 * 1024)).toFixed(2),

//       users: userData,
//       userStats,

//       storageBreakdown,
//       storageActivity,
//       userActivity,
//       topUsers,
//       revenue
//     });

//   } catch (err) {
//     console.error("ADMIN ERROR:", err);
//     res.status(500).json({ msg: "Admin stats failed" });
//   }
// });

// router.post("/user/disable", async (req, res) => {
//   try {
//     const { userId } = req.body;

//     await User.findByIdAndUpdate(userId, {
//       isDisabled: true
//     });

//     res.json({ msg: "User disabled" });
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to disable user" });
//   }
// });

// router.post("/user/upgrade", async (req, res) => {
//   try {
//     const { userId, plan } = req.body;

//     const expiry = new Date();
//     expiry.setDate(expiry.getDate() + 30);

//     await User.findByIdAndUpdate(userId, {
//       plan,
//       storageLimit: plan === "Pro" ? 100 * 1024 * 1024 : 200 * 1024 * 1024,
//       planExpiry: expiry
//     });

//     res.json({ msg: "User upgraded" });
//   } catch (err) {
//     res.status(500).json({ msg: "Upgrade failed" });
//   }
// });

// import { sendEmail } from "../utils/sendEmail.js";

// router.post("/broadcast", async (req, res) => {
//   try {
//     const { subject, message } = req.body;

//     const users = await User.find({});

//     for (let user of users) {
//       await sendEmail(
//         user.email,
//         subject,
//         `<p>${message}</p>`
//       );
//     }

//     res.json({ msg: "Emails sent to all users" });
//   } catch (err) {
//     res.status(500).json({ msg: "Broadcast failed" });
//   }
// });

// export default router;

import express from "express";
import User from "../models/User.js";
import File from "../models/File.js";
import { sendEmail } from "../utils/sendEmail.js";
import { createNotification } from "../utils/sendNotification.js";

const router = express.Router();

// 🔹 GET ALL ADMIN STATS & ANALYTICS
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const allFiles = await File.find({});
    const totalBytesUsed = allFiles.reduce((acc, f) => acc + (f.size || 0), 0);

    const users = await User.find({}).select("-password");
    const userData = await Promise.all(
      users.map(async (user) => {
        const userFiles = await File.find({ userId: user._id });
        const totalUsed = userFiles.reduce((acc, f) => acc + (f.size || 0), 0);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          isDisabled: user.isDisabled || false,
          storageMB: (totalUsed / (1024 * 1024)).toFixed(2),
          createdAt: user.createdAt,
        };
      })
    );

    let breakdown = {
      images: { size: 0, count: 0 },
      videos: { size: 0, count: 0 },
      docs: { size: 0, count: 0 },
      others: { size: 0, count: 0 },
    };

    allFiles.forEach((f) => {
      const type = f.mimeType || "";
      let category = "others";
      if (type.includes("image")) category = "images";
      else if (type.includes("video")) category = "videos";
      else if (type.includes("pdf") || type.includes("text") || type.includes("word")) category = "docs";

      breakdown[category].size += f.size;
      breakdown[category].count += 1;
    });

    const storageBreakdown = Object.keys(breakdown).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Math.round(breakdown[key].size / (1024 * 1024)),
      count: breakdown[key].count,
    }));

    const storageActivity = await File.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$uploadedAt" } },
          sizeMB: { $sum: { $divide: ["$size", 1024 * 1024] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 15 },
    ]).then(res => res.map(item => ({ date: item._id, sizeMB: Math.round(item.sizeMB) })));

    const userActivity = await User.aggregate([
      { $group: { _id: "$plan", value: { $sum: 1 } } },
    ]).then(res => res.map(item => ({ name: item._id, value: item.value })));

    const topUsers = [...userData]
      .sort((a, b) => parseFloat(b.storageMB) - parseFloat(a.storageMB))
      .slice(0, 5);

    const proCount = users.filter((u) => u.plan === "Pro").length;
    const bizCount = users.filter((u) => u.plan === "Business").length;
    const revenue = {
      total: proCount * 499 + bizCount * 999,
      proUsers: proCount,
      businessUsers: bizCount,
    };

    res.json({
      totalUsers,
      totalStorageMB: (totalBytesUsed / (1024 * 1024)).toFixed(2),
      users: userData,
      storageBreakdown,
      storageActivity,
      userActivity,
      topUsers,
      revenue,
    });
  } catch (err) {
    console.error("ADMIN ERROR:", err);
    res.status(500).json({ msg: "Admin stats failed" });
  }
});

// 🔹 TOGGLE USER RESTRICTION (Working Fix)
router.post("/user/disable", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isDisabled = !user.isDisabled; // Toggle
    await user.save();

    res.json({ msg: user.isDisabled ? "User Restricted" : "User Re-activated" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update user status" });
  }
});

// 🔹 UPGRADE/DOWNGRADE (Starter, Pro, Business)
router.post("/user/upgrade", async (req, res) => {
  try {
    let { userId, plan } = req.body;

    // 🔥 VALIDATE INPUT
    if (!userId || !plan) {
      return res.status(400).json({ msg: "Missing userId or plan" });
    }

    // 🔥 NORMALIZE PLAN
    plan = plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();

    const validPlans = ["Free", "Starter", "Pro", "Business"];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ msg: "Invalid plan selected" });
    }

    // 🔥 STORAGE LOGIC
    let storageLimit;
    switch (plan) {
      case "Starter":
        storageLimit = 50 * 1024 * 1024;
        break;
      case "Pro":
        storageLimit = 100 * 1024 * 1024;
        break;
      case "Business":
        storageLimit = 150 * 1024 * 1024;
        break;
      default:
        storageLimit = 50 * 1024 * 1024;
    }

    // 🔥 EXPIRY
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    // 🔥 UPDATE USER
    const user = await User.findByIdAndUpdate(
      userId,
      {
        plan,
        storageLimit,
        planExpiry: plan === "Free" ? null : expiry,
      },
      { new: true, runValidators: true }
    );

    // 🔥 CHECK USER EXISTS
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await createNotification(
  userId,
  `👨‍💼 Admin upgraded your plan to ${plan}`,
  "plan"
);

    res.json({
      msg: `User upgraded to ${plan}`,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upgrade failed" });
  }
});

// 🔹 BROADCAST EMAIL
// router.post("/broadcast", async (req, res) => {
//   try {
//     const { subject, message } = req.body;
//     const users = await User.find({ isDisabled: false });

//     const emailPromises = users.map(user => 
//       sendEmail(user.email, subject, `<div style="font-family: sans-serif;">${message}</div>`)
//     );

//     await Promise.all(emailPromises);
//     res.json({ msg: `Broadcast sent to ${users.length} users` });
//   } catch (err) {
//     res.status(500).json({ msg: "Broadcast failed" });
//   }
// });
router.post("/broadcast", async (req, res) => {
  try {
    const { subject, message } = req.body;

    const users = await User.find({
      isDisabled: false,
      role: { $ne: "admin" } // ✅ skip admin
    });

    const emailPromises = users.map(user =>
      sendEmail(
        user.email,
        subject,
        `<div style="font-family:sans-serif">${message}</div>`
      )
    );

    const results = await Promise.allSettled(emailPromises);

    let success = 0;
    let failed = 0;

    results.forEach((r, i) => {
      if (r.status === "fulfilled") success++;
      else {
        failed++;
        console.log("❌ Failed:", users[i].email, r.reason);
      }
    });

    res.json({
      msg: `✅ ${success} sent, ❌ ${failed} failed`
    });

  } catch (err) {
    console.error("Broadcast Error:", err);
    res.status(500).json({ msg: "Broadcast failed" });
  }
});
export default router;