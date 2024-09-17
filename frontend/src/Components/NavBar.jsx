import React from 'react'
import { useAuth } from "../AuthContext";
import { Link } from 'react-router-dom';
function NavBar() {
    const { logout } = useAuth();
    const exit= () =>{
        localStorage.removeItem("username");
         localStorage.removeItem("email");
    logout();

    }
    
  return (
    <div className='flex justify-between items-center h-16 bg-[#F97F51] px-5'>
        <div className='text-xl w-1/5 font-bold text-white'><Link to='/home'>Blog-Logo</Link></div>

        <ul className='flex justify-evenly text-xl font-semibold text-[#f5f6fa]  w-2/5 items-center gap-16'>
            <li className=' transition-all duration-200'><Link to="/home">Home</Link></li>
            <li className=' transition-all duration-200'><Link to="/addPost">Add Post</Link></li>
            <li className=' transition-all duration-200'><Link to="/profile">My Profile</Link></li>
            
            <li><a href="" onClick={exit}>Logout</a></li>
        </ul>
    </div>
  )
}

export default NavBar