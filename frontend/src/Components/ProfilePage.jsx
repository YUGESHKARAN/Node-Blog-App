import React, { useState, useEffect } from "react";
import avatar1 from "../images/avatar1.jpg";
import axios from "axios";
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi";
import Footer from "./Footer";
function ProfilePage() {
  const { logout } = useAuth();
  const email = localStorage.getItem("email");
  const [author, setAuthor] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [image,setImage] = useState('')
  const navigate = useNavigate();

  console.log("check email", email);

  const deleteAuthor = async () => {
    try {
      const response = await axios.delete(
        `https://node-blog-app-seven.vercel.app/blog/author/${email}`
      );
      console.log(response.data);
      toast.success("post deleted successfully");
      response.status === 200 && logout();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(
          `https://node-blog-app-seven.vercel.app/blog/author/${email}`
        );
        // console.log("Author data", response.data)
        const authorData = response.data;

        setAuthorName(authorData.authorname);
        setAuthorEmail(authorData.email);
        setAuthor(response.data);
        setImage(response.data.profile)
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthor();
  }, []);

  const onImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData();
    formData.append("authorname", authorName);
    formData.append("email", authorEmail);

    if (image) {
      formData.append("profile", image);
    }
    

    try {
      // Send FormData object directly to the API
      const response = await axios.put(
        `https://node-blog-app-seven.vercel.app/blog/author/${email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Author Edited successfully");
      navigate("/home");
      if (response.status === 200) {
        console.log("Post edited successfully:", response.data);

        toast.success("post Edited successfully");
        navigate("/home"); // Redirect to the homepage

        // Optionally, you can reset the form or redirect the user
        // window.location.reload(); // Uncomment if you want to reload the page
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  console.log("author data", author);
  console.log("author profile", image);

  return (
    <div className="w-full  min-h-screen h-auto relative ">
      <NavBar />

    <div className="h-auto min-h-screen md:pt-10 ">
      
      <div className="h-auto mt-5 md:p-10 bg-opacity-50 w-11/12 p-7 md:w-6/12 m-auto rounded-md border-2 border-black">
        <div className="flex w-full justify-end items-end">
          <button
            onClick={deleteAuthor}
            className="text-white bg-red-500 rounded-md px-3 py-2 hover:bg-red-300 transition-all duration-200"
          >
           <RiDeleteBin6Line />
          </button>
        </div>

       {author.profile?
        <img
        src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`}
        alt=""
        className="rounded-full border-8 border-green-500  w-40 m-auto"
      />:
      <div className="w-full  text-center items-center">
      <HiOutlineUserCircle className="text-center text-[#786fa6] shadow-xl bg-white rounded-3xl border-4 border-green-500 mx-auto text-9xl"/>
      </div>

      }
        <form
          action=""
          onSubmit={handleSubmit}
          className="mt-0 flex flex-col items-start"
        >
          <input
            type="text"
            placeholder={authorName}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full m-auto mt-10 p-3"
          />
          <input
            type="text"
            placeholder={authorEmail}
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="w-full m-auto mt-10 p-3"
          />
          <input
            type="file"
            accept="image/*"
            name="profile"
            onChange={onImageChange}
            className="mt-10"
          />

          <button className="mt-10 bg-[#9c88ff] px-3 py-2 text-md text-white rounded-md">Update My Details</button>
        </form>
       
      </div>
      
      
    </div>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
      <Footer/>

      </div>
      <ToastContainer />

    </div>
  );
}

export default ProfilePage;
