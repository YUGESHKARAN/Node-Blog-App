// import React, { useState, useEffect } from "react";
// import avatar1 from "../images/avatar1.jpg";
// import axios from "axios";
// import NavBar from "../ui/NavBar";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../AuthContext";
// import { useNavigate } from "react-router-dom";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { HiOutlineUserCircle } from "react-icons/hi";
// import Footer from "../ui/Footer";
// function ProfilePage() {
//   const { logout } = useAuth();
//   const email = localStorage.getItem("email");
//   const [author, setAuthor] = useState({});
//   const [authorName, setAuthorName] = useState("");
//   const [authorEmail, setAuthorEmail] = useState("");
//   const [image,setImage] = useState('')
//   const navigate = useNavigate();

//   console.log("check email", email);

//   const deleteAuthor = async () => {

//     const confirm = window.confirm('Are you sure want to delete your account')
//     if(!confirm) return;
    
//     try {
//       const response = await axios.delete(
//         `https://node-blog-app-seven.vercel.app/blog/author/${email}`
//       );
//       console.log(response.data);
//       toast.success("post deleted successfully");
//       response.status === 200 && logout();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     const fetchAuthor = async () => {
//       try {
//         const response = await axios.get(
//           `https://node-blog-app-seven.vercel.app/blog/author/${email}`
//         );
//         // console.log("Author data", response.data)
//         const authorData = response.data;

//         setAuthorName(authorData.authorname);
//         setAuthorEmail(authorData.email);
//         setAuthor(response.data);
//         setImage(response.data.profile)
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchAuthor();
//   }, []);

//   const onImageChange = (e) => {
//     console.log(e.target.files[0]);
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent the default form submission

//     const formData = new FormData();
//     formData.append("authorname", authorName);
//     localStorage.setItem('username',authorName);
//     formData.append("email", authorEmail);

//     if (image!=='') {
//       formData.append("profile", image);
//     }
    

//     try {
//       // Send FormData object directly to the API
//       const response = await axios.put(
//         `https://node-blog-app-seven.vercel.app/blog/author/${email}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       toast.success("Author Edited successfully");
      
//       if (response.status === 201) {
//         console.log("Post edited successfully:", response.data);

//         toast.success("post Edited successfully");
//         navigate("/home"); // Redirect to the homepage

//         // Optionally, you can reset the form or redirect the user
//         // window.location.reload(); // Uncomment if you want to reload the page
//       }
//     } catch (error) {
//       console.error("Error editing post:", error);
//     }
//   };

//   console.log("author data", author);
//   console.log("author profile", image);

//   return (
//     <div className="w-full  min-h-screen h-auto relative ">
//       <NavBar />

//     <div className="h-auto min-h-screen md:pt-10 ">
      
//       <div className="h-auto mt-5 md:p-10 bg-opacity-50 w-11/12 p-7 md:w-6/12 m-auto rounded-md border-2 border-black">
//         <div className="flex w-full justify-end items-end">
//           <button
//             onClick={deleteAuthor}
//             className="text-white bg-red-500 rounded-md px-3 py-2 hover:bg-red-300 transition-all duration-200"
//           >
//            <RiDeleteBin6Line />
//           </button>
//         </div>

//        {author.profile?
//         <img
//         src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`}
//         alt=""
//         className="rounded-full border-8 border-green-500  w-40 m-auto"
//       />:
//       <div className="w-full  text-center items-center">
//       <HiOutlineUserCircle className="text-center text-[#786fa6] shadow-xl bg-white rounded-3xl border-4 border-green-500 mx-auto text-9xl"/>
//       </div>

//       }
//         <form
//           action=""
//           onSubmit={handleSubmit}
//           className="mt-0 flex flex-col items-start"
//         >
//           <input
//             type="text"
//             placeholder={authorName}
//             value={authorName}
//             onChange={(e) => setAuthorName(e.target.value)}
//             className="w-full m-auto mt-10 p-3"
//           />
//           <input
//             type="text"
//             placeholder={authorEmail}
//             value={authorEmail}
//             onChange={(e) => setAuthorEmail(e.target.value)}
//             className="w-full m-auto mt-10 p-3"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             name="profile"
//             onChange={onImageChange}
//             className="mt-10"
//           />

//           <button className="mt-10 bg-[#9c88ff] px-3 py-2 text-md text-white rounded-md">Update My Details</button>
//         </form>
       
//       </div>
      
      
//     </div>
//     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
//       <Footer/>

//       </div>
//       <ToastContainer />

//     </div>
//   );
// }

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import avatar1 from "../images/avatar1.jpg";
import axios from "axios";
import NavBar from "../ui/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi";
import Footer from "../ui/Footer";

function ProfilePage() {
  const { logout } = useAuth();
  const email = localStorage.getItem("email");
  const [author, setAuthor] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const deleteAuthor = async () => {
    const confirm = window.confirm('Are you sure want to delete your account');
    if (!confirm) return;

    try {
      const response = await axios.delete(
        `https://node-blog-app-seven.vercel.app/blog/author/${email}`
      );
      toast.success("Account deleted successfully");
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
        const authorData = response.data;
        setAuthorName(authorData.authorname);
        setAuthorEmail(authorData.email);
        setAuthor(response.data);
        setImage(response.data.profile);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthor();
  }, [email]);

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData();
    formData.append("authorname", authorName);
    localStorage.setItem('username', authorName);
    formData.append("email", authorEmail);

    if (image !== '') {
      formData.append("profile", image);
    }

    try {
      const response = await axios.put(
        `https://node-blog-app-seven.vercel.app/blog/author/${email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile updated successfully");
      if (response.status === 201) {
        navigate("/home"); // Redirect to the homepage
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <NavBar />
      <div className="container  min-h-screen mx-auto py-8 px-4">
        <h1 className="md:text-3xl text-xl font-bold mb-6">Profile Page</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={deleteAuthor}
            className="text-white bg-red-500 rounded-md px-3 py-2 hover:bg-red-300 transition-all duration-200"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
        <div className="flex flex-col items-center">
          {author.profile? (
            <img
              src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`}
              alt="Profile"
              className="rounded-full object-contain border-8 border-orange-500 w-40 mb-4"
            />
          ) : (
            <div className="w-full text-center items-center">
              <HiOutlineUserCircle className="text-center text-[#786fa6] shadow-xl bg-white rounded-3xl border-4 border-orange-500 mx-auto text-9xl" />
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 w-full md:w-1/2">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-300">
                Author Name
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter author name"
                required
              />
            </div>
            <div>
              <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-300">
                Author Email
              </label>
              <input
                type="email"
                id="authorEmail"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter author email"
                required
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                onChange={onImageChange}
                className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 text-xs md:file:text-sm file:text-xs file:text-white hover:file:bg-orange-600"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-sm md:text-base text-white font-bold rounded-md transition duration-200"
              >
                Update My Details
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default ProfilePage;