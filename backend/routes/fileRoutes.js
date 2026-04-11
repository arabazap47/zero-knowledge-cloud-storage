import express from "express";
import { uploadFile, getFiles, deleteFile, downloadFile, toggleFavorite, restoreFile, permanentlyDeleteFile, getTrashFiles } from "../controllers/fileController.js";
import verifyToken from "../middleware/auth.js";
import multer from "multer";

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

export default router;