import { TRPCError } from "@trpc/server";
import type { SendMailOptions } from "nodemailer";
import { createTransport } from "nodemailer";

export async function sendMail(options: SendMailOptions) {
  try {
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!, 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message: SendMailOptions = {
      from: process.env.EMAIL_FROM_NAME,
      sender: process.env.EMAIL_FROM_NAME,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    transporter.verify((err, succcess) => {
      console.log(err);
      console.log(succcess);
    });

    const sentMail = await transporter.sendMail(message);
    console.log("sent email ", sentMail.messageId);
    return sentMail;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `nodemailer error`,
    });
  }
}
