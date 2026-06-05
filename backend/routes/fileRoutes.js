import express from "express";
import { createFolder, deleteFolder, uploadFile, getFiles, deleteFile, downloadFile, toggleFavorite, restoreFile, permanentlyDeleteFile, getTrashFiles, getFileTimeline } from "../controllers/fileController.js";
import verifyToken from "../middleware/auth.js";
import multer from "multer";
import auth from "../middleware/auth.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.single("file"), uploadFile);

router.post("/delete", verifyToken, deleteFile);
router.post("/download", verifyToken, downloadFile);
router.post("/favorite", verifyToken, toggleFavorite);

// ✅ FIXED
router.post("/restore", verifyToken, restoreFile);
router.post("/delete-permanent", verifyToken, permanentlyDeleteFile);
router.get("/trash", verifyToken, getTrashFiles);

router.get("/", verifyToken, getFiles); 

router.get("/timeline/:filename",auth , getFileTimeline);
router.post("/create-folder", auth, createFolder);
router.post("/delete-folder", auth, deleteFolder);

export default router;