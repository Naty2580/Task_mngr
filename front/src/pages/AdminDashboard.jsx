import { useEffect , useState} from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { fetchusers , updateusers, addusers, deleteusers} from "../redux/userSlice";
import { logout } from "../redux/authSlice";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, InputLabel, FormControl, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, IconButton } from "@mui/material";



const AdminDashboard = () => {

    const {users} = useSelector((state) => state.users, shallowEqual);
    const [addUserData, setAddUserData] = useState({ name: "", email: "", password: "", role: "user" });
    const [editedUser, setEditedUser] = useState({ name: "", email: "", password: "", role: "user" });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState({});


    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                dispatch(fetchusers());
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };
        fetchUsers();   
     }, [dispatch]);


const onclose = () => {
    setUserToDelete(null);
    setAddUserData({ name: "", email: "", password: "", role: "user" });
    setEditedUser({});
    setEditModalOpen(false);
    setAddModalOpen(false);
    setDeleteModalOpen(false);
}
    
const onEdit = (user) => {
    setEditedUser(user);
    setEditModalOpen(true);
  }
const onDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  }
const onAdd = () => {
    setAddModalOpen(true);
  }
  const handleSaveEdit = () => {
    dispatch(updateusers({ id: editedUser._id, updatedUsers: editedUser }));
    dispatch(fetchusers());
    onclose();
  };

  const handleAddUser = () => {
    console.log(addUserData);
    dispatch(addusers({userData: addUserData}));
    setTimeout(() => dispatch(fetchusers()), 1000);
        onclose();
  };

  const handleDeleteUser = () => {
    dispatch(deleteusers({ id: userToDelete._id }));
    dispatch(fetchusers());
    onclose();
  };

  const handleInputChange = (e) => {
    const {name, value}= e.target;
    setEditedUser((prevUser) => ({...prevUser, [name]: value}));
  };

  const handleAddInputChange = (e) => {
    setAddUserData({ ...addUserData, [e.target.name]: e.target.value });
  };


    return (
        <Container sx={{ padding: 3 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Admin Dashboard
        </Typography>
        <Button onClick={() => dispatch(logout())} variant="contained" color="secondary">
          Logout
        </Button>
        <IconButton onClick={onAdd}>
          Add User
        </IconButton>
        <TableContainer sx={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main", color: "common.white" }}>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ marginRight: 1 }}
                      onClick={() => onDelete(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      
 



<Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
<DialogTitle>Edit User</DialogTitle>
<DialogContent>
  <TextField
    label="Name"
    variant="outlined"
    fullWidth
    margin="normal"
    value={editedUser?.name ?? ""}
    onChange={handleInputChange}
    name="name"
  />
  <TextField
    label="Email"
    variant="outlined"
    fullWidth
    margin="normal"
    value={editedUser?.email ?? ""}
    onChange={handleInputChange}
    name="email"
  />
   <TextField
    label="Password"
    variant="outlined"
    fullWidth
    margin="normal"
    value={editedUser?.password ?? ""}
    onChange={handleInputChange}
    name="password"
  />
  <FormControl fullWidth margin="normal">
    <InputLabel>Role</InputLabel>
    <Select
      value={editedUser?.role ?? "user"}
      onChange={handleInputChange}
      name="role"
      label="Role"
    >
      <MenuItem value="user">User</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
    </Select>
  </FormControl>
</DialogContent>
<DialogActions>
  <Button onClick={() => setEditModalOpen(false)} color="primary">Cancel</Button>
  <Button onClick={handleSaveEdit} color="primary">Save</Button>
</DialogActions>
</Dialog>

{/* Add User Modal */}
<Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
<DialogTitle>Add User</DialogTitle>
<DialogContent>
  <TextField
    label="Name"
    variant="outlined"
    fullWidth
    margin="normal"
    name="name"
    value={addUserData.name}
    onChange={handleAddInputChange}
  />
  <TextField
    label="Email"
    variant="outlined"
    fullWidth
    margin="normal"
    name="email"
    value={addUserData.email}
    onChange={handleAddInputChange}
  />
  <TextField
    label="Password"
    variant="outlined"
    fullWidth
    margin="normal"
    name="password"
    type="password"
    value={addUserData.password}
    onChange={handleAddInputChange}
  />
  <FormControl fullWidth margin="normal">
    <InputLabel>Role</InputLabel>
    <Select
      value={addUserData.role   || "user"}
      onChange={handleAddInputChange}
      name="role"
      label="Role"
    >
      <MenuItem value="user">User</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
    </Select>
  </FormControl>
</DialogContent>
<DialogActions>
  <Button onClick={() => setAddModalOpen(false)} color="primary">Cancel</Button>
  <Button onClick={handleAddUser} color="primary">Add</Button>
</DialogActions>
</Dialog>

{/* Delete User Dialog */}
<Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
<DialogTitle>Confirm Deletion</DialogTitle>
<DialogContent>
  <DialogContentText>
    Are you sure you want to delete this user? This action cannot be undone.
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={() => setDeleteModalOpen(false)} color="primary">Cancel</Button>
  <Button onClick={handleDeleteUser} color="secondary">Delete</Button>
</DialogActions>
</Dialog>

</Container>
);
};
export default AdminDashboard;
