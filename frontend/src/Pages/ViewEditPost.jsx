import React, { useState, useEffect } from "react";
import blog1 from "../images/blog1.jpg";
import { useLocation } from "react-router-dom";
import avatar1 from "../images/avatar1.jpg";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../ui/NavBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Footer from "../ui/Footer";
function ViewEditPost() {
  // const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const [singlePostData, setSinglePostData] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [category, setCategory] = useState("Education");
  const [image, setImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [timeStamp, setTimeStamp] = useState("");
  const navigate = useNavigate();

  const { PostId } = useParams(); //Accessing Post Id of selected post
  console.log("PostId", PostId);

  const onImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if(image){
      formData.append("image", image);
    }

    try {
      // Send FormData object directly to the API
      const response = await axios.put(
        `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${PostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
        
      );
      toast.success('post Edited successfully');
      if (response.status === 200) {
        console.log("Post edited successfully:", response.data);
        setTitle("");
        setDescription("");
        setCategory("");
        setImage(null);
        toast.success('post Edited successfully') ;
        navigate("/home"); // Redirect to the homepage
        

        // Optionally, you can reset the form or redirect the user
        // window.location.reload(); // Uncomment if you want to reload the page
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const deletePost = async() => {
    try{
      const response = axios.delete(`https://node-blog-app-seven.vercel.app/blog/posts/${email}/${PostId}`);
      console.log("deleted response",response);
      toast.success('post deleted successfully') ;
      
      navigate("/home"); // Redirect to the homepage

    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    const getSinglrPost = async () => {
      try {
        const response = await axios.get(
          `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${PostId}`
        );
        const postData = response.data.data;
        setSinglePostData(postData);
        setTitle(postData.title);
        setDescription(postData.description || "");
        setImage(postData.image || "");
        setTimeStamp(postData.timestamp);
      } catch (err) {
        console.log(err);
      }
    };
    getSinglrPost();
  }, []);

  console.log("single post data", singlePostData);
  return (
    <div className="relative w-full h-auto min-h-[900px]">
      <NavBar />
      <div className="h-auto w-11/12  flex flex-col justify-center items-center  m-auto mt-10">
        <div className={`${edit?'hidden':'md:w-6/12 w-11/12 bg-[#091533] flex flex-col p-4 h-auto   items-center'}`}>
          <div className="flex  justify-between w-full items-center">
            <div className="flex justify-between gap-2 items-center">
              <img src={avatar1} className="md:w-8 w-5 rounded-md" />
              <h3 className="flex flex-col items-center justify-center ">
                <p className="md:text-md text-white text-sm w-full font-bold">
                  {singlePostData.authorname}
                </p>
                <p className="md:text-sm text-xs font-semibold text-gray-500">
                  {timeStamp.slice(0, 10)}
                </p>
              </h3>
            </div>
            <div className="flex gap-3 items-center">
              <p onClick={()=>setEdit(true)}
               className="bg-blue-600 px-2 py-1 text-white font-semibold text-xs   md:text-sm cursor-pointer  hover:bg-blue-400 rounded-md">Edit</p>

              <p
               onClick={deletePost} 
               className="px-2 py-1 text-white font-semibold  rounded-md flex bg-red-600 cursor-pointer hover:bg-red-400 transition-all  text-gray-600 text-xs   md:text-sm font-bold">
                Delete
              </p>
            </div>

          
          </div>
          <h3 className="w-full text-white  mb-2 mt-2 text-left text-lg md:text-3xl font-bold">
                {singlePostData.title}
            </h3>

          <img
            src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`}
            className="w-full h-fit"
            alt=""
          />

          <p className="w-full text-justify leading-relaxed text-gray-300 text-md">
            {singlePostData.description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          action=""
          className={`${
        edit
              ? "flex flex-col rounded-md items-center justify-center p-5 w-11/12 md:w-6/12 gap-1 m-auto  border-2 border-black"
              : "hidden"
          }`}
        >
          <div className="w-11/12 mt-1">
            <label htmlFor="title" className="text-md  font-semibold ">
              Title
            </label>{" "}
            <br />
            <input
              type="text"
              id="title"
              className="w-full p-3 mt-2 rounded-lg border-2 border-black custom-placeholder focus:outline-none focus:ring-2 focus:ring-[#6D214F]"
              placeholder={title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-11/12 mt-5">
            <label htmlFor="description" className="text-md  font-semibold ">
              Description
            </label>{" "}
            <br />
            <textarea
              id="description"
              className="w-full p-3 mt-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D214F]"
              placeholder={description}
              value={description}
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="w-11/12 mt-5">
            <label htmlFor="description" className="text-md  font-semibold ">
              current Post
            </label>{" "}
            <br />
           <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`} className="w-40" alt="" />
          </div>

          <div className="w-11/12 mt-5">
            <label htmlFor="description" className="text-md  font-semibold ">
              Upload Post
            </label>{" "}
            <br />
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={onImageChange}
            />
          </div>


          <div className="w-11/12 mt-5">
            <label htmlFor="category" className="text-md  font-semibold">
              Category
            </label>{" "}
            <br />
            <select
              id="category"
              className="w-full p-3 mt-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D214F]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
            <option value="Education">Education</option>
            <option value="Food">Food</option>
            <option value="Technology">Technology</option>
            <option value="Job">Job</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Intrenship">Intrenship</option>
            <option value="Exam">Exam</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-3 mt-5 md:mt-0 py-1 bg-[#40407a] text-sm md:text-base text-[#f7f1e3] rounded-md"
          >
            EDIT POST{" "}
          </button>
        </form>
      </div>
      <ToastContainer />
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full">
      <Footer/>

      </div>
    </div>
  );
}

export default ViewEditPost;
