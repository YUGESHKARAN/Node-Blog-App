import React, { useState, useEffect } from "react";
import blog1 from "../images/img_not_found.png";
import { useLocation } from "react-router-dom";
import avatar1 from "../images/avatar1.jpg";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../ui/NavBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Footer from "../ui/Footer";
function ViewEditPost() {
  // const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const [singlePostData, setSinglePostData] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [category, setCategory] = useState("Education");
  const [image, setImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [timeStamp, setTimeStamp] = useState("");
  const [links, setLinks] = useState([]);
  const [currentLinkTitle, setCurrentLinkTitle] = useState('');
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');
  const navigate = useNavigate();

  const { PostId } = useParams(); //Accessing Post Id of selected post
  console.log("PostId", PostId);

  const onImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent the default form submission

  //   const formData = new FormData();
  //   formData.append("title", title);
  //   formData.append("description", description);
  //   formData.append("category", category);
  //   if(image){
  //     formData.append("image", image);
  //   }

  //   try {
  //     // Send FormData object directly to the API
  //     const response = await axios.put(
  //       `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${PostId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
        
  //     );
  //     toast.success('post Edited successfully');
  //     if (response.status === 200) {
  //       console.log("Post edited successfully:", response.data);
  //       setTitle("");
  //       setDescription("");
  //       setCategory("");
  //       setImage(null);
  //       toast.success('post Edited successfully') ;
  //       navigate("/home"); // Redirect to the homepage
        

  //       // Optionally, you can reset the form or redirect the user
  //       // window.location.reload(); // Uncomment if you want to reload the page
  //     }
  //   } catch (error) {
  //     console.error("Error editing post:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append('links', JSON.stringify(links));
    
    if (image) {
      formData.append("image", image);
    }
  
    // Handle document uploads if needed
    if (documents && documents.length > 0) {
      documents.forEach((doc) => {
        formData.append('document', doc);
      });
    }
  
    try {
      const response = await axios.put(
        `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${PostId}`,
        // `http://localhost:3000/blog/posts/${email}/${PostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success('Post edited successfully');
        setTitle("");
        setDescription("");
        setCategory("");
        setImage(null);
        setDocuments([]);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error('Failed to edit post');
    }
  };
  
  // Add this to your state initialization
  const [documents, setDocuments] = useState([]);
  
  // Add a new file input for documents
  const onDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };
  const deletePost = async() => {
    try{
      const response = axios.delete(`https://node-blog-app-seven.vercel.app/blog/posts/${email}/${PostId}`);
      // const response = axios.delete(`http://localhost:3000/blog/posts/${email}/${PostId}`);
      console.log("deleted response",response);
      toast.success('post deleted successfully') ;
      navigate("/home");
      
      

    }
    catch(err){
      console.log(err)
    }
    finally{
      setInterval(() => {
        window.location.reload()// Redirect to the homepage
     }, 2000);
      
    }
  }

  useEffect(() => {
    const getSinglrPost = async () => {
      try {
        const response = await axios.get(
          `https://node-blog-app-seven.vercel.app/blog/posts/${email}/${PostId}`
        );
        const postData = response.data.data;
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

  console.log("single post data", singlePostData);
  return (
    <div className="relative w-full  bg-gradient-to-br from-gray-900 to-gray-800 h-auto min-h-[900px]">
      <NavBar />
      <div className="h-auto md:w-11/12  flex flex-col p-2  justify-center items-center  m-auto mt-10">
        <div className={`${edit?'hidden':'md:w-6/12 w-11/12 md:mb-40  mb-20 bg-gray-800 flex flex-col p-3 h-auto   items-center'}`}>
          <div className="flex  justify-between w-full items-center">
            <div className="flex justify-between gap-2 items-center">
              <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.profile}`} className="md:w-8 w-5 rounded-md" />
              <h3 className="flex flex-col items-center justify-center ">
                <p className="md:text-md text-white text-sm w-full font-bold">
                  {singlePostData.authorname}
                </p>
                <p className="md:text-sm text-xs font-semibold text-gray-500">
                  {timeStamp.slice(0, 10)}
                </p>
              </h3>
            </div>
            <div className="flex gap-3 items-center">
              <p onClick={()=>setEdit(true)}
               className="bg-blue-600 px-2 py-1 text-white font-semibold text-xs   md:text-sm cursor-pointer  hover:bg-blue-400 rounded-md">Edit</p>

              <p
               onClick={deletePost} 
               className="px-2 py-1 text-white font-semibold  rounded-md flex bg-red-600 cursor-pointer hover:bg-red-400 transition-all  text-gray-600 text-xs   md:text-sm font-bold">
                Delete
              </p>
            </div>

          
          </div>
          <h3 className="w-full text-white  mb-2 mt-2 text-left text-lg md:text-3xl font-bold">
                {singlePostData.title}
            </h3>

          <img
            src={singlePostData.image? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`:blog1}
            className="w-full h-fit"
            alt=""
          />

          <p className="w-full text-justify leading-relaxed text-gray-300 text-xs md:text-md">
            {singlePostData.description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          action=""
          className={`${
        edit
              ? "flex flex-col text-white rounded-md space-y-4  mb-10  md:mb-12 justify-center p-5 w-11/12  gap-1 m-auto  "
              : "hidden"
          }`}
        >
          <h1 className="md:text-3xl text-xl font-bold mb-3 text-left w-full">Edit Your Post</h1>

          <div className="w-11/12 mt-1">
            <label htmlFor="title" className="text-md  font-semibold ">
              Title
            </label>{" "}
            <br />
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
              placeholder={title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-11/12 mt-5">
            <label htmlFor="description" className="text-md  font-semibold ">
              Description
            </label>{" "}
            <br />
            <textarea
              id="description"
              className="mt-1 block w-full text-xs leading-relaxed px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder={description}
              value={description}
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="w-11/12 mt-5">
            <label htmlFor="description" className="text-md  font-semibold ">
              current Post
            </label>{" "}
            <br />
           <img src={singlePostData.image? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`: blog1} className="w-40" alt="" />
          </div>


          <div className="w-11/12 mt-5">
            <label htmlFor="description" className="text-md  font-semibold ">
              Update Post
            </label>{" "}
            <br />
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={onImageChange}
              className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
            />
          </div>

          <div className={`${singlePostData.links&&singlePostData.links.length>0?'w-11/12 mt-5':'hidden'}`}>
            <label htmlFor="description" className="text-md  font-semibold ">
              current Links
            </label>{" "}
            <br />
            <div className="flex-col w-full mt-2 items-start justify-start gap-2">
              {
                 singlePostData.links&& singlePostData.links.map((link, index) => (
                    <a key={index} href={`${link.url}`} className="text-xs flex justify-start items-start mb-2 text-gray-200 gap-1 w-full" ><p className="bg-white rounded-md w-fit px-3 text-xs flex items-center hover:bg-gray-300 transition-all duration-200 text-black justify-center"> View </p> {link.title}</a>

                    ))
                }
            </div>
          </div>

          <div className="w-11/12 mt-5">
              <label className="block text-sm font-medium text-gray-300">
               Update Links
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  type="text"
                  value={currentLinkTitle}
                  onChange={(e) => setCurrentLinkTitle(e.target.value)}
                  placeholder="Title"
                  className="w-1/2 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 text-sm p bg-gray-800 border border-gray-600 rounded-md"
                />
                <input
                  type="url"
                  value={currentLinkUrl}
                  onChange={(e) => setCurrentLinkUrl(e.target.value)}
                  placeholder="Link URL"
                  className="w-1/2 focus:outline-none text-xs focus:ring-green-500 focus:border-green-500 md:text-sm px-3 py-1 md:py-2 text-sm  bg-gray-800 border border-gray-600 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (currentLinkTitle.trim() && currentLinkUrl.trim()) {
                      const newLink = { 
                        title: currentLinkTitle.trim(), 
                        url: currentLinkUrl.trim() 
                      };
                      setLinks([...links, newLink]);
                      setCurrentLinkTitle("");
                      setCurrentLinkUrl("");
                    }
                  }}
                  className="mt-1 block  text-xs text-gray-300 mr-4 py-1 md:py-2 px-4 rounded-full border-0 md:text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600"
                >
                  Add
                </button>
              </div>
              {links.length > 0 && (
                <div className="mt-2 space-y-1">
                  {links.map((link, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-700 px-2 py-1 rounded-md">
                      <span className="text-sm">{link.title}: {link.url}</span>
                      <button
                        type="button"
                        onClick={() => setLinks(links.filter((_, i) => i !== index))}
                        className="text-red-500 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          
          <div className={`${singlePostData.documents&&singlePostData.documents.length>0?'w-11/12 mt-5':'hidden'}`}>
            <label htmlFor="description" className="text-md  font-semibold ">
              current Documents
            </label>{" "}
            <br />
            <div className="flex-col w-full mt-2 items-start justify-start gap-2">
              {
                 singlePostData.documents&& singlePostData.documents.map((doc, index) => (
                    <a key={index} href={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${doc}`} className="text-xs flex justify-start items-start mb-2 text-gray-200 gap-1 w-full" ><p className="bg-white rounded-md w-fit px-3 text-xs flex items-center hover:bg-gray-300 transition-all duration-200 text-black justify-center"> Open </p> {doc}</a>

                    ))
                }
            </div>
          </div>

          <div className="w-11/12 mt-5">
            <label htmlFor="documents" className="text-md font-semibold">
              Update Documents
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={onDocumentsChange}
              className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
            />
          </div>


          <div className="w-11/12 mt-5">
            <label htmlFor="category" className="text-md  font-semibold">
              Category
            </label>{" "}
            <br />
            <select
              id="category"
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
                <option value="GenAI">GenAI</option>
                <option value="Design Thinking">Design Thinking</option>
                <option value="Data Science">Data Science</option>
                <option value="Blockchain">Blockchain</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="IoT ">IoT</option>
                <option value="Embedded System">Embedded System</option>
                <option value="Web Development">Web Development</option>   
                <option value="Satellite Space Technology">Satellite Space Technology</option>   
                <option value="Others">Others</option>   
            </select>
          </div>

          <button
            type="submit"
            className="px-3 mt-5 md:mt-0 py-1 w-fit  bg-orange-500 text-sm md:text-base text-[#f7f1e3] hover:bg-orange-400 transition-all duration-200 cursor-pointer rounded-md"
          >
            EDIT POST{" "}
          </button>
        </form>
      </div>
      <ToastContainer />
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full">
      <Footer/>

      </div>
    </div>
  );
}

export default ViewEditPost;
