import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IoSearchOutline,
  IoEye,
  IoClose,
  IoShareSocial,
} from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MagnifyingGlass } from "react-loader-spinner";
import blog1 from "../images/img_not_found.png";
import { BiLike, BiSolidLike } from "react-icons/bi";
import axiosInstance from "../instances/Axiosinstances";

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
      const response = await axiosInstance.get(
        "/blog/posts"
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
      await axiosInstance.put(
        `/blog/posts/views/${authorEmail}/${postId}`,
        { emailAuthor: email }
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
  };

  const postLikes = async (authorEmail, postId, e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/blog/posts/likes/${authorEmail}/${postId}`,
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

   const renderTextWithHashtags = (text) => {
    if (!text) return null;
  
    // Convert visible "\r\n" or "\\n" into real line breaks
    const cleanedText = text.replace(/\\r\\n|\\n|\\r\n/g, '\n');
  
    return cleanedText.split('\n').map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {line.split(/(\s+#\w+)/g).map((word, index) =>
          word.startsWith(" #") ? (
            <span key={index} className="text-md text-white font-italy font-bold">
              {word}
            </span>
          ) : (
            <React.Fragment key={index}>{word}</React.Fragment>
          )
        )}
        <br />
      </React.Fragment>
    ));
  };
 
console.log("posts", posts);  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="flex-col w-11/12 md:gap-16 flex-wrap justify-center h-auto mx-auto">
      <div className="flex md:max-w-5xl md:w-fit  scrollbar-hide mx-auto items-center justify-start gap-3 mb-5 overflow-x-auto ">
      <div
              onClick={()=>setPostCategory('')}
              className="w-fit text-nowrap cursor-pointer  rounded-md bg-gray-800 text-white  text-sm px-3 py-2 hover:bg-gray-700 transition-all duration-200"
            >
              All
            </div>
          {getUniqueCategories(posts).map((data, index) => (
            <div
              key={index}
              onClick={()=>setPostCategory(data)}
              className="w-fit text-nowrap cursor-pointer  rounded-md bg-gray-800 text-white  text-sm px-3 py-2 hover:bg-gray-700 transition-all duration-200"
            >
              {data}
            </div>
          ))} 
          
        </div>
        {/* Search and Filter Section */}
        <div className="w-full flex items-center gap-2 justify-center">
          <div className="md:w-72 w-52 flex border border-gray-600 rounded-xl p-2 bg-gray-800 justify-center gap-2 items-center my-4">
            <IoSearchOutline className="md:text-2xl text-xl text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or category"
              value={searchTerm}
              onChange={handleSearch}
              className="bg-transparent focus:outline-none w-full text-sm text-white placeholder-gray-400"
            />
          </div>

        </div>
    

        {/* Posts Grid */}
        <div className="grid grid-cols-1 w-11/12 md:grid-cols-2 lg:grid-cols-4 md:gap-16 flex-wrap justify-center md:mt-5 h-auto mx-auto">
        {loader ? (
          <div className="col-span-4 flex flex-col items-center justify-center">
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
        
            <div
              key={index}
              className="w-11/12 mx-auto md:w-full bg-gray-800 md:pb-2 flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 h-auto mb-16 p-4 rounded-xl"
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
                  {data.title && data.title.slice(0,25)}...
                </h2>
                <p className="text-xs text-gray-400 mt-2">
                  {renderTextWithHashtags(data.description.slice(0, 100))}...
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
