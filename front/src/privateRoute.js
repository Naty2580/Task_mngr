import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? (<Outlet/>) : (<Navigate to="/login" />);
};

export const AdminRoute = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default PrivateRoute;
