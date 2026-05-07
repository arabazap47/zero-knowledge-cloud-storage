
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`>>> ${req.method} request to ${req.url}`);
  console.log("Body:", req.body);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/share", shareRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));