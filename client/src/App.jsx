import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserHome from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("userData"));
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={userData.type === "admin" ? "/adminhome" : "/userhome"} /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to={userData.type === "admin" ? "/adminhome" : "/userhome"} /> : <Register />} />

        {/* Protected Routes */}
        <Route path="/userhome" element={isLoggedIn ? <UserHome /> : <Navigate to="/login" />} />
        <Route path="/adminhome" element={isLoggedIn ? <AdminHome /> : <Navigate to="/login" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
