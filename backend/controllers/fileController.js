import supabase from "../config/supabase.js";
import File from "../models/File.js";
import User from "../models/User.js";
import Folder from "../models/Folder.js";

export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const newFolder = await Folder.create({
      name,
      userId: req.user.id,
      parentId: parentId || null
    });
    res.json(newFolder);
  } catch (err) {
    res.status(500).json({ msg: "Folder creation failed" });
  }
};

const STORAGE_LIMITS = {
  Starter: 50 * 1024 * 1024, // 50MB
  Pro: 100 * 1024 * 1024, // 150MB
  Business: 150 * 1024 * 1024, // 300MB
};

// backend/controllers/fileController.js

export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.body;
    const userId = req.user.id; // From verifyToken middleware

    if (!folderId) {
      return res.status(400).json({ msg: "Folder ID is required" });
    }

    // 1. Soft delete the folder itself
    const folder = await Folder.findOneAndUpdate(
      { _id: folderId, userId },
      { isDeleted: true },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ msg: "Folder not found" });
    }

    // 2. Soft delete all files belonging to this folder
    await File.updateMany(
      { folderId, userId },
      { isDeleted: true }
    );

    // 3. Soft delete all sub-folders belonging to this folder
    await Folder.updateMany(
      { parentId: folderId, userId },
      { isDeleted: true }
    );

    res.json({ msg: "Folder and contents moved to trash" });
  } catch (err) {
    console.error("Delete Folder Backend Error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const fileHash = req.body.fileHash;
    const encryptedFileKey = req.body.encryptedFileKey;
    const folderId = req.body.folderId; // 🟢 1. Capture the folderId from the frontend
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
        upgrade: true,
      });
    }

    // 🔥 CHECK IF FILE ALREADY EXISTS
    const existing = await File.findOne({ fileHash });

    if (existing) {
      const newFile = await File.create({
        userId,
        filename: file.originalname,
        filePath: existing.filePath, 
        fileUrl: existing.fileUrl,
        folderId: folderId || null, // 🟢 2. Assign folderId even for reused files
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
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

    if (error) {
      return res.status(500).json({ msg: error.message });
    }

    if (!data) {
      return res.status(500).json({ msg: "Upload failed" });
    }

    // 5️⃣ Get public URL
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
      fileHash,
      encryptedFileKey,
      size: file.size,
      folderId: folderId || null, // 🟢 3. SAVE THE FOLDER ID HERE
      originalName: file.originalname,
      mimeType: file.mimetype,
      logs: [
        {
          action: "uploaded",
          user: userId,
        }
      ]
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
// export const getFiles = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await User.findById(userId);

//     const files = await File.find({ userId, isDeleted: false }).sort({
//       createdAt: -1,
//     });
//     const uniqueFiles = {};
//     files.forEach((f) => {
//       uniqueFiles[f.fileHash] = f;
//     });
//     const totalUsed = Object.values(uniqueFiles).reduce(
//       (acc, f) => acc + f.size,
//       0,
//     );

//     res.json({
//       files,
//       used: totalUsed,
//       limit: user.storageLimit || STORAGE_LIMITS["Starter"],
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to fetch files" });
//   }
// };
export const getFiles = async (req, res) => {
  try {
    const { folderId } = req.query; // Get the ID from the frontend request
    
    // Filter folders and files by parentId/folderId
    const folders = await Folder.find({ 
      userId: req.user.id, 
      parentId: folderId || null, // null means root
      isDeleted: false 
    });
    
    const files = await File.find({ 
      userId: req.user.id, 
      folderId: folderId || null, 
      isDeleted: false 
    });

    res.json({ files, folders });
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed" });
  }
};

//trash files api
export const getTrashFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const files = await File.find({
      userId,
      isDeleted: true,
    });

    res.json({ files });
  } catch (err) {
    console.error("TRASH ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch trash files" });
  }
};

//delete trash files
// export const deleteFile = async (req, res) => {
//   try {
//     const { fileId } = req.body;

//     const file = await File.findById(fileId);
//     if (!file) return res.status(404).json({ msg: "File not found" });

//     file.isDeleted = true;
//     await file.save();

//     res.json({ msg: "Moved to trash" });
//   } catch (err) {
//     res.status(500).json({ msg: "Delete failed" });
//   }
// };
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    // 🔥 Mark as deleted
    file.isDeleted = true;

    // 🔥 ADD LOG
    file.logs = file.logs || [];
    file.logs.push({
      action: "deleted",
      user: req.user.id,
      timestamp: new Date()
    });

    await file.save();

    res.json({ msg: "Moved to trash" });

  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};

//peremnent delete
// export const permanentlyDeleteFile = async (req, res) => {
//   try {
//     const { fileId } = req.body;

//     const file = await File.findById(fileId);
//     if (!file) return res.status(404).json({ msg: "File not found" });

//     // delete from storage
//     await supabase.storage.from("user-files").remove([file.filePath]);

//     // delete from DB
//     await File.findByIdAndDelete(fileId);

//     res.json({ msg: "File permanently deleted" });
//   } catch (err) {
//     res.status(500).json({ msg: "Permanent delete failed" });
//   }
// };
export const permanentlyDeleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    // 🔥 ADD FINAL LOG (optional but powerful)
    file.logs = file.logs || [];
    file.logs.push({
      action: "permanently_deleted",
      user: req.user.id,
      timestamp: new Date()
    });

    await file.save();

    // 🔥 delete from storage
    await supabase.storage.from("user-files").remove([file.filePath]);

    // 🔥 delete from DB
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

// export const downloadFile = async (req, res) => {
//   try {
//     const { path } = req.body;

//     if (!path) {
//       return res.status(400).json({ msg: "Path missing" });
//     }

//     console.log("DOWNLOAD PATH:", path);

//     const { data, error } = await supabase.storage
//       .from("user-files")
//       .createSignedUrl(path, 60);

//     if (error) {
//       console.log("SUPABASE ERROR:", error.message);
//       return res.status(404).json({ msg: "File not found in storage" });
//     }

//     res.json({ url: data.signedUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Download failed" });
//   }
// };

//favorite logic

export const downloadFile = async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({ msg: "Path missing" });
    }

    console.log("DOWNLOAD PATH:", path);

    // 🔥 Find file in DB
    const fileDoc = await File.findOne({ filePath: path });

    // 🔐 Generate signed URL
    const { data, error } = await supabase.storage
      .from("user-files")
      .createSignedUrl(path, 60);

    if (error) {
      console.log("SUPABASE ERROR:", error.message);
      return res.status(404).json({ msg: "File not found in storage" });
    }

    // 🔥 ADD LOG + download count
    if (fileDoc) {
      fileDoc.logs = fileDoc.logs || [];

      fileDoc.logs.push({
        action: "downloaded",
        user: req.user.id,
        timestamp: new Date()
      });

      fileDoc.downloadCount = (fileDoc.downloadCount || 0) + 1;

      await fileDoc.save();
    }

    res.json({ url: data.signedUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Download failed" });
  }
};
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

// filecontroller.js -> getFileTimeline
export const getFileTimeline = async (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);

    // Search for the filename AS IS, or with .enc appended
    const file = await File.findOne({
      userId: req.user.id, // Security: Ensure user owns the file
      $or: [
        { filename: { $regex: new RegExp(`^${filename}$`, "i") } },
        { filename: { $regex: new RegExp(`^${filename}\\.enc$`, "i") } }
      ]
    });

    if (!file) {
      return res.status(404).json({ msg: `File '${filename}' not found` });
    }

    res.json({
      logs: file.logs || []
    });

  } catch (err) {
    console.error(err);
    console.error("TIMELINE ERROR:", err);  // ✅ ADD THIS
    res.status(500).json({ msg: "Failed to fetch timeline" });
  }
};
