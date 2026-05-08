// import Notification from "../models/Notification.js";

// export const createNotification = async (userId, message, type = "system") => {
//   try {
//     await Notification.create({
//       userId,
//       message,
//       type
//     });
//   } catch (err) {
//     console.error("Notification error:", err);
//   }
// };
import Notification from "../models/Notification.js";
console.log("Notification model:", Notification); // 🔥 DEBUG
export const createNotification = async (userId, message, type) => {
  try {
    const newNotif = new Notification({ userId, message, type });
    await newNotif.save();
  } catch (err) {
    console.error("Notification creation failed", err);
  }
}; 

