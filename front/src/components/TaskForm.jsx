import React, { useState  } from "react";
import {  useDispatch} from "react-redux";
import { Box,TextField, Button } from "@mui/material";
import { addTasks } from "../redux/taskSlice";

const TaskForm = () => {
  const dispatch = useDispatch();

  
  const [title, setTitle] = useState( "");
  const [description, setDescription] = useState( "");
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return; 
    dispatch(addTasks( {title, description }));
    setTitle("");
    setDescription("");
  }; 
 
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "300px",
        margin: "auto",
      }}
    >
      
      <TextField
        label="Task Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Task Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary">
        Add Task
      </Button>

      
    </Box>
  );
};

export default TaskForm;
