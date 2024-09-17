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
      const response = await axios.post("http://localhost:3000/blog/login", formData);

      if (response.status === 200) {
        setSuccess("Login successful!");
        login(); // Assuming the useAuth() function updates the auth context
        localStorage.setItem("username", response.data.author.authorname);
        localStorage.setItem("email", response.data.author.email);
        // localStorage.setItem("role", "author"); // Assuming role is predefined

        navigate("/home"); // Redirect to the homepage
      }
    } catch (error) {
      setErrors({ apiError: error.response?.data?.message || "Login failed" });
    }
  };

  const handleChangePassword = async (e, email, newPassword) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/blog/author/${email}`, {
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
    <div className="text-blue-600 text-md font-semibold w-full h-screen  bg-[#F8EFBA] flex justify-center items-center">
      <div className="bg-white p-16 rounded-md">
        <h2 className="text-center text-[#F97F51] text-xl">{title}</h2>
        <form className="w-96 mx-auto p-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded"
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
              className="w-full px-3 py-2 border border-gray-300 rounded"
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
                : "w-full bg-[#F97F51] hover:bg-[#cd6133] transition-all duration-200 text-white font-bold py-2 px-4 rounded"
            }`}
          >
            Login
          </button>

          <button
            onClick={(e) => handleChangePassword(e, formData.email, formData.password)}
            type="submit"
            className={`${
              forgotPassword
                ? "w-full bg-[#F97F51] hover:bg-[#cd6133] transition-all duration-200 text-white font-bold py-2 px-4 rounded"
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
          className="mt-4 flex px-4 justify-start gap-2 text-gray-600 cursor-pointer"
        >
          Forgot Password? <span className="text-[#ff793f] hover:underline">Click here</span>
        </p>

        <p className="mt-4 px-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#ff793f] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
