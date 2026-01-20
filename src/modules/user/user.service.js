// controllers/users.controller.ts
export const profile = async (req, res) => {
  try {
    const user = req.user; // مستخرج من authentication middleware
    res.status(200).json({ message: "User profile", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
