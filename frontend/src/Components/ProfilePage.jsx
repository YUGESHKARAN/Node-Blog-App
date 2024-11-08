import React, { useState, useEffect } from "react";
import avatar1 from "../images/avatar1.jpg";
import axios from "axios";
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
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
        `https://blog-backend-two-flame.vercel.app/blog/author/${email}`
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
          `https://blog-backend-two-flame.vercel.app/blog/author/${email}`
        );
        // console.log("Author data", response.data)
        const authorData = response.data;

        setAuthorName(authorData.authorname);
        setAuthorEmail(authorData.email);
        setAuthor(response.data);
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
        `https://blog-backend-two-flame.vercel.app/blog/author/${email}`,
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

  return (
    <div className="w-full min-h-screen  pb-10">
      <NavBar />

      <div className="h-auto mt-5 md:p-10 bg-opacity-50 w-11/12 p-7 md:w-6/12 m-auto rounded-md border-2 border-black">
        <div className="flex w-full justify-end items-end">
          <button
            onClick={deleteAuthor}
            className="text-white bg-red-500 rounded-md px-3 py-2 hover:bg-red-300 transition-all duration-200"
          >
           <RiDeleteBin6Line />
          </button>
        </div>

        <img
          src={`https://blog-backend-two-flame.vercel.app${author.profile}`}
          alt=""
          className="rounded-full border-8 border-green-500  w-40 m-auto"
        />
        <form
          action=""
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col items-start"
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
      <ToastContainer />
    </div>
  );
}

export default ProfilePage;
