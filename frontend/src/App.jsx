import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoutes";

import Login from "./Components/LoginPage";
import Register from "./Components/RegisterPage"; // Corrected casing
import HomePage from "./Components/HomePage";
import AddPost from "./Components/AddPost";
import ViewEditPost from "./Components/ViewEditPost";
import ProfilePage from "./Components/ProfilePage"
import ViewPage from "./Components/ViewPage";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes for Login & Register */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route */}
          <Route
            path="/home"
            element={<ProtectedRoute element={<HomePage/>} />}
          />
          <Route
            path="/addPost"
            element={<ProtectedRoute element={<AddPost/>} />}
          />
            <Route
            path="/EditPost/:PostId"
            element={<ProtectedRoute element={<ViewEditPost/>} />}
          />

            <Route
            path="/viewpage/:email/:id"
            element={<ProtectedRoute element={<ViewPage/>} />}
          />
           <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage/>} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
