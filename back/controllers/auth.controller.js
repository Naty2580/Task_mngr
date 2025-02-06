import dotenv from "dotenv";
import User from "../models/User.js";
import  jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
// Register a new user
dotenv.config();
 
const secretKey = process.env.ACCESS_TOKEN_SECRET || "secret";
const refreshKey = process.env.REFRESH_TOKEN_SECRET || "secret";

export const register = async (req, res) => {
  const { name, email, password,role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 5) {
    return res.status(400).json({ message: "Password must be at least 5 characters long" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const user = new User({ name, email, password: hashedPassword, role });  
    await user.save();
    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }
    res.status(200).json({
      "success": true,
      "message": "register successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }
    );
  } catch (err) {
    logger.error(`Error in auth controller: ${err.message}`);
    res.status(400).json({ error: err.message });
    next(err);
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password,role } = req.body;
  if (!email || !password || !role)  {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(404).json({ message: "User not found" })
   
    const isMatch = await  bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
     if (user.role !== role) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const accesstoken = jwt.sign(
      { id: user._id }, 
      secretKey, 
      { expiresIn: "30m" }
    );
    const refreshtoken = jwt.sign(
      { id: user._id }, 
      refreshKey, 
      { expiresIn: "1d" }
    );

    res.status(200).json({
      "success": true,
      "message": "Login successful",
      "accessToken": accesstoken,
      "refreshToken": refreshtoken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }    }
    );
  } catch (err) {
    logger.error(`Error in auth controller: ${err.message}`);
    res.status(400).json({ error: err.message });
    next(err);
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "error loading token" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(token, refreshKey);
    
    // Generate a new access token
    const newAccessToken = jwt.sign({ id: decoded.id }, secretKey, {
      expiresIn: "30m",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

