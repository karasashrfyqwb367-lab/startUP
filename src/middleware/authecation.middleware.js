import { verfiyToken } from "../utils/token.js";
import { tokenModel } from "../DB/model/Token.model.js";
import { UserModel } from "../DB/model/User.model.js";

export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Token not exist" });
    }

    const [prefix, token] = authorization.split(" ") || [];
    if (!prefix || !token) {
      return res.status(401).json({ message: "Token not exist" });
    }

    let signature = "";
    if (prefix === "Bearer") signature = process.env.ACCESS_USER_TOKEN_SIGNTURE;
    else if (prefix === "admin") signature = process.env.ACCESS_ADMIN_TOKEN_SIGNTURE;
    else return res.status(401).json({ message: "Invalid token prefix" });

    const decoded = await verfiyToken({ token, signature });

    if (!decoded?._id) return res.status(401).json({ message: "Invalid token" });

    // تحقق من أن التوكن ما اتلغاش
    if (decoded.jti && (await tokenModel.findOne({ jti: decoded.jti }))) {
      return res.status(401).json({ message: "Invalid login credential" });
    }

    // جلب المستخدم من قاعدة البيانات للتأكد من وجوده ومن صلاحياته الحالية
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // حط المستخدم في req
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};


// export const authorization = (
//   accassRoles = [],
//   tokenType = TokenEnum.access
// ) => {
//   return async (req, res, next) => {

//     if (!req.headers.authorization) {
//       throw new BadReqExpcation("vaildition error", {
//         key: "headers",
//         issues: [
//           {
//             path: "authorization",
//             meesage: "missing authorization",
//           },
//         ],
//       });
//     }

//     const { user, decoded } = await decodedToken({
//       authorization: req.headers.authorization,
//       tokenType,
//     });

//     if (!accassRoles.includes(user.role)) {
//       throw new ExpcationError("Not Authorizid Account", 403);
//     }

//     req.user = user;
//     req.decoded = decoded;

//     next();
//   };
// };
