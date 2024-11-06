import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "../AuthContext";
import { Link } from 'react-router-dom';

function NavBar() {
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuRef = useRef(null);

    const exit = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("message");
        logout();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='flex relative justify-between items-center h-16 bg-[#F97F51] px-5'>
            <div className='md:text-xl text-sm w-1/2 md:w-1/5 font-bold text-white'>
                <Link to='/home'>Blog-Logo</Link>
            </div>

            {/* Desktop Menu */}
            <ul className='lg:flex justify-evenly text-xl hidden font-semibold text-[#f5f6fa]  w-2/5 items-center gap-16'>
                <li className='transition-all duration-200'>
                    <Link to="/home">Home</Link>
                </li>
                <li className='transition-all duration-200'>
                    <Link to="/addPost">Add Post</Link>
                </li>
                <li className='transition-all duration-200'>
                    <Link to="/profile">My Profile</Link>
                </li>
                <li>
                    <a href="" onClick={exit}>Logout</a>
                </li>
            </ul>

            {/* Mobile Hamburger Button */}
            <button onClick={toggleSidebar} className="lg:hidden text-white">
                ☰
            </button>

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`${isSidebarOpen ? 'fixed right-0 top-0 h-full w-64 bg-white shadow-xl' : 'fixed right-[-300px] top-0 h-full w-64 bg-white shadow-xl'} transition-all duration-300 z-50`}
            >
                <ul className='w-full flex flex-col gap-10 text-center mt-10'>
                    <li className='transition-all duration-200'>
                        <Link to="/home">Home</Link>
                    </li>
                    <li className='transition-all duration-200'>
                        <Link to="/addPost">Add Post</Link>
                    </li>
                    <li className='transition-all duration-200'>
                        <Link to="/profile">My Profile</Link>
                    </li>
                    <li>
                        <a href="" onClick={exit}>Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;
