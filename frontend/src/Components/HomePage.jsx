import React,{useState,useEffect} from "react";
import axios from "axios";
// import { useState, useEffect } from "react";
// import { useAuth } from "../AuthContext";
import NavBar from "./NavBar";
import BlogContainer from "./BlogContainer";
import Footer from "./Footer";

function HomePage() {
  const username = localStorage.getItem("username");
  const [posts, setPosts] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [authors,setAuthors] = useState([]);
  const [yourPost,setYourPost]=  useState(0)
  const email = localStorage.getItem('email')

  const getAuthors = async()=>{
    try{
      const response = await axios.get('https://node-blog-app-seven.vercel.app/blog/author')
      setAuthors(response.data);
      console.log("authors",response.data);
    }
    catch(err)
    {
      console.error(err);
    }

  }

  useEffect(()=>{
    getAuthors()
  },[]);

  const getData = async () => {
    // const email = localStorage.getItem("email");
    try {
      const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/posts/`);
      console.log("data", response.data);
      setCategoryCount(response.data.count)
      setPosts(response.data.posts);
      setYourPost(response.data.posts.filter(post=>post.authoremail===email))
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // const yourPost = posts.filter(post=>post.email===eamil)

  console.log('cc',categoryCount);
  console.log('your posts',yourPost);
  console.log('email',email)


  return (
    <div className="w-full  h-auto  relative  ">
      <NavBar/>

      {/* <div className="md:text-2xl text-base mb-10 font-semibold text-center mt-5">Hi,  <span className="text-[#485460] md:text-2xl">{username.toLocaleUpperCase()}</span> <br />welcome to the blog browser!</div> */}
      <div className="md:text-2xl text-xl mb-10 font-bold text-center mt-5">welcome to Blog Browser!</div>

        <div className="grid grid-cols-8 gap-1.5  md:gap-3 w-11/12 md:w-9/12 my-5 mx-auto">

        <div className="col-span-2 p-1 md:w-11/12 w-full md:h-fit lg:h-36 bg-[#dff9fb] rounded-lg shadow-xl flex  items-center justify-center">
            <div className="text-center flex-col justify-center">
            <h1 className="md:text-3xl text-sm ">{yourPost.length}</h1>
            <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-[#2c2c54]">Your Posts</h3>
            </div>
          </div>
          
          <div className="col-span-2 p-1 md:w-11/12 w-full md:h-fit lg:h-36 bg-[#dff9fb] rounded-lg shadow-xl flex  items-center justify-center">
            <div className="text-center flex-col justify-center">
            <h1 className="md:text-3xl text-sm ">{posts.length}</h1>
            <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-[#2c2c54]">Total Posts</h3>
            </div>
          </div>

          <div className="col-span-2 p-1 md:w-11/12 w-full md:h-fit lg:h-36 bg-[#dff9fb] rounded-lg shadow-xl flex  items-center justify-center">
            <div className="text-center flex-col justify-center">
            <h1 className="md:text-3xl text-sm ">{authors.length}</h1>
            <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-[#2c2c54]">Authors</h3>
            </div>
          </div>

          <div className="col-span-2 p-2 md:w-11/12 md:h-fit lg:h-36 bg-[#dff9fb] rounded-lg shadow-xl flex  items-center justify-center">
            <div className="text-center flex-col justify-center">
            <h1 className="md:text-3xl text-sm ">{categoryCount}</h1>
            <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-[#2c2c54]"> Categories</h3>
            </div>
          </div>


        </div>
        
      <BlogContainer/>

      <Footer/>

    </div>
  )
}

export default HomePage