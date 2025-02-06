import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authroutes from "./routes/auth.routes.js";
import { connectDB } from "./config/db.js";
import taskroutes from "./routes/task.routes.js";
import userroutes from "./routes/user.routes.js";
import errorHandler from "./middleware/error.middleware.js";


// Load environment variables
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(errorHandler);

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    throw new Error("Missing environment variables!");
}

// Routes
app.use("/api/auth",authroutes);
app.use("/api/users", userroutes)
app.use("/api/tasks", taskroutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(process.env.MONGO_URI);
    console.log(`Server running on port ${PORT}`);} );
