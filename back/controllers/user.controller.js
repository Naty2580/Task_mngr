import User from "../models/User.js";
import Task from "../models/Task.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";




// @desc Get a users
// @route GET /api/users/me
// @access Private
export const getUser = asyncHandler(async (req, res) => {
  try{
    const {_id, name, email} = await User.findById(req.user.id).select("-password").lean();
    if(!_id || !name || !email) {
      return res.status(400).json({ message: "No user found" });
    }
    res.status(200).json( { _id, name, email });
  }
  catch (error) {
        logger.error(`Error in user controller: ${err.message}`);
        next(error);
        res.status(500).json({ error: error.message });
  }
});

// @desc Get all users
// @route GET /api/users
// @access Private
export const getAllUsers = asyncHandler(async (req, res) => {
  try{
    const users = await User.find().select("-password").lean();
    if(!users?.length) {
      return res.status(400).json({ message: "No users found" });
    }
    res.json(users);
  }
  catch (error) {
        logger.error(`Error in user controller: ${err.message}`);
        next(error);
        res.status(500).json({ error: error.message });
  }
});

// @desc Create new user
// @route POST /api/users
// @access Private
export const createNewUser = asyncHandler(async (req, res) => {
  const { name, email, password,role } = req.body;
  console.log(name,email,password,role);
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try{
  const userExists = await User.findOne({ email }).lean().exec();
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    if (user) {
        return res.status(201).json({message: `User  ${user.name} created with email ${user.email}`,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
  }
  catch (error) {
    logger.error(`Error in user controller: ${err.message}`);
    next(error);
    res.status(500).json({ error: error.message });
  }
});


// @desc Update user
// @route PUT /api/users/:id 
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password,role } = req.body;
  const {id} = req.params;
  if (!name && !email && !password && !role) {
    return res.status(400).json({ message: "Please fill in at least one field" });
  }
  try{
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const duplicateUser = await User.findOne({ email }).lean().exec();
  if (duplicateUser && duplicateUser._id.toString() !== id) {
    return res.status(409).json({ message: "duplicate username" });
  }
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = req.body.role || user.role; // Allow admin to change roles

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `User ${updatedUser.name} updated` });
  }
  catch (error) {
    logger.error(`Error in user controller: ${err.message}`);
    next(error);
    res.status(500).json({ error: error.message });
  }
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private
export const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  console.log("server id is" + id);
  if(!id) {
    return res.status(400).json({ message: "Please provide an id" });
  }
  
  try{
  const tasks = await Task.find({ user: id }).lean().exec();
  if (tasks.length > 0) {
    return res.status(400).json({ message: "User has tasks" });
  }
  const user = await User.findById(id).exec();
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const result = await user.deleteOne();
  const reply = `User ${user.name} with ID ${user.id} deleted`;
  res.json(reply);
}
  catch (error) {
    logger.error(`Error in user controller: ${error.message}`);
    next(error);
    res.status(500).json({ message: "here is error", error: error.message });
}
});

