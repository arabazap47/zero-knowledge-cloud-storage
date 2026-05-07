import express from "express";
const router = express.Router();

// ✅ Create Order (FAKE for demo)
router.post("/create-order", async (req, res) => {
  res.json({
    id: "order_test_123",
    amount: req.body.amount * 100,
  });
});

// ✅ Verify Payment (optional for now)
router.post("/verify", async (req, res) => {
  res.json({ success: true });
});

export default router;