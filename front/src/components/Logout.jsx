import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearTasks } from "../redux/taskSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearTasks());
    dispatch(logout());

  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
