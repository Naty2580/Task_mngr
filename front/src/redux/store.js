// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './userSlice';  
import tasksReducer from './taskSlice'; 
import authReducer from './authSlice'; 

const store = configureStore({
  reducer: {
    users: usersReducer,
    tasks: tasksReducer,
    auth: authReducer,
  },
});

export default store;
