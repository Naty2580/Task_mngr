import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import {
  Box,
  Alert,
  TextField,
  Button,
  Typography,
  Container, 
  MenuItem,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, isAdmin,isSuccess, error, isError } = useSelector((state) => state.auth);
 useEffect(() => {
    if (isSuccess && isAuthenticated) {
      <Alert severity="success">Login successful</Alert>;
      if (isAdmin) {
        navigate("/admin-dashboard");
      }
      else {
        navigate("/");
      }
    }
    if (isError) {
      <Alert severity="error">{error.message}</Alert>;
      navigate("/login");
    }
  }, [ isAuthenticated,navigate,isSuccess,isError, error,dispatch,isAdmin]);
  const handleLogin = async () => {
    try {
      if (!email || !password || !role) {
        <Alert severity="error">("Please fill in all fields")</Alert>;
        return;
      }
      dispatch(loginUser({ email, password ,role}));
    } catch (err) {
      <Alert severity="error">("Something went wrong in handle login")</Alert>;
      navigate("/login");
      return
    }
  };

  
  if (isLoading) {
    return  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress size={50} />
  </Box>;
  }
  if (isError) {
    return <Alert severity="error">{error.message}</Alert>;} 
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
          <InputLabel>Select Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)} label="Select Role">
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Typography
          align="center"
          sx={{ mt: 2, cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
