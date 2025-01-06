// import React from "react";
// import axios from "axios";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../AuthContext";

// function RegisterPage() {

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "student", // default to 'student'
//   });

//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   // Validation function
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username) {
//       newErrors.username = "Username is required";
//     }
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }
//     if (!formData.password || formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters long";
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Perform validation
//     const validationErrors = validateForm();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         // Send a POST request to the API using axios
//         const response = await axios.post(
//           "https://node-blog-app-seven.vercel.app/blog/author",
//           {
//             authorname:formData.username,
//             email:formData.email,
//             password:formData.password
//           }
//         );

//         if (response.status === 201) {
//           setSuccess("Registration successful!");
//           login();

//           localStorage.setItem("username", formData.username); // Assuming the username is returned in the response
//           localStorage.setItem("email", formData.email);
          
//           setFormData({
//             username: "",
//             email: "",
//             password: "",
         
//           });

//           navigate("/home");
//         }
//       } catch (error) {
//         if (error.response) {
//           setErrors({
//             apiError: error.response.data.message || "Registration failed",
//           });
//         } else {
//           setErrors({ apiError: "Error connecting to the server" });
//         }
//       }
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
//   return (
//     <div className="text-blue-600 text-md font-semibold w-full h-screen bg-[#130f40] flex justify-center items-center">
//     <div className="bg-white w-11/12 md:w-fit p-16 rounded-md">
//       <h2 className="text-center text-[#130f40] text-xl">Register Page</h2>
//       <form onSubmit={handleSubmit} className=" md:w-96 w-full mx-auto md:p-4">
//         {success && <p className="text-green-500">{success}</p>}
//         {errors.apiError && <p className="text-red-500">{errors.apiError}</p>}

//         <div className="mb-4">
//           <label htmlFor="username" className="block text-gray-700">
//             Username
//           </label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             className="w-full px-3 py-2 md:text-base text-sm border border-gray-300 rounded"
//             required
//           />
//           {errors.username && (
//             <p className="text-red-500 text-sm">{errors.username}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border md:text-base text-sm border-gray-300 rounded"
//             required
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm">{errors.email}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label htmlFor="password" className="block text-gray-700">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border md:text-base text-sm border-gray-300 rounded"
//             required
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm">{errors.password}</p>
//           )}
//         </div>


//         <button
//           type="submit"
//           className="w-full bg-[#130f40] hover:bg-[#30336b] md:text-base text-sm transition-all duration-200 text-white font-bold py-2 px-4 rounded"
//         >
//           Register
//         </button>
//       </form>

//       {/* Link to login page */}
//       <p className="mt-4 md:text-base text-xs text-gray-600">
//         Already have an account?{" "}
//         <Link to="/" className="text-[#130f40] hover:underline">
//           Login here
//         </Link>
//       </p>
//     </div>
//   </div>
//   )
// }

// export default RegisterPage

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../ui/NavBar";
import Footer from "../ui/Footer";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.username) validationErrors.username = "Username is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Send a POST request to the API using axios
        const response = await axios.post(
          "https://node-blog-app-seven.vercel.app/blog/author",
          {
            authorname: formData.username,
            email: formData.email,
            password: formData.password,
          }
        );

        if (response.status === 201) {
          setSuccess("Registration successful!");
          localStorage.setItem("username", formData.username); // Assuming the username is returned in the response
          localStorage.setItem("email", formData.email);

          setFormData({
            username: "",
            email: "",
            password: "",
          });

          navigate("/home");
        }
      } catch (error) {
        if (error.response) {
          setErrors({
            apiError: error.response.data.message || "Registration failed",
          });
        } else {
          setErrors({ apiError: "Error connecting to the server" });
        }
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex justify-center items-center">
 
      <div className="bg-gray-800  w-11/12 max-w-md p-8 rounded-md">
        <h2 className="text-center text-white text-xl">Register</h2>
        <form className="md:w-96 w-full mx-auto md:p-4" onSubmit={handleSubmit}>
          {success && <p className="text-green-500">{success}</p>}
          {errors.apiError && <p className="text-red-500">{errors.apiError}</p>}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter your username"
              required
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 md:text-base text-xs text-gray-300">
          Already have an account?{" "}
          <Link to="/" className="text-green-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
 
    </div>
  );
}

export default RegisterPage;