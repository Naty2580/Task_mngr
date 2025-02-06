// src/redux/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../util/axiosInstance';


// Async action to fetch tasks from the server
export const fetchusers = createAsyncThunk(
  'users/',
  async (_, {rejectWithValue}) => {
    try{
    const response = await api.get('/users'); 
    return response.data;
    }catch(error){
      return rejectWithValue(error.response.data.message || "failed tp fetch users");
    }
  }
);

export const addusers = createAsyncThunk(
    'users/add',
    async ( {userData,rejectWithValue}) => {
      try{
        console.log(userData);
      const response = await api.post('/users',userData); 
      console.log(response.data);
      return response.data;
      }catch(error){
        return rejectWithValue(error.response.data.message || "failed tp add users");
      }
    }
  );
export const updateusers = createAsyncThunk(
    'users/update',
    async ({id, updatedUsers}, {rejectWithValue}) => {
      try{
        console.log(updatedUsers);
      const response = await api.put(`/users/${id}` , updatedUsers);
       // Change to your server URL
       console.log(response.data);
      return response.data;
      }catch(error){
        return  rejectWithValue(error.response.data.message || "failed tp update users");
      }
    }
  );
export const deleteusers = createAsyncThunk(
    'users/delete',
    async ({id, rejectWithValue}) => {
      try{
        console.log(id);
      const response = await api.delete(`/users/${id}`);
      console.log(response.data);
      return response.data;
      }catch(error){
        return rejectWithValue(error.response.data.message || "failed tp delete users");
      }
    }
  );

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle', // Can be 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching users
      .addCase(fetchusers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchusers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchusers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
     

      // Updating a task
      .addCase(updateusers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateusers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, name, email, role } = action.payload;
        const existingUser = state.users.find((user) => user._id === id);
        if (existingUser) {
          existingUser.name = name;
          existingUser.email = email;
          existingUser.role = role;
        }
      })
      .addCase(updateusers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Adding a task
      .addCase(addusers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addusers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(addusers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Deleting a task
      .addCase(deleteusers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteusers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        state.users = state.users.filter((user) => user._id !== id);
      })
      .addCase(deleteusers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
