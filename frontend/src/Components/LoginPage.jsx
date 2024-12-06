import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [title, setTitle] = useState("Login Page");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [passwordLabel, setPasswordLabel] = useState("Password");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the updated API endpoint
      const response = await axios.post("https://node-blog-app-seven.vercel.app/blog/login", formData);
      // console.log("response",response.data.message)
      if (response.status === 200) {
        setSuccess("Login successful!");
        login(); // Assuming the useAuth() function updates the auth context
        localStorage.setItem("username", response.data.author.authorname);
        localStorage.setItem("email", response.data.author.email);
        localStorage.setItem("message",response.data.message); // Assuming role is predefined
        
        navigate("/home"); // Redirect to the homepage
      }
    } catch (error) {
      setErrors({ apiError: error.response?.data?.message || "Login failed" });
    }
  };

  const handleChangePassword = async (e, email, newPassword) => {
    e.preventDefault();

    try {
      const response = await axios.put(`https://node-blog-app-seven.vercel.app/blog/author/password/${email}`, {
        password: newPassword,
      });

      if (response.status === 201) {
        setSuccess("Password updated successfully!");
        setForgotPassword(false);
        setPasswordLabel("Password");
        setTitle("Login Page");
        window.location.reload(); // Reload the page
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="text-blue-600 text-md font-semibold w-full h-screen  bg-[#130f40] flex justify-center items-center">
      <div className="bg-white w-11/12 md:w-fit p-16 rounded-md">
        <h2 className="text-center text-[#130f40] text-xl">{title}</h2>
        <form className="md:w-96 w-full mx-auto md:p-4">
          {success && <p className="text-green-500">{success}</p>}
          {errors.apiError && <p className="text-red-500">{errors.apiError}</p>}

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
              className="w-full px-3 py-2 md:text-base text-sm border border-gray-300 rounded"
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              {passwordLabel}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 md:text-base text-sm border border-gray-300 rounded"
              placeholder="Enter Password"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className={`${
              forgotPassword
                ? "hidden"
                : "w-full bg-[#130f40] hover:bg-[#30336b] md:text-base text-sm transition-all duration-200 text-white font-bold py-2 px-4 rounded"
            }`}
          >
            Login
          </button>

          <button
            onClick={(e) => handleChangePassword(e, formData.email, formData.password)}
            type="submit"
            className={`${
              forgotPassword
                ? "w-full bg-[#130f40] hover:bg-[#30336b] md:text-base text-sm transition-all duration-200 text-white font-bold py-2 px-4 rounded"
                : "hidden"
            }`}
          >
            Update Password
          </button>
        </form>

        <p
          onClick={() => {
            setForgotPassword(true);
            setPasswordLabel("New Password");
            setTitle("Forgot Password");
          }}
          className="mt-4 flex px-4 justify-start md:text-base text-xs gap-2 text-gray-600 cursor-pointer"
        >
          Forgot Password? <span className="text-[#130f40] md:text-base text-xs hover:underline">Click here</span>
        </p>

        <p className="mt-4 px-4 md:text-base text-xs text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#130f40] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
