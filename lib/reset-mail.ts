import { Resend } from "resend";

const resendForPasswordReset = new Resend(process.env.RESEND_API_KEY_PASS);

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  await resendForPasswordReset.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset password for {AppName}",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
