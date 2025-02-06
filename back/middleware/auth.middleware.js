import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header-
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract the token after "Bearer"
      if (!token) {
        if (!res.headersSent) res.status(401).json({ message: "Unauthorized" });
        return;
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Find user and exclude password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      next(err);
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
      next();
  } else {
      res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export  {authMiddleware, admin};
