 import { React,lazy, Suspense } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PrivateRoute = lazy(() => import("./privateRoute"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))
const AdminRoute = lazy(() => import("./privateRoute"))
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />} >
              <Route  element={<AdminRoute />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Route>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Dashboard />} />
          </Route>
          
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
