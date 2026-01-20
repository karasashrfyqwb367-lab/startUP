import { EventEmitter } from "node:events";
import { sendEmail } from "../utils/email/sendEmail.js";
export const emailEvent = new EventEmitter();
emailEvent.on("Confirm Email", async (data) => {
    try {
        data.subject = "Confirm Email";
        await sendEmail(data);
    }
    catch (error) {
        console.log("Fail confirm Send Email", error);
    }
});
