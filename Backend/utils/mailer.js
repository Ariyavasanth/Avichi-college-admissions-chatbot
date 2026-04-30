const nodemailer = require("nodemailer");

/**
 * Transporter configuration using environment variables.
 * For production, use services like SendGrid, Mailgun, or a corporate SMTP.
 */
const createTransporter = () => {
    // Check if configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        if (process.env.NODE_ENV !== "production") {
            console.log("\n📩 [MAILER] Email configuration is incomplete. Emails will be logged to console instead of sent.\n");
        } else {
            console.error("❌ [MAILER] Email configuration missing in .env! Email features are disabled.");
        }
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for others
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

/**
 * Sends a verification email for email change.
 */
exports.sendEmailChangeVerification = async (toEmail, token) => {
    const confirmationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/confirm-email-change?token=${token}`;
    const transporter = createTransporter();

    if (!transporter) {
        console.log("------------------------------------------");
        console.log("🔗 VERIFICATION LINK (Copy & Paste):");
        console.log(confirmationLink);
        console.log("------------------------------------------");
        return { success: true, loggedToConsole: true };
    }

    const mailOptions = {
        from: `"Avichi Admin System" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Confirm Your Email Change",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #1f3b73;">Email Change Request</h2>
                <p>Hello Admin,</p>
                <p>We received a request to change your admin account email address to this one. To confirm this change, please click the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationLink}" style="background-color: #1f3b73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Confirm Email Change</a>
                </div>
                <p style="color: #64748b; font-size: 14px;">This link will expire in 15 minutes. If you did not request this change, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="color: #94a3b8; font-size: 12px;">Avichi College Admissions Chatbot • Admin Security System</p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};

/**
 * Sends a notification to the old email address.
 */
exports.sendEmailChangeNotification = async (oldEmail, newEmail) => {
    const transporter = createTransporter();
    if (!transporter) {
        console.log(`\n🔔 [SECURITY NOTIFICATION] Email for account ${oldEmail} was changed to ${newEmail}\n`);
        return { success: true, loggedToConsole: true };
    }

    const mailOptions = {
        from: `"Avichi Admin System" <${process.env.EMAIL_USER}>`,
        to: oldEmail,
        subject: "Security Alert: Email Address Updated",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #ef4444;">Security Update</h2>
                <p>Hello Admin,</p>
                <p>This is a security notification to inform you that your admin account email has been successfully changed to: <strong>${newEmail}</strong>.</p>
                <p>If you made this change, no further action is required.</p>
                <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0; color: #b91c1c; font-weight: bold;">⚠️ If you did NOT authorize this change:</p>
                    <p style="margin: 5px 0 0; color: #7f1d1d; font-size: 14px;">Please contact the system administrator immediately and change your password to secure your account.</p>
                </div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="color: #94a3b8; font-size: 12px;">Avichi College Admissions Chatbot • Admin Security System</p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};
