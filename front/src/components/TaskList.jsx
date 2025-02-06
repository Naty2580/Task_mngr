import React, { useState , useEffect} from "react";
import TaskIocn from '@mui/icons-material/Task';
import { useSelector , useDispatch } from "react-redux";
import { fetchTasks, deleteTasks, updateTasks } from "../redux/taskSlice";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  TextField,
    Modal,
    IconButton,
    Dialog,
    DialogActions,
    DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import TaskForm from "./TaskForm";


const TaskList = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const {tasks, status }  = useSelector((state) => state.tasks);
 // const searchQuery = useSelector(state => state.tasks.searchQuery);
  const [expandedTask, setExpandedTask] = useState(null);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({});


 

  const toggleTaskDetails = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

//   const filteredTasks = (tasks || []).filter(task =>
//     task.title?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
// );

  const onEdit = (task) => {
    setEditedTask(task);
    setEditTaskModalOpen(true);  };

  const onAdd = () => {
    setAddTaskModalOpen(true);  };


  const onClose = () => {
    setSelectedTask(null);
    setAddTaskModalOpen(false);
    setEditTaskModalOpen(false);
    setDeleteDialogOpen(false);
    setCompleteDialogOpen(false);
  }

  const onComplete = (task) => {
    setSelectedTask(task);
    setCompleteDialogOpen(true);  };

  const onDelete = (task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true); 
  };


    const handleEditChange = (e) => {
      e.preventDefault();
      const { name, value } = e.target;
      setEditedTask((prevTask) => ({
        ...prevTask,
        [name]: value,
      }));
    };
  
    // Handle update submission
    const handleUpdate = (  ) => {      
      if(editedTask && editedTask.title && editedTask.description && editedTask._id){ 
      const updateData = { taskId: editedTask._id, updatedData: editedTask };
      dispatch(updateTasks( updateData)); // Dispatch update action
      dispatch(fetchTasks());
      onClose()  
      } else {
        alert("Please fill in all fields");
    }
      };

    const confirmDelete = () => {
      if (selectedTask) {
        console.log(selectedTask._id);
        const taskId = selectedTask._id;
        dispatch(deleteTasks(taskId));
        setDeleteDialogOpen(false);
      }
    };

    const confirmComplete = () => {
      if (selectedTask) {
        const updatedData =  
        { taskId: selectedTask._id, 
          updatedData: {...selectedTask, completed : !selectedTask.completed} };
        dispatch(updateTasks(updatedData));
        dispatch(fetchTasks());
        setCompleteDialogOpen(false);
      }
    };

  return (
    <>
    <Box sx={{ marginTop: "13vh",textAlign: "center",padding: "0 5vw 0 5vw"   }}>

      <Typography variant="h5" sx={{ marginBottom: "0.3rem" }}>
        <TaskIocn /> Task List
      </Typography>

      {status === "loading" && <p>Loading...</p>}

      {tasks.length === 0 ? (
        <p>No tasks found, please add a task</p>
      ) : (
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
              marginBottom: "0.5rem",
              border: "1px solid lightblue",
              borderRadius: "50px",
              padding: "1rem",
              '&:hover': {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                border: "2px solid blue",
                transition: "background-color 0.3s ease",
              },
              
            }}
          >
            <TaskIocn />
            <ListItemText
              primary={task.title}
              secondary={
                expandedTask === task._id ? task.description : null
              }
              onClick={() => toggleTaskDetails(task._id)}
            />

            <Box              
            sx={{ display: "flex",  gap: "0.5rem" }}>

              <Button
                variant="contained"
                onClick={() => toggleTaskDetails(task._id)}
              >
                {expandedTask === task._id ? "Hide" : "Show "}
              </Button>

              <IconButton color="primary" onClick={() => onEdit(task)}>
                    <EditIcon />
                </IconButton>

                <IconButton color="success" onClick={() => onComplete(task)}>
  <Box display="flex" alignItems="center">
    {task.completed ? <DoneIcon /> : <CloseIcon />}
    <Typography variant="body2" sx={{ marginLeft: 1 }}>
      {task.completed ? "Complete" : "Incomplete"}
    </Typography>
  </Box>
</IconButton>

                  <IconButton color="error" onClick={() => onDelete(task)}>
                    <DeleteIcon />
                  </IconButton>
              
            </Box>
          </ListItem>
        ))}
      </List>
      )}

      <Button
      type="button"
      onClick={() => onAdd()}
      variant="contained" color="primary" sx={{ marginTop: "1rem",}}>
        Add Task
      </Button>

    </Box>
  

 {/* ✅ Add Task Modal */}
 <Modal open={addTaskModalOpen} onClose={() => onClose}>
        <Box sx={modalStyle}>
          <TaskForm  onClose={onClose}/>
          <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Modal>



{/* ✅ Edit Task Modal */}
      <Modal open={editTaskModalOpen} onClose={ () => onClose}>
        <Box sx={modalStyle}>

          <Typography variant= "h6" gutterBottom>
            Edit Task
          </Typography>

          <TextField
            label="Title"
            name="title"
            value={editedTask.title}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Description"
            name="description"
            value={editedTask.description}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            multiline
          />

        <Button variant="contained" color="primary" 
        onClick={ handleUpdate} sx={{ mt: 2 }}>
            Save Changes
          </Button>

          <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>

        </Box>

    </Modal>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={onClose}>
        <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Complete Confirmation Dialog */}
      <Dialog open={completeDialogOpen} onClose={onClose}>
        <DialogTitle>completed?</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button onClick={confirmComplete} color="success">
              Change
          </Button>

        </DialogActions>
      </Dialog>
    </>
  );
};




// ✅ Shared Modal Styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default TaskList;
