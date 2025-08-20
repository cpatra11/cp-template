"use strict";

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_SENDING_ADDRESS, // generated ethereal user
    pass: process.env.EMAIL_SENDING_PASSWORD, // generated ethereal user
  },
});
