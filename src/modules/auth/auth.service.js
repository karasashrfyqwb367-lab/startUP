import { ProviderEnum, RoleEnum, UserModel } from "../../DB/model/User.model.js";
import { BedReqExpation, confictExpcaption, NotFountExpcation } from "../../error.respons.ts/error.respons.js";
import { generatOTPeNumber } from "../../otp.js";
import { OAuth2Client } from 'google-auth-library';
import { emailEvent } from "../../event/email.event.js";
import { createLoginCredentials } from "../../utils/token.js";
import { verifyEmail } from "../../utils/email/verfy.templet.js";

class Authentication {
    constructor() {
        this.userModel = UserModel;
        this.signupWithGmail = async (req, res) => {
            const { idToken } = req.body;
            const { email, family_name, given_name, picture, } = await this.verfyGmailAccont(idToken);
            if (!email) {
                throw new Error("Email not provided by Google");
            }
            const user = await this.userModel.findOne({
                email
            });
            if (user) {
                if (user.provider === ProviderEnum.GOOGLE) {
                    //await this.loginWithGmail(req, res);
                    return;
                }
                throw new confictExpcaption("Email exists with another provider");
            }
            const newUser = await this.userModel.create({
                email: email,
                firstName: given_name,
                lastName: family_name,
                ...(picture && { profileImage: picture }),
                provider: ProviderEnum.GOOGLE,
                confirmedAt: new Date(),
            });
            if (!newUser) {
                throw new BedReqExpation("Failed to signup with Google, try again");
            }
            const credentials = await createLoginCredentials(newUser);
            res.status(201).json({
                message: "Done",
                data: { credentials },
            });
        };
        /***************************login With Gmail******************************************* */
        this.logWithGmail = async (req, res) => {
            const { idToken } = req.body;
            const { email } = await this.verfyGmailAccont(idToken);
            const user = await this.userModel.findOne({
                email: email,
                provider: ProviderEnum.GOOGLE
            });
            if (!user) {
                throw new confictExpcaption("Email Not Exist ");
            }
            const credentails = await createLoginCredentials(user)
            return res.json({
                message: "Done",
                date: { credentails }
            });
        };
        /*********************** signup *********************************** */
        this.signup = async (req, res) => {
            let { username, email, password, role } = req.body;

            // default role
            if (!role) role = RoleEnum.USER;

            // validate role
            if (!Object.values(RoleEnum).includes(role)) {
                throw new BedReqExpation("Invalid role");
            }

            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new BedReqExpation("user already exists");
            }

            const otp = generatOTPeNumber();

            const otpHtml = verifyEmail({
                otp,
                title: "Confirm Your Email",
            });

            const user = await this.userModel.create({
                username,
                email,
                password,
                role,                 // ✅ الجديد
                confirmEmailOtp: `${otp}`,
            });

            emailEvent.emit("Confirm Email", {
                to: email,
                subject: "Confirm Your Email",
                html: otpHtml,
                text: `Your OTP code is: ${otp}`,
            });

            return res.status(201).json({
                message: "Done, please confirm your email",
                data: { userId: user._id },
            });
        };

        /*******************confirmEmail********************************** */
        this.confirmEmail = async (req, res) => {
            const { email, otp } = req.body;
            if (!email) {
                throw new BedReqExpation("Email is required");
            }
            // 1) دور على الـ user
            const user = await this.userModel.findOne({
                email,
                // confirmEmailOtp: { $exists: true, $ne: null },
                // confirmedAt: true
            });
            if (!user) {
                throw new BedReqExpation("User not exist");
            }
            // 2) تحقق من الـ otp
            if (otp !== user.confirmEmailOtp) {
                throw new BedReqExpation("OTP not matching");
            }
            // 3) حدث البيانات
            await this.userModel.updateOne({ email }, { confirmedAt: new Date() });
            return res.status(200).json({ message: "Done confirmation Email" });
        };
        /*************************login  ***************************** */
        this.login = async (req, res) => {
            const { email, password } = req.body;
            const user = await this.userModel.findOne({
                email
            });
            if (!user) {
                throw new NotFountExpcation("In_vaild login data");
            }
            if (!user.confirmedAt) {
                throw new BedReqExpation("verfiy your account first");
            }
            if (password !== user.password) {
                throw new NotFountExpcation("password Not matching");
            }
            const credentialsToken = await createLoginCredentials(user);
            return res.status(200).json({ message: "Done", data: { credentialsToken } });
        };
    }
    async verfyGmailAccont(idToken) {
        const client = new OAuth2Client(process.env.WEB_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID?.split(",") || [], // ممكن تبقى string أو array
        });
        const payload = ticket.getPayload();
        if (!payload?.email_verified) {
            throw new BedReqExpation("");
        }
        return payload;
    }
}
export default new Authentication();
