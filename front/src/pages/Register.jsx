import React, { useEffect, useState } from "react";
import {useSelector , useDispatch} from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { Box, InputLabel, Select, MenuItem, TextField, Button, Typography } from "@mui/material";
import {register  } from '../redux/authSlice';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {  isLoading,isError, error, isSuccess } = useSelector((state) => state.auth);


  useEffect(() => {
    if ( isSuccess ) {
      navigate("/login");
    }
  }, [ navigate,isSuccess,isError, error]);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        return;
      }
      dispatch(register({name, email, password, role}));
    } catch (err) {
      alert("Something went wrong in handle register");
    }
  };

 
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>error : error</div>;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        variant="outlined"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        margin="normal"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <InputLabel>Select Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)} label="Select Role">
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleRegister}
      >
        Register
      </Button>
      
    </Box>
  );
};

export default Register;
