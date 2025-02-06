import express from "express";
import { getTasks, createTask, updateTask, deleteTask }from "../controllers/task.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
const router = express.Router();
import errorHandler from "../middleware/error.middleware.js";


router.get("/",  authMiddleware, errorHandler, getTasks);
router.post("/", authMiddleware, errorHandler, createTask);
router.put("/:id", authMiddleware, errorHandler, updateTask);
router.delete("/:id" ,authMiddleware, errorHandler, deleteTask);

export default router;
  