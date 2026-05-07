import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: '"CypherVault Security" <no-reply@cyphervault.com>',
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.response);

  } catch (err) {
    console.error("❌ Email error FULL:", err);
  }
};