import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoutes";

import Login from './auth/LoginPage.jsx'
import Register from "./auth/RegisterPage.jsx"
import HomePage from "./Pages/HomePage.jsx";
import AddPost from "./Pages/AddPost.jsx";
import ViewEditPost from "./Pages/ViewEditPost.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx"
import ViewPage from "./Pages/ViewPage.jsx";
import Authors from "./Pages/Authors.jsx";
import ChangePassword from "./auth/ChangePassword.jsx";
import YourPost from "./Pages/YourPost.jsx";
import { GlobalStateProvider } from "./GlobalStateContext.jsx";
import Announcement from "./Pages/Announcement.jsx";
import Control from "./Pages/Control.jsx";
import TechCommunity from "./Pages/TechCommunity.jsx";
import ViewSingleAuthor from "./Pages/ViewSingleAuthor.jsx";
import SingleAuthorPosts from "./Pages/SingleAuthorPosts.jsx";
function App() {
  return (
    <AuthProvider>
     <GlobalStateProvider>
      <Router>
        <Routes>
          {/* Public Routes for Login & Register */}
          <Route path="/" element={<Login />} />
          <Route path="/changePassword" element={<ChangePassword/>} />
          <Route path="/register" element={<Register />} />
          {/* <Route
            path="/viewpage/:email/:id"
            element={<ViewPage/>}
          /> */}

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
            path="/viewProfile/:email"
            element={<ProtectedRoute element={<ViewSingleAuthor/>} />}
          />

            <Route
            path="/viewpage/:email/:id"
            element={<ProtectedRoute element={<ViewPage/>} />}
          />
           <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage/>} />}
          />
           <Route
            path="/authors"
            element={<ProtectedRoute element={<Authors/>} />}
          />
           <Route
            path="/yourposts"
            element={<ProtectedRoute element={<YourPost/>} />}
          />

           <Route
            path="/singleAuthorPosts/:email"
            element={<ProtectedRoute element={<SingleAuthorPosts/>} />}
          />

          <Route
            path="/announcement"
            element={<ProtectedRoute element={<Announcement/>} />}
          />

            <Route
            path="/control"
            element={<ProtectedRoute element={<Control/>} />}
          />

           <Route
            path="/community"
            element={<ProtectedRoute element={<TechCommunity/>} />}
          />
        </Routes>
      </Router>
      </GlobalStateProvider>
    </AuthProvider>
  );
}

export default App;
