import { transporter } from "./nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: "cpun1213@gmail.com",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  await transporter.sendMail({
    from: "cpun1213@gmail.com",
    to: email,
    subject: "Reset password for {AppName}",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
