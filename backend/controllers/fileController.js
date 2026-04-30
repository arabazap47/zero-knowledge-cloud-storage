

import supabase from "../config/supabase.js";
import File from "../models/File.js";
import User from "../models/User.js";

const STORAGE_LIMITS = {
  Starter: 50 * 1024 * 1024,       // 50MB
  Pro: 100 * 1024 * 1024,      // 150MB
  Business: 150 * 1024 * 1024 // 300MB
};

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const fileHash = req.body.fileHash;
const encryptedFileKey = req.body.encryptedFileKey;
    const userId = req.user.id;

    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    // 1️⃣ Get user
    const user = await User.findById(userId);

    // 2️⃣ Calculate used storage
    const files = await File.find({ userId });
    const totalUsed = files.reduce((acc, f) => acc + f.size, 0);

    const limit = user.storageLimit || STORAGE_LIMITS["Starter"];

    // 3️⃣ Check limit
    if (totalUsed + file.size > limit) {
      return res.status(400).json({
  msg: `Storage Full ⚠️`,
  details: `You have exceeded your ${user.plan} plan limit.`,
  upgrade: true
});
    }

    // 🔥 CHECK IF FILE ALREADY EXISTS
const existing = await File.findOne({ fileHash });

if (existing) {
  const newFile = await File.create({
    userId,
    filename: file.originalname,
    filePath: existing.filePath, // reuse same file
    fileUrl: existing.fileUrl,
    fileHash,
    encryptedFileKey,
    size: file.size,
  });

  return res.json({
    msg: "Duplicate file reused",
    file: newFile,
  });
}

    // 4️⃣ Upload to Supabase
    const safeName = file.originalname
  .replace(/\s+/g, "_")
  .replace(/[^a-zA-Z0-9._-]/g, "");
const filePath = `${userId}/${Date.now()}-${safeName}`;

    const { data, error } = await supabase.storage
  .from("user-files")
  .upload(filePath, file.buffer, {
    contentType: file.mimetype,
  });

console.log("UPLOAD RESPONSE:", data);
console.log("UPLOAD ERROR:", error);
console.log("BODY:", req.body);
console.log("fileHash:", req.body.fileHash);
console.log("encryptedFileKey:", req.body.encryptedFileKey);

if (error) {
  return res.status(500).json({ msg: error.message });
}

if (!data) {
  return res.status(500).json({ msg: "Upload failed" });
}

console.log("UPLOADED PATH:", filePath);

    // 5️⃣ Get public URL (or signed later)
    const { data: publicUrlData } = supabase.storage
  .from("user-files")
  .getPublicUrl(filePath);

const fileUrl = publicUrlData.publicUrl;

    // 6️⃣ Save metadata
    const newFile = await File.create({
      userId,
      filename: file.originalname,
      fileUrl,
      filePath,
      fileHash,           // 🔥 ADD
      encryptedFileKey,  
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

    const files = await File.find({ userId,  isDeleted: false }).sort({ createdAt: -1 });
    const uniqueFiles = {};
files.forEach(f => {
  uniqueFiles[f.fileHash] = f;
});
const totalUsed = Object.values(uniqueFiles)
  .reduce((acc, f) => acc + f.size, 0);

    res.json({
    files,
    used: totalUsed,
    limit: user.storageLimit || STORAGE_LIMITS["Starter"]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch files" });
  }
};
//trash files api
export const getTrashFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const files = await File.find({
      userId,
      isDeleted: true
    });

    res.json({ files });

  } catch (err) {
    console.error("TRASH ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch trash files" });
  }
};

//delete trash files
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    file.isDeleted = true;
    await file.save();

    res.json({ msg: "Moved to trash" });

  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};


//peremnent delete
export const permanentlyDeleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    // delete from storage
    await supabase.storage
      .from("user-files")
      .remove([file.filePath]);

    // delete from DB
    await File.findByIdAndDelete(fileId);

    res.json({ msg: "File permanently deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Permanent delete failed" });
  }
};

//restore logic

export const restoreFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    file.isDeleted = false;
    await file.save();

    res.json({ msg: "File restored successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Restore failed" });
  }
};


export const downloadFile = async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({ msg: "Path missing" });
    }

    console.log("DOWNLOAD PATH:", path);

    const { data, error } = await supabase.storage
      .from("user-files")
      .createSignedUrl(path, 60);

    if (error) {
      console.log("SUPABASE ERROR:", error.message);
      return res.status(404).json({ msg: "File not found in storage" });
    }

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