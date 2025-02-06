import  express from "express";
import { register, login, refreshToken } from "../controllers/auth.controller.js";
 const router = express.Router();
import errorHandler from "../middleware/error.middleware.js";
router.post("/register",errorHandler, register);
router.post("/login", errorHandler, login);
router.post("/refresh", errorHandler, refreshToken);

export default router;
