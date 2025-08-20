import { transporter } from "./nodemailer";

const AppName = process.env.NEXT_PUBLIC_APP_NAME || "Your App Name";
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: "cpun1213@gmail.com",
    to: email,
    subject: `Verify your email for ${AppName}`,
    html: ` <html>
    <body
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ color: "#333333" }}>Verify Your Email Address</h2>
        <p style={{ color: "#555555" }}>
          Thank you for registering with us. Please click the button below to
          verify your email address:
        </p>
        <a
          href=${confirmationLink}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            margin: "20px 0",
            backgroundColor: "#007bff",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Verify Email
        </a>
        <p style={{ color: "#555555" }}>
          If you did not create an account, no further action is required.
        </p>
        <p style={{ color: "#555555" }}>
          Best regards,
          <br />
          The Team
        </p>
      </div>
    </body>
  </html>`,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  await transporter.sendMail({
    from: "cpun1213@gmail.com",
    to: email,
    subject: `Reset password for ${AppName}`,
    html: `<html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">Reset Your Password</h2>
        <p style="color: #555555;">
          We received a request to reset your password. Please click the button
          below to reset your password:
        </p>
        <a
          href=${resetLink}
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;"
        >
          Reset Password
        </a>
        <p style="color: #555555;">
          If you did not request a password reset, no further action is
          required.
        </p>
        <p style="color: #555555;">
          Best regards,
          <br />
          The Team
        </p>
      </div>
    </body>
  </html>`,
  });
};
