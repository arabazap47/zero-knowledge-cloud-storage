import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ fixes IPv6 issue

// Temporary store for OTPs (Email -> OTP mapping)
let otpStore = {}; 

// --- SEND OTP ---
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "Email is required" });

  // Generate 6-digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  // Configure Nodemailer (Use your .env credentials)
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,          // ✅ IMPORTANT
  secure: false,      // ✅ IMPORTANT
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

  const mailOptions = {
    from: '"CypherVault Security" <no-reply@cyphervault.com>',
    to: email,
    subject: "Your Vault Verification Code",
    html: `
      <div style="background-color: #0a0a0a; color: white; padding: 40px; font-family: sans-serif; border-radius: 20px; text-align: center; border: 1px solid #333;">
        <h1 style="color: #2563eb; font-style: italic;">CypherVault</h1>
        <p style="color: #888;">Use the code below to verify your email and generate your secure vault.</p>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #2563eb;">
          <h2 style="letter-spacing: 10px; font-size: 32px; margin: 0; color: white;">${otp}</h2>
        </div>
        <p style="font-size: 12px; color: #555;">This code will expire shortly. If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ msg: "Failed to send email" });
  }
};

// --- VERIFY OTP ---
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // Clear OTP after successful verification
    res.json({ msg: "Email verified" });
  } else {
    res.status(400).json({ msg: "Invalid or expired OTP" });
  }
};

// --- SIGNUP ---
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, // Matches your UI 'Full Name'
      email,
      password: hashedPassword,
    });

    res.json({ msg: "User created successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Don't send the hashed password back to the frontend
    const { password: _, ...userWithoutPassword } = user._doc;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json(err);
  }
};