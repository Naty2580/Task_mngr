import React ,{  useEffect } from "react";
import {   Box, IconButton, } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TaskIocn from '@mui/icons-material/Task';
import InputBase from '@mui/material/InputBase';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser} from "../redux/authSlice";
import { setSearchQuery } from "../redux/taskSlice";
import LogoutButton from "./Logout";


const Navbar = () => {

const navigate = useNavigate();
const dispatch = useDispatch();
const {isAuthenticated, user} = useSelector((state) => state.auth);
const searchQuery = useSelector((state) => state.tasks.searchQuery);


useEffect(() => {
  if (isAuthenticated && !user) {
    dispatch(fetchUser());
  }
}, [isAuthenticated, user, dispatch]);


  const handleInputChange = (event) => {
    dispatch(setSearchQuery(event.target.value));};


return (

    <Box 
    position="fixed"
    top="0"
    left="0"
    right="0"
    zIndex={100}
    bgcolor="rgb(36, 89, 247)"
    color="white"

    sx={{
        padding: "0.5rem",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        columnGap: "1rem",
        }}>
       { user ? (
        <>
        <IconButton   
            size="medium"
            color="inherit"
            sx={{
            transition: "background-color 0.3s ease", 
            width:"12%",
            minWidth: "100px",
            borderRadius: "8px",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)"},
            }}>
            <TaskIocn/>Tasks
        </IconButton>

                
        <IconButton 
            size="medium"
            color="inherit"
            sx={{
            width:"12%",
            minWidth: "100px",
            transition: "background-color 0.3s ease", 
            borderRadius: "8px", // Slightly rounded corners
            "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",},
            }}>
               < AccountCircleIcon/>{user.name}
        </IconButton>

        <IconButton type="button" sx={{ color: "inherit", }} aria-label="search" onClick={handleInputChange}  >
          <SearchIcon />
        </IconButton>

        <InputBase value={searchQuery} onChange={handleInputChange}
          sx={{  
            width: "40vw",
            color: "inherit",
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: '10px',
            borderRadius: '820px',
          }}
          placeholder="Search tasks"
        />
        <LogoutButton />
     </>
       ):(
        <>
        
        <IconButton   
            size="medium"
            color="inherit"
            onClick={ () => {navigate("/login")}}
            sx={{
            transition: "background-color 0.3s ease", 
            width:"12%",
            minWidth: "100px",
            borderRadius: "8px",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)"},
            }}
           
            >
            <AccountCircleIcon />not logged in
        </IconButton>
        

        
        </>
       )}

    </Box>
      

   
  );
};

export default Navbar;
 