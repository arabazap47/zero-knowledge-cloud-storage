

import supabase from "../config/supabase.js";
import File from "../models/File.js";
import User from "../models/User.js";

const STORAGE_LIMITS = {
  free: 50 * 1024 * 1024,       // 50MB
  pro: 150 * 1024 * 1024,      // 150MB
  business: 300 * 1024 * 1024 // 300MB
};

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;

    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    // 1️⃣ Get user
    const user = await User.findById(userId);

    // 2️⃣ Calculate used storage
    const files = await File.find({ userId });
    const totalUsed = files.reduce((acc, f) => acc + f.size, 0);

    const limit = STORAGE_LIMITS[user.plan];

    // 3️⃣ Check limit
    if (totalUsed + file.size > limit) {
      return res.status(400).json({
        msg: `Storage limit exceeded (${user.plan} plan)`
      });
    }

    // 4️⃣ Upload to Supabase
    const filePath = `${userId}/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from("user-files")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // 5️⃣ Get public URL (or signed later)
    const { data } = supabase.storage
      .from("user-files")
      .getPublicUrl(filePath);

    const fileUrl = data.publicUrl;

    // 6️⃣ Save metadata
    const newFile = await File.create({
      userId,
      filename: file.originalname,
      fileUrl,
      filePath,
      size: file.size,
    });

    res.json({
      msg: "File uploaded successfully",
      file: newFile,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upload failed" });
  }
};

//to get files
export const getFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const files = await File.find({ userId }).sort({ createdAt: -1 });
    const totalUsed = files.reduce((acc, f) => acc + f.size, 0);

    res.json({
    files,
    used: totalUsed,
    limit: STORAGE_LIMITS[user.plan]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch files" });
  }
};

//delete files
export const deleteFile = async (req, res) => {
  try {
    const { fileId, path } = req.body;
    const userId = req.user.id;

    // 1️⃣ Find file
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    // 2️⃣ Security check (VERY IMPORTANT 🔐)
    if (file.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // 3️⃣ Delete from Supabase
    const { error } = await supabase.storage
      .from("user-files")
      .remove([file.filePath]);

    if (error) throw error;

    // 4️⃣ Delete from DB
    await File.findByIdAndDelete(fileId);

    res.json({ msg: "File deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
};


//download logic
export const downloadFile = async (req, res) => {
  try {
    const { path } = req.body;

    const { data, error } = await supabase.storage
      .from("user-files")
      .createSignedUrl(path, 60); // 60 sec

    if (error) throw error;

    res.json({ url: data.signedUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Download failed" });
  }
}; 


//favorite logic

export const toggleFavorite = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    file.isFavorite = !file.isFavorite;
    await file.save();

    res.json({ msg: "Updated", file });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Favorite failed" });
  }
};