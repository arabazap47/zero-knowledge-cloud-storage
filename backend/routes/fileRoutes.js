import express from "express";
import { uploadFile, getFiles } from "../controllers/fileController.js";
import verifyToken from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.single("file"), uploadFile);

router.get("/", verifyToken, getFiles);

export default router;