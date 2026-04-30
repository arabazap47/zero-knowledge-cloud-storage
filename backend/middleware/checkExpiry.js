import User from "../models/User.js";

export const checkExpiry = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.plan !== "Starter" && new Date() > user.planExpiry) {
    user.plan = "Starter";
    user.storageLimit = 50 * 1024 * 1024;
    await user.save();
  }

  next();
};