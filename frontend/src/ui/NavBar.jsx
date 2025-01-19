// import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from "../AuthContext";
// import { Link } from 'react-router-dom';
// import { MdLogout, MdPostAdd } from 'react-icons/md';
// import { IoHome, IoLogOut } from 'react-icons/io5';
// import { FaUserAlt } from 'react-icons/fa';
// import bloglogo from '../assets/bloglogo.png'
// import { RiUser3Line, RiUserFollowLine } from 'react-icons/ri';
// import { HiOutlineUserCircle } from 'react-icons/hi';
// function NavBar() {
//     const { logout } = useAuth();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const sidebarRef = useRef(null);
//     const menuRef = useRef(null);

//     const username = localStorage.getItem("username");
//     const exit = () => {
//         localStorage.removeItem("username");
//         localStorage.removeItem("email");
//         localStorage.removeItem("message");
//         logout();
//     };

//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     // Close sidebar when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//                 setIsSidebarOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);

//         // Cleanup event listener
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className='flex relative justify-between items-center h-16 bg-[#091533] mb-2  px-5'>
//             <div className='md:text-xl text-sm w-1/2 md:w-1/5 font-bold text-white'>
//                 <Link to='/home'> <img src={bloglogo} className='w-10 md:w-30 rounded-full' alt="" /></Link>
//             </div>

//             {/* Desktop Menu */}
            
//             <ul className='lg:flex justify-evenly text-base hidden font-semibold text-[#f5f6fa]  w-2/5 items-center gap-10'>
 
                
//                 <li className='transition-all duration-200'>
//                     <Link to="/home" className='flex items-center gap-1'><IoHome className='text-xl'/>Home</Link>
//                 </li>
//                 <li className='transition-all duration-200'>
//                     <Link to="/addPost"  className='flex items-center gap-1'><MdPostAdd className='text-2xl'/> Add Post</Link>
//                 </li>
//                 <li className='transition-all duration-200'>
//                     <Link to="/profile" className='flex items-center gap-1'><FaUserAlt className='text-lg'/>My Profile</Link>
//                 </li>

//                 <li>
//                     {/* <a href="" onClick={exit}>Logout</a> */}
//                     <a href="" className='text-2xl font-bold text-red-500' onClick={exit}><MdLogout/></a>
//                 </li>
//             </ul>

//             {/* Mobile Hamburger Button */}
//            <p className='text-white flex md:hidden items-center gap-1 mr-3 text-sm'> <RiUser3Line className='text-xl text-[#0be881]' /> Hi, {username}</p>
//             <button onClick={toggleSidebar} className="lg:hidden text-white">
//                 ☰
//             </button>

//             {/* Sidebar */}
//             <div
//                 ref={sidebarRef}
//                 className={`${isSidebarOpen ? 'fixed right-0 top-0 h-full w-64  shadow-xl' : 'fixed right-[-300px] top-0 h-full w-64  shadow-xl'} bg-[#d2dae2] text-[#091533] transition-all duration-300 z-50`}
//             >
//                 <ul className='w-full flex flex-col gap-10 text-center mt-10'>
//                     <li className='transition-all duration-200 mx-auto '>
//                         <Link to="/home" className='flex items-center justify-start w-24'><IoHome className='text-xl mr-3'/> Home</Link>
//                     </li>
//                     <li className='transition-all mx-auto duration-200'>
//                         <Link to="/addPost" className='flex items-center justify-start '><MdPostAdd className='text-xl mr-3'/>Add Post</Link>
//                     </li>
//                     <li className='transition-all mx-auto duration-200'>
//                         <Link to="/profile" className='flex items-center justify-start '><FaUserAlt className='text-xl mr-3'/>My Profile</Link>
//                     </li>
//                     <li className='mx-auto'>
//                         <a href="" onClick={exit}><IoLogOut className='text-3xl'/></a>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     );
// }

// export default NavBar;

import React, { useState, useRef, useEffect,useContext } from 'react';
import { useAuth } from "../AuthContext";
import { Link } from 'react-router-dom';
import { MdDataObject, MdLogout, MdPostAdd } from 'react-icons/md';
import { IoHome, IoLogOut, IoPeople } from 'react-icons/io5';
import { FaUserAlt } from 'react-icons/fa';
import bloglogo from '../assets/bloglogo.png';
import { RiUser3Line } from 'react-icons/ri';
import { IoIosClose, IoMdNotifications } from 'react-icons/io';
import { GlobalStateContext } from '../GlobalStateContext';
import axios from 'axios';
import blog1 from "../images/blog1.jpg";
import { io } from "socket.io-client";
function NavBar() {
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuRef = useRef(null);
    const { notification,setNotification } = useContext(GlobalStateContext);
    const username = localStorage.getItem("username");
    const userEmail = localStorage.getItem("email");
    const[socket,setSocket] = useState(null)
    const exit = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("message");
        logout();
    };


    const [note,setNote] = useState([])
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

    useEffect(()=>{
            // Fetch stored notifications from the server
    const fetchNotifications = async () => {
        try {
          const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/author/${userEmail}`);
          setNote(response.data.notification);
          console.log("author email data", response.data.notification)
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
  
      fetchNotifications();
    },[note])


    console.log("notification-------------s",note)

    return (
        <div className='flex relative justify-between items-center h-16 bg-gray-900 mb-2 px-5'>
            <div className='md:text-xl text-sm w-1/2 md:w-1/5 font-bold text-white'>
                <Link to='/home'>
                    <img src={bloglogo} className='w-10 md:w-30 rounded-full' alt="Blog Logo" />
                </Link>
            </div>

            {/* Desktop Menu */}
            <ul className='lg:flex justify-evenly text-base hidden font-semibold text-gray-300 w-2/5 items-center gap-10'>
                <li className='transition-all duration-200 hover:text-white'>
                    <Link to="/home" className='flex items-center gap-1'>
                        <IoHome className='text-xl'/>Home
                    </Link>
                </li>
                <li className='transition-all duration-200 hover:text-white'>
                    <Link to="/addPost" className='flex items-center gap-1'>
                        <MdPostAdd className='text-2xl'/> Add Post
                    </Link>
                </li>
                <li className='transition-all duration-200 hover:text-white'>
                    <Link to="/profile" className='flex items-center gap-1'>
                        <FaUserAlt className='text-lg'/>My Profile
                    </Link>
                </li>
                <li className='transition-all duration-200 hover:text-white'>
                    <Link to="/profile" className='flex text-white items-center'>
                        <IoMdNotifications className='text-2xl text-white'/>{note.length}
                    </Link>
                </li>
                <li>
                    <a href="" className='text-2xl font-bold text-red-500' onClick={exit}>
                        <MdLogout/>
                    </a>
                </li>
            </ul>

            {/* Mobile Hamburger Button */}
            <p className='text-white flex lg:hidden  font-semibold items-center gap-1 mr-3 text-sm'>
                <RiUser3Line className='text-xl text-[#0be881]' /> Hi,{username}  
            </p>
            <p className='transition-all duration-200 hover:text-white'>
                    <Link to="/profile" className='flex items-center '>
                        <IoMdNotifications className='text-lg text-white'/><sup className='text-[10px] text-white'>{note.length>0?note.length:''}</sup>
                    </Link>
                </p>
            <button onClick={toggleSidebar} className="lg:hidden text-white">
                ☰
            </button>

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`${isSidebarOpen ? 'fixed right-0 top-0 h-full w-64 shadow-xl' : 'fixed right-[-300px] top-0 h-full w-64 shadow-xl'} bg-gray-800 text-white transition-all duration-300 z-50`}
            >
                <ul className='w-full flex flex-col gap-10 text-center mt-10'>
                    <li className='transition-all duration-200 mx-auto'>
                        <Link to="/home" className='flex items-center justify-start w-24'>
                            <IoHome className='text-xl mr-3'/> Home
                        </Link>
                    </li>

                    <li className='transition-all mx-auto duration-200'>
                        <Link to="/yourposts" className='flex items-center justify-start'>
                            <MdDataObject  className='text-xl mr-3'/>Your Posts
                        </Link>
                    </li>

                    <li className='transition-all mx-auto duration-200'>
                        <Link to="/authors" className='flex items-center justify-start'>
                            <IoPeople className='text-xl mr-3'/>Authors
                        </Link>
                    </li>

                    <li className='transition-all mx-auto duration-200'>
                        <Link to="/addPost" className='flex items-center justify-start'>
                            <MdPostAdd className='text-xl mr-3'/>Add Post
                        </Link>
                    </li>
                    <li className='transition-all mx-auto duration-200'>
                        <Link to="/profile" className='flex items-center justify-start'>
                            <FaUserAlt className='text-xl mr-3'/>My Profile
                        </Link>
                    </li>
                    <li className='mx-auto'>
                        <a href="" onClick={exit}>
                            <IoLogOut className='text-3xl'/>
                        </a>
                    </li>
                </ul>
            </div>

            {/* notification */}
            <div className="fixed flex-col right-2 top-14 justify-center rounded-md bg-gray-700 p-1 pb-4 z-30 w-44  overflow-y-scroll h-fit max-h-60">
           
                <div className='relative flex-col  justify-start items-start h-auto w-full'>
                    <div className='w-full sticky right-0 top-0 z-30 flex'> <button className='text-[10px] px-2   rounded-md text-black bg-white'>Clear All</button></div>
            
                   {note.map((data,index)=>(
                    <Link 
                    key={index}
                    to={data.url}
                    className='flex relative mt-4 border-b pb-1 border-b-gray-300 w-full mx-auto justify-start pl-2 gap-2 items-center'>
 
                         <img 
                         src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${data.profile}`}
                          className='w-8 h-8 border border-green-500 rounded-full' alt="" />
 
                         <div className='flex-col items-start justify-center'>
                           <p className='text-xs text-white font-semibold '>{data.user}</p>
                           <p className='text-[10px] text-gray-200'>{data.message?data.message.slice(0,5):'got notification'}...</p>
                         </div>
 
                         <div className='text-white absolute right-1 top-0'>
                           <IoIosClose/>
                         </div>
                    </Link>
                   ))}

                   
                </div>
            </div>


        </div>
    );
}

export default NavBar;