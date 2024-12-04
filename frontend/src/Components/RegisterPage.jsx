import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function RegisterPage() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student", // default to 'student'
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Send a POST request to the API using axios
        const response = await axios.post(
          "https://blog-backend-two-flame.vercel.app/blog/author",
          {
            authorname:formData.username,
            email:formData.email,
            password:formData.password
          }
        );

        if (response.status === 201) {
          setSuccess("Registration successful!");
          login();

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
    <div className="text-blue-600 text-md font-semibold w-full h-screen bg-[#130f40] flex justify-center items-center">
    <div className="bg-white w-11/12 md:w-fit p-16 rounded-md">
      <h2 className="text-center text-[#130f40] text-xl">Register Page</h2>
      <form onSubmit={handleSubmit} className=" md:w-96 w-full mx-auto md:p-4">
        {success && <p className="text-green-500">{success}</p>}
        {errors.apiError && <p className="text-red-500">{errors.apiError}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 md:text-base text-sm border border-gray-300 rounded"
            required
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border md:text-base text-sm border-gray-300 rounded"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border md:text-base text-sm border-gray-300 rounded"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>


        <button
          type="submit"
          className="w-full bg-[#130f40] hover:bg-[#30336b] md:text-base text-sm transition-all duration-200 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      </form>

      {/* Link to login page */}
      <p className="mt-4 md:text-base text-xs text-gray-600">
        Already have an account?{" "}
        <Link to="/" className="text-[#130f40] hover:underline">
          Login here
        </Link>
      </p>
    </div>
  </div>
  )
}

export default RegisterPage