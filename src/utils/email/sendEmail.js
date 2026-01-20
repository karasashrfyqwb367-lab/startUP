import { createTransport } from "nodemailer";
import { BedReqExpation } from "../../error.respons.ts/error.respons.js";
export const sendEmail = async (data) => {
    if (!data.html && !data.attachments?.length && !data.text) {
        throw new BedReqExpation("missing Email content");
    }
    const transporter = createTransport({
        service: "gmail", // غيّرها حسب الخدمة اللي هتستخدمها
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
    await transporter.sendMail({
        ...data,
        from: `"karas SoftWare Engneer" <${process.env.EMAIL}>`,
    });
};
