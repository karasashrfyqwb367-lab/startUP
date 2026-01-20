
export const authorization = (roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Not authorized" });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
