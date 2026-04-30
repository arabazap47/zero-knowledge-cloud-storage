import express from "express";
import crypto from "crypto";
import Share from "../models/Share.js";
import verifyToken from "../middleware/auth.js";
import File from "../models/File.js";
import supabase from "../config/supabase.js"; 

const router = express.Router();

// CREATE SHARE LINK
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { fileId, encryptedFileKey, password, maxDownloads } = req.body;

    const shareToken = crypto.randomUUID();

    const share = await Share.create({
      fileId,
      ownerId: req.user.id,
      shareToken,
      password, // (you can hash later)
      encryptedFileKey,
      maxDownloads,
    });

    res.json({
      link: `http://localhost:5173/share/${shareToken}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Share creation failed" });
  }
});

router.post("/download", async (req, res) => {
  try {
    const { token, password } = req.body;

    const share = await Share.findOne({ shareToken: token });

    if (!share) {
      return res.status(404).json({ msg: "Invalid link" });
    }

    if (share.password !== password) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    if (
      share.maxDownloads &&
      share.downloadCount >= share.maxDownloads
    ) {
      return res.status(400).json({ msg: "Download limit reached" });
    }

    share.downloadCount += 1;
    await share.save();

    const file = await File.findById(share.fileId);

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    res.json({
  encryptedFileKey: share.encryptedFileKey,
  filePath: file.filePath,
  ownerId: share.ownerId // 🔥 IMPORTANT
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Download failed" });
  }
});

router.post("/get-file-url", async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({ msg: "Path missing" });
    }

    const { data, error } = await supabase.storage
      .from("user-files")
      .createSignedUrl(path, 60);

    if (error) {
      return res.status(500).json({ msg: "Failed to get file URL" });
    }

    res.json({
      url: data.signedUrl,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generating URL" });
  }
});
router.get("/test", (req, res) => {
  res.json({ msg: "share route working" });
});
export default router;