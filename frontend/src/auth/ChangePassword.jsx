import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
    const [errors, setErrors] = useState({});
      const [success, setSuccess] = useState("");
      const navigate = useNavigate();
     const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        otp: "",
      });

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post("https://node-blog-app-seven.vercel.app/blog/author/reset-password", formData);
          if (response.status === 200) {
            setSuccess("Password updated successfully!");
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        } catch (error) {
          setErrors({ apiError: error.response?.data?.message || "Password update failed" });
        }
      }

      
  return (
    <div className="text-blue-600 text-md font-semibold w-full h-screen  bg-[#130f40] flex justify-center items-center">
         <div className={'bg-white w-11/12 md:w-fit p-16 rounded-md'}>
                <h2 className="text-center text-[#130f40] text-xl">Change Password</h2>
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
                  <div className={'mb-4'}>
                    <label htmlFor="password" className="block text-gray-700">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:text-base text-sm border border-gray-300 rounded"
                      placeholder="Enter OTP"
                      required
                    />
                  </div>
        
                  <div className={'mb-4'}>
                    <label htmlFor="password" className="block text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:text-base text-sm border border-gray-300 rounded"
                      placeholder="Enter Password"
                      required
                    />
                  </div>
        
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className='w-full bg-[#130f40] hover:bg-[#30336b] md:text-base text-sm transition-all duration-200 text-white font-bold py-2 px-4 rounded'
                  >
                    Change Password
                  </button>
                  
                </form>
        
              </div>

    </div>
  )
}

export default ChangePassword