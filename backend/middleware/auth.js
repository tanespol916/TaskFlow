import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = { _id: user._id, username: user.username, email: user.email};
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token ไม่ถูกต้อง" });
    }
  } else {
    return res.status(401).json({ message: "ไม่มี token กรุณาเข้าสู่ระบบ" });
  }
};

export default authMiddleware;
