// import React, { useState, useEffect } from "react";

// import axios from "axios";
// import blog1 from "../images/blog1.jpg";
// // import avatar from '../assets/avatars/avatar.png';
// import avatar1 from "../images/avatar1.jpg";
// // import { Select } from "@mui/material";
// import { IoEye, IoSearchOutline } from "react-icons/io5";
// import { MdEdit } from "react-icons/md";

// import { Link } from "react-router-dom";
// import Footer from "../ui/Footer";
// import {MagnifyingGlass} from 'react-loader-spinner';
// function BlogContainer() {
//   const username = localStorage.getItem("username");
//   const email = localStorage.getItem("email");
//   const [postCategory, setPostCategory] = useState("");
//   const [posts, setPosts] = useState([]);
//   const [searchTerm,setSearchTerm] = useState('');
//   const[loader,setLoader] = useState(false);
//   // const [categoryArray,setCategoryArray] = useState()
//   const getData = async () => {
//     // const email = localStorage.getItem("email");
//     try {
//       const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/posts/`);
//       console.log("data", response.data);
//       setPosts(response.data.posts);
//     } catch (err) {
//       console.error("Error", err);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   // Function to get unique categories
//   const getUniqueCategories = (posts) => {
//     return posts
//       .map((post) => post.category)
//       .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
//   };

//   const handleSearch= (e) => {
//     setSearchTerm(e.target.value)
//   }
//   // search function starts here
//   const filterdPost = posts.filter((post)=>
//       post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.category.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     useEffect(() => {
//       if (filterdPost.length === 0) {
//         setLoader(true);
//       } else {
//         setLoader(false);
//       }
//     }, [filterdPost]);

//   console.log("stored posts", posts);
//   console.log("category selected", postCategory);
//   // console.log('select check',categoryArray)

//   const postViews = async(userEmail,id) =>{
//     console.log('view email',userEmail)
//     try{
//       const response = await axios.put(`https://node-blog-app-seven.vercel.app/blog/posts/views/${userEmail}/${id}`,
//         {emailAuthor:email}
//       )
//       console.log(response.data)
//       getData();
//     }
//     catch(err)
//     {
//       console.error('error',err)
//     }
//   }
//   return (
//     <div className="flex  w-11/12 md:gap-16 flex-wrap   justify-center h-auto mx-auto">

//       {/* Search bar */}
//      <div className="w-full  flex items-center gap-2 justify-center">
//       <div className="md:w-72 w-52 flex border border-gray-600 rounded-xl p-2 bg-white justify-center gap-2 items-center my-4">
//         <IoSearchOutline className="text-2xl"/>
//           <input
//             type="text"
//             placeholder="Search by title or category"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="bg-transparent focus:outline-none w-full  text-sm"
//           />
//         </div>

//         <select
//           name=""
//           onChange={(e) => {
//             const selectedCategory = e.target.value;
//             setPostCategory(selectedCategory);
//             // handleCategory(selectedCategory);
//           }}
//           id=""
//           className="border md:w-fit w-16 h-7 text-xs md:text-base rounded-lg border-gray-600 cursor-pointer"
//         >
//           {/* <option value="">Filter Category</option> */}
//           <option value="">All</option>
//           {getUniqueCategories(posts).map((category, index) => (
//             <option key={index} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>

//      </div>

//       <div
//         className={`${
//           postCategory === ""
//             ? "w-full flex h-8 justify-end  text-black"
//             : "w-full flex h-8 justify-between mb-5 text-black"
//         }`}
//       >
//         <button
//           className={`${
//             postCategory === "" ? "hidden" : "bg-[#F8EFBA] px-3 py-1 mg:text-base text-sm font-semibold text-[#182C61]"
//           }`}
//           onClick={() => setPostCategory("")}
//         >
//           back
//         </button>
//       </div>
//       <div>

//       </div>

//       {postCategory === ""
//         ?
//         loader?
//         <div className="flex-col items-center justify-center">
//           <MagnifyingGlass
//             visible={true}
//             height="100"
//             width="100"
//             ariaLabel="magnifying-glass-loading"
//             wrapperStyle={{marginTop:'20px'}}
//             wrapperClass="magnifying-glass-wrapper"
//             glassColor="#c0efff"
//             color="#091533"
//             speed={1}

//           />
//         <p className="text-lg font-semibold">
//           Blog Not Found...
//         </p>
//     </div>:
//         filterdPost.map((data, index) => (

//           <div
//             key={index}
//             className="lg:w-3/12 md:w-1/3 bg-[#091533] md:pb-2  flex flex-col shadow-xl  h-auto mb-16  gap-0  p-4 rounded-xl"
//           >

//             <img
//               src={
//                 data.image
//                   ?`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`
//                   : blog1
//               }
//               className="w-[472px] h-[250px]  rounded-xl object-contain m-auto mt-0"
//             />
//             <div className="min-h-28  h-auto">
//               <h2 className="text-xl text-white font-bold ">{data.title}</h2>
//               <p className="text-xs text-gray-300 mt-2">{data.description.slice(0,100)} ...</p>
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="flex justify-between gap-2 items-center">
//                 <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.profie}`} className="w-8 max-h-10 object-cover rounded-md" />
//                 <h3 className="flex flex-col items-center justify-center ">
//                   <p className="text-sm text-white w-full font-semibold">
//                     {data.authorname}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     {data.timestamp.slice(0, 10)}
//                   </p>
//                 </h3>
//               </div>
//              <div className="flex gap-3 items-center">

//               <div className="flex items-center justify-center gap-2 w-full">

//                 <p
//                 onClick={()=>{postViews(data.authoremail,data._id)}}
//                  className="cursor-pointer flex text-[10px] gap-0.5 items-center text-gray-400">
//                 <Link to={`/viewpage/${data.authoremail}/${data._id}`}>
//                     <IoEye className="text-[#F8EFBA] text-base" />
//                 </Link>
//                 {data.views.length>0?data.views.length:''}
//                 </p>

//               <p className={`${data.authoremail===email?'block':'hidden'}`}>
//               <Link
//                   to={{
//                     pathname: `/EditPost/${data._id}`,
//                     state: { PostId: data._id },
//                   }}
//                 >
//                 <MdEdit className="text-[#ffb8b8]" />
//               </Link>
//               </p>
//               </div>

//              <p
//              onClick={()=>setPostCategory(data.category)}
//              className="px-2 py-1 rounded-md flex bg-gray-300 cursor-pointer text-gray-600 text-sm font-bold">
//                 {data.category}
//               </p>
//              </div>
//             </div>

//           </div>

//         ))
//         : posts
//             .filter((data) => data.category === postCategory)
//             .map((data, index) => (
//               <div
//                 key={index}
//                 className="lg:w-3/12 md:w-1/3 mx-auto bg-[#091533] flex flex-col shadow-xl  h-auto md:h-96  gap-0 mb-16   p-4 rounded-xl"
//               >
//                 <img
//                   src={
//                     data.image
//                       ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`
//                       : blog1
//                   }
//                   className="w-[472px] h-full md:h-[250px]  rounded-xl object-cover m-auto mt-0 rounded-xl m-auto mt-0"
//                 />
//                 <div className="min-h-28  h-auto">
//                   <h2 className="text-xl text-white font-bold ">{data.title}</h2>
//                   <p className="text-xs text-gray-300">{data.description.slice(0,100)} ...</p>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <div className="flex justify-between gap-2 items-center">
//                     <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.profie}`} className="w-8 rounded-md" />
//                     <h3 className="flex flex-col items-center justify-center ">
//                       <p className="text-sm text-white w-full font-semibold">
//                         {data.authorname}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         {data.timestamp.slice(0, 10)}
//                       </p>
//                     </h3>
//                   </div>

//                   <div className="flex gap-3 items-center">
//                   <div className="flex items-center justify-center gap-2 w-full">

//                <p
//                onClick={()=>{postViews(data.authoremail,data._id)}}
//                 className="cursor-pointer flex text-[10px] gap-1 items-center text-white">
//                <Link to={`/viewpage/${data.authoremail}/${data._id}`}>
//                    <IoEye className="text-[#F8EFBA] text-base" />
//                </Link>
//                {data.views.length>0?data.views.length:''}
//                </p>

//               <p className={`${data.authoremail===email?'block':'hidden'}`}>
//               <Link
//                   to={{
//                     pathname: `/EditPost/${data._id}`,
//                     state: { PostId: data._id },
//                   }}
//                 >
//                 <MdEdit  className="text-[#ffb8b8]"/>
//               </Link>
//               </p>
//              </div>
//                  <p
//                   onClick={()=>setPostCategory(data.category)}
//                   className="px-2 py-1 rounded-md cursor-pointer flex bg-gray-300 text-gray-600 text-sm font-bold">
//                     {data.category}
//                   </p>
//                   </div>

//                 </div>
//               </div>
//             ))}

//     </div>
//   );
// }

// export default BlogContainer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  IoSearchOutline,
  IoEye,
  IoClose,
  IoShareSocial,
} from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MagnifyingGlass } from "react-loader-spinner";
import blog1 from "../images/blog1.jpg";
import { BiLike, BiSolidLike } from "react-icons/bi";

function BlogContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [postCategory, setPostCategory] = useState("");
  const [loader, setLoader] = useState(false);
  const email = localStorage.getItem("email");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);
  // Fetch posts from API
  const fetchPosts = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        "https://node-blog-app-seven.vercel.app/blog/posts"
      );
      setPosts(
        response.data.posts.filter((post) => post.authoremail !== email)
      );
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
    setLoader(false);
  };

  // share post with social media
  const sharePost = async (title, email, url) => {
    try {
      const data = {
        title: title,
        text: title,
        url: `${window.location.origin}/viewpage/${email}/${url}`,
      };
      const response = await navigator.share(data);
      console.log("post shared successfully", response);
    } catch (err) {
      console.log("error sharing post", err);
    }
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get unique categories
  const getUniqueCategories = (posts) => {
    return [...new Set(posts.map((post) => post.category))];
  };

  // Track post views
  const postViews = async (authorEmail, postId) => {
    try {
      await axios.put(
        `https://node-blog-app-seven.vercel.app/blog/posts/views/${authorEmail}/${postId}`,
        { emailAuthor: email }
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
  };

  const postLikes = async (authorEmail, postId, e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://node-blog-app-seven.vercel.app/blog/posts/likes/${authorEmail}/${postId}`,
        { emailAuthor: email }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(email)
                  ? post.likes.filter((like) => like !== email) // Unlike the post
                  : [...post.likes, email], // Like the post
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
  };

  // Filter posts based on search
  const filterdPost = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const test = [
    {
      "cat":"Data Science"
    },
    {
      "cat":"Machine Learning"
    },
    {
      "cat":"Computer Vision"
    },
    {
      "cat":"IoT"
    },
    {
      "cat":"Gen AI"
    },
   
 
   
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="flex-col w-11/12 md:gap-16 flex-wrap justify-center h-auto mx-auto">
      <div className="flex md:max-w-5xl md:w-fit w-fit scrollbar-hide mx-auto items-center justify-start gap-3 mb-5 overflow-x-auto ">
          {getUniqueCategories(posts).map((data, index) => (
            <div
              key={index}
              onClick={()=>setPostCategory(data)}
              className="w-fit text-nowrap cursor-pointer rounded-md bg-gray-800 text-white  text-md px-3 py-1 hover:bg-gray-700 transition-all duration-200"
            >
              {data}
            </div>
          ))}
        </div>
        {/* Search and Filter Section */}
        <div className="w-full flex items-center gap-2 justify-center">
          <div className="md:w-72 w-52 flex border border-gray-600 rounded-xl p-2 bg-gray-800 justify-center gap-2 items-center my-4">
            <IoSearchOutline className="text-2xl text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or category"
              value={searchTerm}
              onChange={handleSearch}
              className="bg-transparent focus:outline-none w-full text-sm text-white placeholder-gray-400"
            />
          </div>

          <select
            onChange={(e) => setPostCategory(e.target.value)}
            className="border md:w-fit w-16 h-7 text-xs md:text-base rounded-lg border-gray-600 bg-gray-800 text-white cursor-pointer"
          >
            <option value="">All</option>
            {getUniqueCategories(posts).map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

      

        {/* Back Button */}
        <div
          className={`w-full flex h-8 ${
            postCategory ? "justify-between" : "justify-end"
          } mb-5`}
        >
          {postCategory && (
            <button
              className="bg-gray-600 px-3 py-1 text-sm font-semibold text-white rounded-lg hover:bg-gray-700"
              onClick={() => setPostCategory("")}
            >
              Back
            </button>
          )}
        </div>
  
      

        {/* Posts Grid */}
        <div className="flex w-11/12 md:gap-16 flex-wrap justify-center h-auto mx-auto">
        {loader ? (
          <div className="flex-col items-center justify-center">
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="loading"
              wrapperStyle={{ marginTop: "20px" }}
              wrapperClass="magnifying-glass-wrapper"
              glassColor="#4B5563"
              color="#60A5FA"
            />
            <p className="text-sm md:text-lg font-semibold text-gray-400">
              Loading Posts...
            </p>
          </div>
        ) : (
          (postCategory === ""
            ? filterdPost
            : posts.filter((post) => post.category === postCategory)
          ).map((data, index) => (
            // <div
            //   key={index}
            //   className="lg:w-3/12  w-80 bg-gray-800  md:pb-2 flex flex-col
            //   shadow-xl hover:shadow-2xl transition-all duration-300 h-auto mb-16 p-4 rounded-xl"
            // >
            //    <div className="flex mb-2 gap-2 items-center">
            //       <img
            //         src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.profie}`}
            //         className="w-8 max-h-10 object-cover rounded-full border border-gray-600"
            //         alt={data.authorname}
            //       />
            //       <div className="flex flex-col">
            //         <p className="text-xs text-white font-semibold">
            //           {data.authorname}
            //         </p>
            //         <p className="text-xs text-gray-500">
            //           {data.timestamp.slice(0, 10)}
            //         </p>
            //       </div>
            //     </div>
            //   <img
            //     src={data.image ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}` : blog1}
            //     className="w-full h-36 sm:h-40 rounded-xl object-cover bg-center  hover:opacity-90 transition-all duration-300"
            //     alt={data.title}
            //     onClick={() => handleImageClick(data.image ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}` : blog1)}

            //   />
            //   <div className="min-h-28 h-auto py-4">
            //     <h2 className="md:text-xl text-lg text-white font-bold">{data.title}</h2>
            //     <p className="text-xs text-gray-400 mt-2">
            //       {data.description.slice(0,100)}...
            //     </p>
            //   </div>

            //   <div className="flex justify-between items-center mt-2">

            //     <div className="flex gap-3 items-center">
            //       <div className="flex items-center gap-2">
            //         <Link
            //           to={`/viewpage/${data.authoremail}/${data._id}`}
            //           onClick={() => postViews(data.authoremail, data._id)}
            //           className="cursor-pointer flex items-center gap-1  hover:text-blue-300"
            //         >
            //           <IoEye className="text-sm text-blue-400" />
            //           <span className="text-[9px]">{data.views.length || 0}</span>
            //         </Link>

            //          <button
            //             type="button"
            //              onClick={(e) => postLikes(data.authoremail, data._id, e)}
            //             className="cursor-pointer flex items-center gap-1 hover:text-blue-300 bg-transparent border-0 disabled:opacity-50"
            //            >
            //               {(data.likes || []).includes(email) ? (
            //                 <BiSolidLike className="text-sm text-blue-400" />
            //               ) : (
            //                 <BiLike className="text-sm text-blue-400" />
            //               )}
            //               <span className="text-[9px] text-white">
            //               {data.likes && data.likes.length > 0 ? data.likes.length : ""}
            //               </span>
            //           </button>
            //        <div
            //           to={`/viewpage/${data.authoremail}/${data._id}`}
            //           onClick={() => sharePost(data.title,data.authoremail,data._id)}
            //           className="cursor-pointer flex items-center gap-1  hover:text-blue-300"
            //         >
            //           <IoShareSocial className="text-sm text-blue-400" />

            //         </div>

            //       </div>

            //     </div>
            //     <button
            //         onClick={() => setPostCategory(data.category)}
            //         className="px-2 py-1 rounded-full bg-gray-600 text-gray-300 text-sm font-medium
            //          transition-colors duration-200"
            //       >
            //         {data.category}
            //       </button>
            //   </div>
            // </div>
            <div
              key={index}
              className="lg:w-3/12 w-80 bg-gray-800 md:pb-2 flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 h-auto mb-16 p-4 rounded-xl"
            >
              <div className="flex mb-2 gap-2 items-center">
                <img
                  src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.profie}`}
                  className="w-8 max-h-10 object-cover rounded-full border border-gray-600"
                  alt={data.authorname}
                />
                <div className="flex flex-col">
                  <p className="text-xs text-white font-semibold">
                    {data.authorname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.timestamp.slice(0, 10)}
                  </p>
                </div>
              </div>

              {data.image && /\.(mp4|webm|ogg)$/.test(data.image) ? (
                <video
                  src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`}
                  className="w-full h-36 sm:h-40 rounded-xl object-cover bg-center hover:opacity-90 transition-all duration-300"
                  controls
                  alt={data.title}
                  onClick={() =>
                    handleImageClick(
                      `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`
                    )
                  }
                />
              ) : (
                <img
                  src={
                    data.image
                      ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`
                      : blog1
                  }
                  className="w-full h-36 sm:h-40 rounded-xl object-cover bg-center hover:opacity-90 transition-all duration-300"
                  alt={data.title}
                  onClick={() =>
                    handleImageClick(
                      data.image
                        ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.image}`
                        : blog1
                    )
                  }
                />
              )}

              <div className="min-h-28 h-auto py-4">
                <h2 className="md:text-xl text-lg text-white font-bold">
                  {data.title}
                </h2>
                <p className="text-xs text-gray-400 mt-2">
                  {data.description.slice(0, 100)}...
                </p>
              </div>

              {/* <h1
                className={`${
                  data.documents?.length > 0
                    ? "text-xs text-gray-200"
                    : "hidden"
                }`}
              >
                Source Documents & Links:
              </h1>
              <div className="flex-col md:flex w-full items-start mt-2 gap-2">
      
                {
                 data.documents&& data.documents.map((doc, index) => (
                    <a key={index} href={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${doc}`} className="text-xs flex justify-start items-start text-gray-200 gap-1 mb-2 md:mb-0 w-full" ><p className="bg-white rounded-md w-fit px-3 text-xs flex items-center text-black hover:bg-gray-200 transition-all duration-200 justify-center"> {doc} </p> </a>

                    ))
                }
                 {
                 data.links&& data.links.map((link, index) => (
                    <a key={index} href={`${link.url}`} className="text-xs flex justify-start items-start text-gray-200 mb-2 md:mb-0 gap-1 w-full" ><p className="bg-white rounded-md w-fit px-3 text-xs flex items-center text-black hover:bg-gray-200 transition-all duration-200 justify-center"> {link.title} </p> </a>

                    ))
                }
                </div> */}

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/viewpage/${data.authoremail}/${data._id}`}
                      onClick={() => postViews(data.authoremail, data._id)}
                      className="cursor-pointer flex items-center gap-1 hover:text-blue-300"
                    >
                      <IoEye className="text-sm text-blue-400" />
                      <span className="text-[9px]">
                        {data.views.length || ''}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => postLikes(data.authoremail, data._id, e)}
                      className="cursor-pointer flex items-center gap-1 hover:text-blue-300 bg-transparent border-0 disabled:opacity-50"
                    >
                      {(data.likes || []).includes(email) ? (
                        <BiSolidLike className="text-sm text-blue-400" />
                      ) : (
                        <BiLike className="text-sm text-blue-400" />
                      )}
                      <span className="text-[9px] text-white">
                        {data.likes && data.likes.length > 0
                          ? data.likes.length
                          : ""}
                      </span>
                    </button>
                    <div
                      onClick={() =>
                        sharePost(data.title, data.authoremail, data._id)
                      }
                      className="cursor-pointer flex items-center gap-1 hover:text-blue-300"
                    >
                      <IoShareSocial className="text-sm text-blue-400" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPostCategory(data.category)}
                  className="px-2 py-1 rounded-full bg-gray-600 text-gray-300 text-sm font-medium transition-colors duration-200"
                >
                  {data.category}
                </button>
              </div>
            </div>
          ))
        )}   
       </div>

      </div>
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full w-11/12 mx-auto max-h-full"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-10 right-7"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogContainer;
