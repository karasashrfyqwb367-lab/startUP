import { v4 as uuid } from "uuid";
//  import type { FilterQuery } from "mongoose"
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import { RoleEnum } from "../DB/model/User.model.js";
export var signatureLevelEnum;
(function (signatureLevelEnum) {
    signatureLevelEnum["Bearer"] = "Bearer";
    signatureLevelEnum["admin"] = "admin";
})(signatureLevelEnum || (signatureLevelEnum = {}));
export var TokenEnum;
(function (TokenEnum) {
    TokenEnum["access"] = "access";
    TokenEnum["Refresh"] = "Refresh";
})(TokenEnum || (TokenEnum = {}));
export const generateToken = ({ payload, secret = process.env.ACCESS_USER_TOKEN_SIGNTURE, options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) } }) => {
    return sign(payload, secret, options);
};
export const verfiyToken = async ({ token, secret = process.env.ACCESS_USER_TOKEN_SIGNTURE }) => {
    return verify(token, secret);
};
export const detectsignatureLevel = async (role = RoleEnum.USER) => {
    switch (role) {
        case RoleEnum.ADMIN:
        case RoleEnum.HR:
            return signatureLevelEnum.admin;
        default:
            return signatureLevelEnum.Bearer;
    }
};
export const getSingature = async (signatureLevel = signatureLevelEnum.Bearer) => {
    if (signatureLevel === signatureLevelEnum.admin) {
        return {
            access_signature: process.env.ACCESS_ADMIN_TOKEN_SIGNTURE,
            refresh_signature: process.env.REFRESH_ADMIN_TOKEN_SIGNTURE
        };
    }
    return {
        access_signature: process.env.ACCESS_USER_TOKEN_SIGNTURE,
        refresh_signature: process.env.REFRESH_USER_TOKEN_SIGNTURE
    };
};
export const createLoginCredentials = async (user) => {
    const signatureLevel = await detectsignatureLevel(user.role);
    const signatures = await getSingature(signatureLevel);
    const jwtid = uuid(); // معرف فريد لكل JWT
    const access_token = generateToken({
        payload: { _id: user._id, role: user.role },
        secret: signatures.access_signature,
        options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN), jwtid }
    });
    const refresh_token = generateToken({
        payload: { _id: user._id, role: user.role },
        secret: signatures.refresh_signature,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN), jwtid }
    });
    return { access_token, refresh_token };
};
// export const decodedToken = async ({
//     authorization,
//     tokenType = TokenEnum.access
// }: { authorization: string, tokenType?: TokenEnum }) => {
//     // تقسيم الـ Authorization
//     const [prefix, token] = authorization.split(" ")
//     if (!prefix || !token) throw new ExpcationError("not matching Prefix", 403)
//     // الحصول على المفاتيح حسب النوع
//     const signature = await getSingature(prefix as signatureLevelEnum)
//     // التحقق من JWT
//     const decoded = await verfiyToken({
//         token,
//         secret: tokenType === TokenEnum.Refresh ? signature.refresh_signature : signature.access_signature
//     })
//     if (!decoded?._id || !decoded?.iat) throw new BedReqExpation("invalid Payload Token")
//     // جلب المستخدم مباشرة من UserModel
// // const filter: FilterQuery<HUserDocumet> = { _id: decoded._id as string }
// // const user = await UserModel.findOne(filter)
// //    if (!user) throw new NotFountExpcation("User Not Found")
//     // التحقق من credential changes
//     if ((user.changeCredentialTime?.getTime() || 0) > decoded.iat * 1000) {
//         throw new ExpcationError("Invalid or old Login Credential", 403)
//     }
//     return { user, decoded }
// }
