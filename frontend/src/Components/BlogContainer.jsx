import React, { useState, useEffect } from "react";

import axios from "axios";
import blog1 from "../images/blog1.jpg";
// import avatar from '../assets/avatars/avatar.png';
import avatar1 from "../images/avatar1.jpg";
// import { Select } from "@mui/material";
import { IoEye } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

import { Link } from "react-router-dom";
import Footer from "./Footer";
function BlogContainer() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const [postCategory, setPostCategory] = useState("");
  const [posts, setPosts] = useState([]);
  // const [categoryArray,setCategoryArray] = useState()
  const getData = async () => {
    // const email = localStorage.getItem("email");
    try {
      const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/posts/`);
      console.log("data", response.data);
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // get posts data based on selected category
  //   const handleCategory = async (category) =>{

  //    try{
  //     const response = await axios.get(`https://blog-backend-two-flame.vercel.app/blog/posts/${category}`);
  //     console.log("selected category data", response.data)
  //     setCategoryArray(response.data) ;
  //    }
  //    catch(err){
  //  console.log("error",err) ;
  //     }

  //  hd }
   
  // Function to get unique categories
  const getUniqueCategories = (posts) => {
    return posts
      .map((post) => post.category)
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  };

  console.log("stored posts", posts);
  console.log("category selected", postCategory);
  // console.log('select check',categoryArray)
  return (
    <div className="flex  w-11/12 gap-16 flex-wrap   justify-center h-auto m-auto">
      <div
        className={`${
          postCategory === ""
            ? "w-full flex h-8 justify-end  text-black"
            : "w-full flex h-8 justify-between  text-black"
        }`}
      >
        <button
          className={`${
            postCategory === "" ? "hidden" : "bg-[#F8EFBA] px-3 py-1 mg:text-base text-sm font-semibold text-[#182C61]"
          }`}
          onClick={() => setPostCategory("")}
        >
          back
        </button>
        <select
          name=""
          onChange={(e) => {
            const selectedCategory = e.target.value;
            setPostCategory(selectedCategory);
            // handleCategory(selectedCategory);
          }}
          id=""
          className="border text-sm md:text-base rounded-lg border-gray-600 cursor-pointer"
        >
          <option value="">Filter Category</option>
          <option value="">All</option>
          {getUniqueCategories(posts).map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {postCategory === ""
        ? posts.map((data, index) => (
         
            <div
              key={index}
              className="lg:w-3/12 md:w-1/3 bg-[#091533] md:pb-2  flex flex-col shadow-xl h-auto md:h-fit  gap-0  p-4 rounded-xl"
            >
            
              <img
                src={
                  data.image 
                    ?`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`
                    : blog1
                }
                className="w-fit rounded-xl m-auto mt-0"
              />
              <div className="min-h-28  h-auto">
                <h2 className="text-xl text-white font-bold ">{data.title}</h2>
                <p className="text-xs text-gray-300 mt-2">{data.description.slice(0,100)} ...</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex justify-between gap-2 items-center">
                  <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.profie}`} className="w-8 rounded-md" />
                  <h3 className="flex flex-col items-center justify-center ">
                    <p className="text-sm text-white w-full font-semibold">
                      {data.authorname}
                    </p>
                    <p className="text-xs text-gray-400">
                      {data.timestamp.slice(0, 10)}
                    </p>
                  </h3>
                </div>
               <div className="flex gap-3 items-center">

                <div className="flex items-center justify-center gap-2 w-full">
      
                  <p className="cursor-pointer">
                  <Link to={`/viewpage/${data.authoremail}/${data._id}`}>
                      <IoEye className="text-[#F8EFBA]" />
                  </Link>
                  </p>

                <p className={`${data.authoremail===email?'block':'hidden'}`}>
                <Link
                    to={{
                      pathname: `/EditPost/${data._id}`,
                      state: { PostId: data._id },
                    }}
                  >
                  <MdEdit className="text-[#ffb8b8]" />
                </Link>
                </p>
                </div>

               <p 
               onClick={()=>setPostCategory(data.category)} 
               className="px-2 py-1 rounded-md flex bg-gray-300 cursor-pointer text-gray-600 text-sm font-bold">
                  {data.category}
                </p>
               </div>
              </div>
          
            </div>
          ))
        : posts
            .filter((data) => data.category === postCategory)
            .map((data, index) => (
              <div
                key={index}
                className="lg:w-3/12 md:w-1/3  bg-[#091533] flex flex-col shadow-xl  h-auto md:h-96  gap-0  p-4 rounded-xl"
              >
                <img
                  src={
                    data.image
                      ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`
                      : blog1
                  }
                  className="w-fit rounded-xl m-auto mt-0"
                />
                <div className="min-h-28  h-auto">
                  <h2 className="text-xl text-white font-bold ">{data.title}</h2>
                  <p className="text-xs text-gray-300">{data.description.slice(0,100)} ...</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex justify-between gap-2 items-center">
                    <img src={avatar1} className="w-8 rounded-md" />
                    <h3 className="flex flex-col items-center justify-center ">
                      <p className="text-sm text-white w-full font-semibold">
                        {data.authorname}
                      </p>
                      <p className="text-xs text-gray-400">
                        {data.timestamp.slice(0, 10)}
                      </p>
                    </h3>
                  </div>

                  <div className="flex gap-3 items-center">
                  <p className="flex items-center justify-center gap-2 w-full">

               <p className="cursor-pointer">
               <Link to={`/viewpage/${data.authoremail}/${data._id}`}>
                   <IoEye  className="text-[#F8EFBA]" />
               </Link>
               </p>

             <p className={`${data.authoremail===email?'block':'hidden'}`}>
             <Link
                 to={{
                   pathname: `/EditPost/${data._id}`,
                   state: { PostId: data._id },
                 }}
               >
               <MdEdit  className="text-[#ffb8b8]"/>
             </Link>
             </p>
             </p>
             <p
                  onClick={()=>setPostCategory(data.category)} 
                  className="px-2 py-1 rounded-md cursor-pointer flex bg-gray-300 text-gray-600 text-sm font-bold">
                    {data.category}
                  </p>
                  </div>
                  
                </div>
              </div>
            ))}


    </div>
  );
}

export default BlogContainer;
