// import React, { useState, useEffect } from "react";
// import blog1 from "../images/blog1.jpg";
// import blog2 from "../images/blog48.jpg";
// import avatar1 from "../images/avatar1.jpg";
// import axios from "axios";
// import NavBar from "../ui/NavBar";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import Footer from "../ui/Footer";
// import { MdOutlineInsertComment } from "react-icons/md";
// import { io } from "socket.io-client";
// import { use } from "react";
// import { SiTruenas } from "react-icons/si";
// import { ReactTyped } from "react-typed";
// import { IoClose } from "react-icons/io5";
// function ViewPage() {
//   const user = localStorage.getItem("username");
//   const userEmail = localStorage.getItem("email");
//   const [message, setMessage] = useState('');
//   const [newMessage, setNewMessage] = useState('');
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [singlePostData, setSinglePostData] = useState([]);
//   const [timeStamp, setTimeStamp] = useState("");
//   const [postId, setPostId] = useState("");
//   const { email, id } = useParams();
//   const [ viewComments,setViewComments] = useState(false);
//   const [showContent, setShowContent] = useState(false);
//   const navigate = useNavigate();
// const [selectedImage, setSelectedImage] = useState(null);
//   // Fetch post data
//   useEffect(() => {
//     const getSinglePost = async () => {
//       try {
//         const response = await axios.get(
//           `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${id}`
//         );
//         const postData = response.data.data;
//         setSinglePostData(postData);
//         setTimeStamp(postData.timestamp);
//         setPostId(postData._id);
//         set
//       } catch (err) {
//         console.error("Error fetching post data", err);
//       }
//     };
//     getSinglePost();
//   }, [email, id]);

//   useEffect(() => {
//     const getComments = async () => {
//       try {
//         const response = await axios.get(
//           `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${id}`
//         );
//         const comments = response.data.data;
//         setMessages(comments.messages);
//       } catch (err) {
//         console.error("Error fetching comments", err);
//       }
//     };
//     getComments();
//   },[messages]);

//   // Socket connection and message handling
//   useEffect(() => {

//     const newSocket = io("https://node-blog-app-x8tt.onrender.com", {
//       transports: ['polling']} ); // Replace with your server URL
//     setSocket(newSocket);

//     newSocket.emit("joinPostRoom", postId);

//     newSocket.on("message", (message) => {
//       // setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [postId]);

//   console.log("postId", postId);

//   // Post comment function
//   const postComment = () => {
//     setViewComments(true)
//     if (newMessage.trim() === "") return;

//     const messageData = {
//       postId,
//       user,
//       email: userEmail,
//       message: newMessage,
//     };

//     socket.emit("newMessage", messageData);
//     setNewMessage("");
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//   };

//   const handleCloseModal = () => {
//     setSelectedImage(null);
//   };
//   console.log("post",singlePostData)

//   console.log("messages",messages)
//   return (
//     <div className="w-full min-h-screen h-auto relative bg-gradient-to-br from-gray-900 to-gray-800">
//       <NavBar />

//       <div className="md:min-h-screen  h-auto md:pb-40 md:w-3/6 w-full pb-20 p-2 md:p-10 flex flex-col justify-center items-center m-auto md:mt-10">
//         <div className="w-full flex bg-gray-800 flex-col p-3 h-auto items-center">
//           <div className="flex justify-between w-full items-center">
//             <div className="flex justify-between gap-2 items-center">
//               <img
//                 src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.profile}`}
//                 className="md:w-8 w-5 rounded-md"
//                 alt="Author Profile"
//               />
//               <h3 className="flex flex-col items-center justify-center">
//                 <p className="md:text-md text-white text-sm w-full font-bold">
//                   {singlePostData.authorname}
//                 </p>
//                 <p className="md:text-sm w-full text-xs font-semibold text-gray-400">
//                   {singlePostData.timestamp ? singlePostData.timestamp.slice(0, 10) : 'null'}
//                 </p>
//               </h3>
//             </div>
//             <div className="flex items-center gap-5 justify-start">
//               <button
//                 className="bg-[#F8EFBA] rounded-md px-2 md:px-3 py-0.5 md:py-1 text-sm md:text-base text-[#182C61]"
//                 onClick={() => navigate('/home')}
//               >
//                 Back
//               </button>
//             </div>
//           </div>

//           <h3 className="w-full text-white mb-2 mt-2 text-left text-lg md:text-3xl font-bold">
//             {singlePostData.title}
//           </h3>

//           <img
//             src={singlePostData.image ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}` : blog1}
//             className="w-full h-fit"
//             alt="Post"
//              onClick={() => handleImageClick(singlePostData.image ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}` : blog1)}
//           />

//           <div className="w-full text-justify mt-2  text-xs leading-relaxed text-gray-300 text-md">
//             {singlePostData.description && showContent ? <>{singlePostData.description} <br /> <span className="text-xs text-yellow-500 cursor-pointer mt-1" onClick={()=>setShowContent(false)}>show Less</span> </> :<> {singlePostData.description && singlePostData.description.slice(0, 60)}... <br /> <span className="text-xs text-yellow-500 cursor-pointer " onClick={()=>setShowContent(SiTruenas)}>Show More</span></>}
//           </div>

//           {/* Comment Section */}
//           <div className="w-full mt-7 p-3 rounded-lg bg-gray-700 text-white">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-bold">Comments Box</h3>
//               <MdOutlineInsertComment
//               onClick={()=>{setViewComments(!viewComments)}}
//                className="text-2xl text-white" />
//               {/* <div className="flex items-center gap-1/2">
//               <MdOutlineInsertComment
//               onClick={()=>{setViewComments(!viewComments)}}
//                className="text-2xl text-white" />  <sub className="text-[10px]">{messages.length}</sub>
//               </div> */}
//             </div>
//             <div className={`${viewComments?'flex-col max-h-96 overflow-y-auto min-h-auto mb-2 items-start justify-start gap-2 mt-2':'flex-col  overflow-y-hidden mb-2 items-start justify-start gap-2 mt-2 h-auto'}`}>
//               {
//               messages.length>0?viewComments?messages.map((msg, index) => (
//                 <div key={index} className="flex h-auto items-start justify-start gap-2 mb-5">
//                   <img
//                   //  src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`}
//                    src={msg.profile && msg.profile!==''?`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`:blog2}
//                    className="w-8 h-8 rounded-full"
//                    />
//                    <div className="flex w-full flex-col items-start justify-start">
//                     <div className="flex justify-between w-full items-center">
//                       <p className="text-[10px] text-gray-200">@{msg.user}</p>
//                       <p className="text-[7px] text-gray-200">🔘{timeStamp.slice(0,10)}</p>
//                     </div>
//                      <p className="text-xs mt-1">{msg.message}</p>
//                    </div>

//                 </div>
//               )):
//               messages.slice(0,1).map((msg, index) => (
//                 <div key={index} className="flex h-auto items-start justify-start gap-2 mb-5">
//                   <img
//                   //  src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`}
//                    src={msg.profile && msg.profile!==''?`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`:blog2}
//                    className="w-8 h-8 rounded-full"
//                    />
//                    <div className="flex w-full flex-col items-start justify-start">
//                     <div className="flex justify-between w-full items-center">
//                       <p className="text-[10px] text-gray-200">@{msg.user}</p>
//                       <p className="text-[7px] text-gray-200">🔘{timeStamp.slice(0,10)}</p>
//                     </div>
//                      <p className="text-xs mt-1">{msg.message}</p>
//                    </div>

//                 </div>
//               ))
//               :
//                <ReactTyped
//                           strings={["Leave a Comment"]}
//                           typeSpeed={70}
//                           backSpeed={60}
//                           className="md:text-sm  text-xs"
//                           // loop
//                         />

//               }
//             </div>
//           </div>

//           <div className="mt-3 flex flex-col items-end w-full justify-end">
//             <input
//               type="text"
//               onChange={(e) => setNewMessage(e.target.value)}
//               value={newMessage}
//               placeholder="Enter Comment"
//               className="w-full text-xs  border border-white  transition-all duration-200 p-2 mt-2 rounded-lg bg-gray-700 text-white"

//             />
//             <button
//               onClick={postComment}
//               className="bg-[#F8EFBA] p-1 text-xs rounded-lg px-2 py-1 mt-2"
//             >
//               Post Comment
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full">
//         <Footer />
//       </div>
//        {/* Image Modal */}
//               {selectedImage && (
//               <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//                 <div className="relative">
//                   <img src={selectedImage} alt="Selected" className="max-w-full w-11/12 mx-auto max-h-full" />
//                   <button
//                     onClick={handleCloseModal}
//                     className="absolute top-0 right-10"
//                   >
//                     <IoClose className="text-2xl text-white"/>
//                   </button>
//                 </div>
//               </div>
//             )}
//     </div>
//   );
// }

// export default ViewPage;

import React, { useState, useEffect, useContext} from "react";
import blog1 from "../images/blog1.jpg";
import blog2 from "../images/blog48.jpg";
import avatar1 from "../images/avatar1.jpg";
import axios from "axios";
import NavBar from "../ui/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../ui/Footer";
import { MdOutlineInsertComment } from "react-icons/md";
import { io } from "socket.io-client";
import { use } from "react";
import { SiTruenas } from "react-icons/si";
import { ReactTyped } from "react-typed";
import { IoClose } from "react-icons/io5";
import { GlobalStateContext } from "../GlobalStateContext";
function ViewPage() {
  const user = localStorage.getItem("username");
  const userEmail = localStorage.getItem("email");
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [singlePostData, setSinglePostData] = useState([]);
  const [timeStamp, setTimeStamp] = useState("");
  const [postId, setPostId] = useState("");
  const { email, id } = useParams();
  const [viewComments, setViewComments] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const {notification, setNotification} = useContext(GlobalStateContext);  
  const [isFocused, setIsFocused] = useState(true); // Track conversation focus

  // Fetch post data
  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const response = await axios.get(
          `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${id}`
        );
        const postData = response.data.data;
        setSinglePostData(postData);
        setTimeStamp(postData.timestamp);
        setPostId(postData._id);
        
      } catch (err) {
        console.error("Error fetching post data", err);
      }
    };
    getSinglePost();
  }, [email, id]);

useEffect(() => {
  const getComments = async () => {
    try {
      const response = await axios.get(
        `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${id}`
      );
      const comments = response.data.data;
      setMessages(comments.messages);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };
getComments();
}, [messages]);

  // Socket connection and message handling
  // "https://node-blog-app-x8tt.onrender.com
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["polling"],
    });
    setSocket(newSocket);

    // Register the user with their email
    newSocket.emit("registerUser", userEmail);
    newSocket.emit("joinPostRoom", postId);

    // Listen for incoming notifications
    newSocket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      setNotification((prevNotifications) => [notification, ...prevNotifications]);
    });

    // Fetch stored notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/author/notification`,
         { email:userEmail}
        );
        setNotification(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    return () => {
      newSocket.disconnect();
    };
  }, [postId, userEmail]);
  


  console.log("postId", postId);

  // Post comment function
  const postComment = () => {
    setViewComments(true);
    if (newMessage.trim() === "") return;

    const messageData = {
      postId,
      user,
      email: userEmail,
      message: newMessage,
    };

    socket.emit("newMessage", messageData);
    setNewMessage("");
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };
console.log('notification',notification)
  return (
    <div className="w-full min-h-screen h-auto relative bg-gradient-to-br from-gray-900 to-gray-800">
      <NavBar />

      <div className="md:min-h-screen  h-auto md:pb-40 md:w-3/6 w-full pb-20 p-2 md:p-10 flex flex-col justify-center items-center m-auto md:mt-10">
        <div className="w-full flex bg-gray-800 flex-col p-3 h-auto items-center">
          <div className="flex justify-between w-full items-center">
            <div className="flex justify-between gap-2 items-center">
              <img
                src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.profile}`}
                className="md:w-8 w-5 rounded-md"
                alt="Author Profile"
              />
              <h3 className="flex flex-col items-center justify-center">
                <p className="md:text-md text-white text-sm w-full font-bold">
                  {singlePostData.authorname}
                </p>
                <p className="md:text-sm w-full text-xs font-semibold text-gray-400">
                  {singlePostData.timestamp
                    ? singlePostData.timestamp.slice(0, 10)
                    : "null"}
                </p>
              </h3>
            </div>
            <div className="flex items-center gap-5 justify-start">
              <button
                className="bg-[#F8EFBA] rounded-md px-2 md:px-3 py-0.5 md:py-1 text-sm md:text-base text-[#182C61]"
                onClick={() => navigate("/home")}
              >
                Back
              </button>
            </div>
          </div>

          <h3 className="w-full text-white mb-2 mt-2 text-left text-lg md:text-3xl font-bold">
            {singlePostData.title}
          </h3>

          <img
            src={
              singlePostData.image
                ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`
                : blog1
            }
            className="w-full h-fit"
            alt="Post"
            onClick={() =>
              handleImageClick(
                singlePostData.image
                  ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`
                  : blog1
              )
            }
          />

          <div className="w-full text-justify mt-2  text-xs leading-relaxed text-gray-300 text-md">
            {singlePostData.description && showContent ? (
              <>
                {singlePostData.description} <br />{" "}
                <span
                  className="text-xs text-yellow-500 cursor-pointer mt-1"
                  onClick={() => setShowContent(false)}
                >
                  show Less
                </span>{" "}
              </>
            ) : (
              <>
                {" "}
                {singlePostData.description &&
                  singlePostData.description.slice(0, 60)}
                ... <br />{" "}
                <span
                  className="text-xs text-yellow-500 cursor-pointer "
                  onClick={() => setShowContent(SiTruenas)}
                >
                  Show More
                </span>
              </>
            )}
          </div>

          {/* Comment Section */}
          <div className="w-full mt-7 p-3 rounded-lg bg-gray-700 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Comments Box</h3>
              <MdOutlineInsertComment
                onClick={() => {
                  setViewComments(!viewComments);
                }}
                className="text-2xl text-white"
              />
              {/* <div className="flex items-center gap-1/2">
              <MdOutlineInsertComment
              onClick={()=>{setViewComments(!viewComments)}}
               className="text-2xl text-white" />  <sub className="text-[10px]">{messages.length}</sub> 
              </div> */}
            </div>
            <div
              className={`${
                viewComments
                  ? "flex-col max-h-96 overflow-y-auto min-h-auto mb-2 items-start justify-start gap-2 mt-2"
                  : "flex-col  overflow-y-hidden mb-2 items-start justify-start gap-2 mt-2 h-auto"
              }`}
            >
              {messages.length > 0 ? (
                viewComments ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className="flex h-auto items-start justify-start gap-2 mb-5"
                    >
                      <img
                        //  src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`}
                        src={
                          msg.profile && msg.profile !== ""
                            ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`
                            : blog2
                        }
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex w-full flex-col items-start justify-start">
                        <div className="flex justify-between w-full items-center">
                          <p className="text-[10px] text-gray-200">
                            @{msg.user}
                          </p>
                          <p className="text-[7px] text-gray-200">
                            🔘{timeStamp.slice(0, 10)}
                          </p>
                        </div>
                        <p className="text-xs mt-1">{msg.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  messages.slice(0, 1).map((msg, index) => (
                    <div
                      key={index}
                      className="flex h-auto items-start justify-start gap-2 mb-5"
                    >
                      <img
                        //  src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`}
                        src={
                          msg.profile && msg.profile !== ""
                            ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`
                            : blog2
                        }
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex w-full flex-col items-start justify-start">
                        <div className="flex justify-between w-full items-center">
                          <p className="text-[10px] text-gray-200">
                            @{msg.user}
                          </p>
                          <p className="text-[7px] text-gray-200">
                            🔘{timeStamp.slice(0, 10)}
                          </p>
                        </div>
                        <p className="text-xs mt-1">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <ReactTyped
                  strings={["Leave a Comment"]}
                  typeSpeed={70}
                  backSpeed={60}
                  className="md:text-sm  text-xs"
                  // loop
                />
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-col items-end w-full justify-end">
            <input
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              placeholder="Enter Comment"
              className="w-full text-xs  border border-white  transition-all duration-200 p-2 mt-2 rounded-lg bg-gray-700 text-white"
            />
            <button
              onClick={postComment}
              className="bg-orange-500 hover:bg-orange-600 text-white p-1 text-xs rounded-lg px-2 py-1 mt-2"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full">
        <Footer />
      </div>
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full w-11/12 mx-auto max-h-full"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-10"
            >
              <IoClose className="text-2xl text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPage;
