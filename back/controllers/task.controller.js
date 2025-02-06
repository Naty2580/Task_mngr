import Task from "../models/Task.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

// Get all tasks for a user
export const getTasks = asyncHandler ( async (req, res) => {
  try{
    const {_id} = await User.findById(req.user.id).lean().exec();
    if(!_id) { 
      return res.status(400).json({ message: "no id provided" });
    }
    const tasks = await Task.find( { user: _id }).lean().exec();
    if(!tasks?.length) {
      return res.status(400).json({ message: "No tasks found" });
    }
  res.json(tasks);  
  } catch (error) {
    logger.error(`Error in task controller: ${err.message}`);
    next(error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
export const createTask = asyncHandler ( async (req, res) => {
  const id = req.user.id;
  const {  title, description } = req.body;
  try {
  if( !title) {
    return res.status(400).json({ message: "Please fill in the title" });
  }
    const task = await Task.create({ user: id, title, description});
    res.status(201).json( {task, message: "Task created successfully" });
  } catch (error) {
    logger.error(`Error in task controller: ${err.message}`);
    next(error);
    res.status(400).json({ error: error.message });
  }
  
});

// Update a task
export const updateTask = asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if(!mongoose.Types.ObjectId.isValid(uid)){
    return res.status(404).json({ success: false, message: "Invalid id"});
}

  try {
    const task = await Task.findOne({ _id: id, user: uid });
    
    if (!task || task.user.toString() !== uid.toString()){
      return res.status(404).json({ message: "Task not found " });
    }

    task.title = title;
    task.description = description;
    task.completed = completed;
    const updatedData = await task.save();
      res.status(200).json({ success: true, data: updatedData});
  } catch (error) {
    logger.error(`Error in task controller: ${err.message}`);
    next(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
export const deleteTask = asyncHandler ( async (req, res) => {
   const uid = req.user.id;
    const {id} = req.params;
    try{
    const task = await Task.findOne({ _id: id, user: uid });
    if (!task || task.user.toString() !== uid)
      return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted" });
}
  catch (error) {
    logger.error(`Error in task controller: ${err.message}`);
    next(error);
    res.status(500).json({ error: error.message });
}
});
