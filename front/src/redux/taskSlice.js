// src/redux/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../util/axiosInstance';

// Async action to fetch tasks from the server
export const fetchTasks = createAsyncThunk(
  'tasks/',
  async ( {rejectWithValue} ) => {
    try{
    const response = await api.get('/tasks');
    return response.data;
    }catch(error){
      return rejectWithValue(error.response.data.message || "failed tp fetch tasks");
    }
  }
);
export const addTasks = createAsyncThunk(
    'tasks/add',
    async (taskData, {rejectWithValue}) => {
      try{
      const response = await api.post('/tasks', taskData);
      return response.data;
      }catch(error){
        return rejectWithValue(error.response.data.message || "failed to add tasks")
      }
    }
  );
export const updateTasks = createAsyncThunk(
    'tasks/update',
    async ({ taskId, updatedData,rejectWithValue }) => {
      try{
        const response = await api.put(`/tasks/${taskId}`, updatedData);
        return response.data;
        }catch(error){
          return rejectWithValue(error.response.data.message || "failed tp update tasks");
        }
    }
  );
export const deleteTasks = createAsyncThunk(
    'tasks/delete',
    async (taskId, {rejectWithValue}) => {
      try{
      await api.delete(`/tasks/${taskId}`);
      return taskId; // Return the task ID so we can remove it from state
      }catch(error){
        return rejectWithValue(error.response.data.message || "failed tp delete tasks");
      }
    }
  );
 
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    searchQuery:"",
    status: 'idle', // Can be 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
    setSearchQuery: (state, action) => { 
      state.searchQuery = action.payload;
  },
  },
  extraReducers: (builder) => {
    builder
      // Fetching tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Updating a task
      .addCase(updateTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, title, description } = action.payload;
        const existingTask = state.tasks.find((task) => task._id === id);
        if (existingTask) {
          existingTask.title = title;
          existingTask.description = description;
        }
      })
      .addCase(updateTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Adding a task
      .addCase(addTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
      })
      .addCase(addTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Deleting a task
      .addCase(deleteTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        state.tasks = state.tasks.filter((task) => task._id !== id);
      })
      .addCase(deleteTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearTasks, setSearchQuery } = tasksSlice.actions; // Export the action for createSlice
export default tasksSlice.reducer;
