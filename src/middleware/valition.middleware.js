import z from "zod";
import { BedReqExpation } from "../error.respons.ts/error.respons.js";
export const validitionMiddlware = (schema) => {
    return (req, res, next) => {
        try {
            const validationError = [];
            for (const key of Object.keys(schema)) {
                if (!schema[key])
                    continue;
                const validationResult = schema[key]?.safeParse(req[key]);
                if (!validationResult?.success) {
                    const error = validationResult?.error;
                    validationError.push({
                        key,
                        issue: error.issues.map(issue => ({
                            message: issue.message,
                            path: issue.path.join(".")
                        }))
                    });
                }
            }
            if (validationError.length) {
                return res.status(400).json({ message: "Validation Error", validationError });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
export const generalFaild = {
    username: z.string().min(2).max(20),
    email: z.email(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, "Password must be at least 8 characters, contain an uppercase, a lowercase, and a number"),
    confirmPassword: z.string(),
    id: z.string(),
    otp: z.string().regex(/^\d{6}$/)
};
