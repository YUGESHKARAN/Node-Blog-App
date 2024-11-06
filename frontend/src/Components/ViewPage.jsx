import React, { useState, useEffect } from "react";
import blog1 from "../images/blog1.jpg";
// import { useLocation } from "react-router-dom";
import avatar1 from "../images/avatar1.jpg";
// import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from 'react-router-dom';

function ViewPage() {
    // const { logout } = useAuth();
    // const email = localStorage.getItem("email");
    const [author, setAuthor] = useState({});
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const [image,setImage] = useState('')
    const [singlePostData,setSinglePostData] = useState([]);
    const [timeStamp, setTimeStamp] = useState("");
    // const location = useLocation();
    const { email, id } = useParams(); 
    // const {postData }= location.state?.data || {};
    // const postData = location.state?.postData;
    // const { postData } = useParams(); //Accessing Post Id of selected post
    console.log("email data", email);
    console.log("id data", id);
    const navigate = useNavigate();

    useEffect(() => {
      const getSinglrPost = async () => {
        try {
          const response = await axios.get(
            `https://blog-backend-two-flame.vercel.app/blog/posts/${email}/${id}`
          );
          const postData = response.data.data;
          console.log(response.data)
          setSinglePostData(postData);
          setTitle(postData.title);
          setDescription(postData.description || "");
          setImage(postData.image || "");
          setTimeStamp(postData.timestamp);
        } catch (err) {
          console.log(err);
        }
      };
      getSinglrPost();
    }, []);

    console.log("recevied view data",singlePostData)
    console.log("time",timeStamp)

    // console.log("passed id",PostId)
  return (
    <div className="min-h-screen h-auto bg-[#F8EFBA] bg-opacity-50 backdrop-blur-md pb-10">
      <NavBar />
      
      <div className="min-h-screen h-auto md:w-3/6 p-7 md:p-10  flex flex-col justify-center items-center  m-auto mt-10">
      
      <div className="'w-fit bg-white flex flex-col p-4 h-auto   items-center">
          <div className="flex justify-between w-full items-center">
            <div className="flex justify-between gap-2 items-center">
              <img src={`https://blog-backend-two-flame.vercel.app${singlePostData.profile}`} className="md:w-8 w-5 rounded-md" />
              <h3 className="flex flex-col items-center justify-center ">
                <p className="md:text-md  text-sm w-full font-bold">
                  {singlePostData.authorname}
                </p>
                <p className="md:text-sm w-full text-xs  font-semibold text-gray-500">
                  {singlePostData.timestamp?singlePostData.timestamp.slice(0,10):'null'}
                </p>
              </h3>
            </div>  
            <div className="flex justify-start ">
      <button
          className="bg-[#30336b] px-3 py-1 mg:text-base text-xs text-white"
          onClick={() => navigate('/home')}
        >
          back
        </button>
      </div>
          </div>
          <h3 className="w-full  mb-2 mt-2 text-left text-lg md:text-3xl font-bold">
                {singlePostData.title}
            </h3>

          <img
            src={`https://blog-backend-two-flame.vercel.app${singlePostData.image}`}
            className="w-full h-fit"
            alt=""
          />

          <p className="w-full text-justify leading-relaxed text-gray-600 text-md">
            {singlePostData.description}
          </p>
        </div>
        </div>
    </div>
  )
}

export default ViewPage