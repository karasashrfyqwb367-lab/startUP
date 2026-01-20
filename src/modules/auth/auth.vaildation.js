import { generalFaild } from "../../middleware/valition.middleware.js";
import { z } from "zod";
export const login = {
    body: z.object({
        email: generalFaild.email,
        password: generalFaild.password
    })
};
export const signup = {
    body: login.body.extend({
        username: generalFaild.username
    })
};
export const confirmEmail = {
    body: z.strictObject({
        email: generalFaild.email,
        otp: generalFaild.otp
    })
};
export const signupWithgmail = {
    body: z.strictObject({
        idToken: z.string()
    })
};
