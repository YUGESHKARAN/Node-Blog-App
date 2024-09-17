import React from "react";
import axios from "axios";
// import { useState, useEffect } from "react";
// import { useAuth } from "../AuthContext";
import NavBar from "./NavBar";
import BlogContainer from "./BlogContainer";

function HomePage() {
  const username = localStorage.getItem("username");
  // const email = localStorage.getItem("email");



  return (
    <div className="  h-auto bg-[#F8EFBA] bg-opacity-50 backdrop-blur-md pb-10">
      <NavBar/>

      <div className="text-2xl mb-10 font-semibold text-center mt-5">Hello <span className="text-[#ff793f]">{username.toLocaleUpperCase()}</span> <br />welcome to the blog browser!</div>
      <BlogContainer/>

    </div>
  )
}

export default HomePage