import React, { useState, useEffect } from "react";
import blog1 from "../images/img_not_found.png";
import { useLocation } from "react-router-dom";
import avatar1 from "../images/avatar1.jpg";
import { useParams } from "react-router-dom";
import NavBar from "../ui/NavBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Footer from "../ui/Footer";
import { MdEdit } from "react-icons/md";
import axiosInstance from "../instances/Axiosinstances";

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
  const[loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([])
  const [error,setError] = useState("")
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  // const [loading, setLoading] = useState(false);
const [previewImage, setPreviewImage] = useState(null);

  const { PostId } = useParams(); //Accessing Post Id of selected post
  console.log("PostId", PostId);

  const onImageChange = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
  //   if (file) {
  //   setPreviewImage(URL.createObjectURL(file)); // Show preview
  //   // If you also want to upload/store the file:
  //   // setImage(file);
  //   setImage(e.target.files[0]);
  // }
    setPreviewImage(URL.createObjectURL(file)); // Show preview
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
  //       `/blog/posts/${email}/${PostId}`,
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

    setLoading(true)
  
    try {
      const response = await axiosInstance.put(
        `/blog/posts/${email}/${PostId}`,
        // `http://localhost:3000/blog/posts/${email}/${PostId}`,
        formData
      );
  
      if (response.status === 200) {
        toast.success('Post edited successfully');
        setTitle("");
        setDescription("");
        setCategory("");
        setImage(null);
        setDocuments([]);
        navigate("/yourposts"); 
      }
    } catch (error) {
      console.error("Error editing post:", error);
      setError({ apiError: error.ValidatorError || "Update failed" });
      toast.error('Failed to edit post');
    }
    finally{
      setLoading(false)
    }
  };
  
  
  // Add a new file input for documents
  const onDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
    // const files = Array.from(e.target.files);
  setSelectedDocs(files.map(file => file.name)); // store names
  };

   const getSinglrPost = async () => {
      try {
        const response = await axiosInstance.get(
          `/blog/posts/${email}/${PostId}`
          // `http://localhost:3000/blog/posts/${email}/${PostId}`
        );
        const postData = response.data.data;
        setSinglePostData(postData);
        setTitle(postData.title);
        setCategory(postData.category);
        setDescription(postData.description || "");
        setImage(postData.image || "");
        setTimeStamp(postData.timestamp);
      } catch (err) {
        console.log(err);
      }
    };
  useEffect(() => {
   
    getSinglrPost();
  }, []);


  const deletePost = async() => {
    setShowConfirm(true);
    setLoading(true)
    try{
      const response = axiosInstance.delete(`/blog/posts/${email}/${PostId}`);
      // const response = axiosInstance.delete(`http://localhost:3000/blog/posts/${email}/${PostId}`);
      console.log("deleted response",response);
        toast.success('post deleted successfully') ;
      navigate("/home");

       setShowConfirm(false);
      

    }
    catch(err){
      console.log(err)
    }
    finally{
      setInterval(() => {
        window.location.reload()// Redirect to the homepage
     }, 2000);
    setLoading(false);
    // getSinglrPost()
      
    }
  }

  

  console.log("single post data", singlePostData);
  return (
    <div className="relative w-full  bg-gradient-to-br from-gray-900 to-gray-800 h-auto min-h-[900px]">
      <NavBar />
      <div className="h-auto md:w-11/12  flex flex-col p-2  justify-center items-center  m-auto mt-10">
        {/* <div className={`${edit?'hidden':'md:w-6/12 w-11/12 md:mb-40  mb-20 bg-gray-800 flex flex-col p-3 h-auto   items-center'}`}>
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
               onClick={()=>{ setShowConfirm(true);}} 
               className="px-2 py-1 text-white font-semibold  rounded-md flex bg-red-600 cursor-pointer hover:bg-red-400 transition-all  text-gray-600 text-xs   md:text-sm font-bold"

               >
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

          <p className="w-full text-justify leading-relaxed text-gray-300 text-base md:text-md">
            {singlePostData.description}
          </p>
        </div> */}
        <div className={`${edit ? 'hidden' : 'md:w-6/12 w-11/12 mb-20 md:mb-40 bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col gap-4 items-center'}`}>
          
          {/* Top section: Author info + controls */}
          <div className="w-full flex items-center justify-between">
            
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <img
                src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.profile}`}
                alt="Author"
                className="md:w-10 w-8 h-8 md:h-10 object-cover rounded-full border border-gray-600"
              />
              <div>
                <p className="text-sm md:text-base font-semibold text-white">{singlePostData.authorname}</p>
                <p className="text-xs text-gray-400">{timeStamp.slice(0, 10)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => setEdit(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-xs md:text-sm font-semibold rounded-md transition"
              >
                Edit
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-xs md:text-sm font-semibold rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="w-full text-left text-white text-xl md:text-3xl font-bold leading-snug">
            {singlePostData.title}
          </h3>

          {/* Blog Image */}
          <div className="w-full overflow-hidden rounded-md">
            <img
              src={singlePostData.image
                ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`
                : blog1}
              alt="Blog Visual"
              className="w-full object-cover rounded-md max-h-[400px]"
            />
          </div>

          {/* Description */}
          <p className="w-full text-justify text-gray-300 text-sm md:text-base leading-relaxed">
            {singlePostData.description}
          </p>
        </div>

        
        <form
          onSubmit={handleSubmit}
          className={`${
            edit
              ? "flex flex-col text-white rounded-lg shadow-lg space-y-6 mb-10 md:mb-12 justify-center p-6 w-11/12 gap-3 m-auto bg-gray-900"
              : "hidden"
          }`}
        >
          <h1 className="md:text-3xl text-2xl font-bold mb-3 text-left w-full border-b border-gray-700 pb-2">
           Edit Your Post
          </h1>
          {error.apiError && <p className="text-red-500">{error.apiError}</p>}
          {/* Title */}
          <div className="w-full">
            <label htmlFor="title" className= "md:text-xl text-sm font-semibold text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder={title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="w-full">
            <label htmlFor="description" className="md:text-xl text-sm font-semibold text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder={description}
              value={description}
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Current Image with Edit Icon */}
          <div className="w-full flex flex-col">
            <label className="md:text-xl text-sm font-semibold text-gray-300">Post Thumbnail</label>
            <div >
              <div className="relative inline-block mt-2">
              <img
                // src={singlePostData.image
                //   ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`
                //   : blog1}
                src={
                  previewImage
                    ? previewImage
                    : singlePostData.image
                    ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${singlePostData.image}`
                    : blog1
                }
                
                className="w-40 h-40 object-contain rounded-lg border border-gray-700"
                alt="Post"
              />
              <label className="absolute bottom-2 right-2 rounded-full bg-white p-1 cursor-pointer ">
               <MdEdit className="text-orange-500"/>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={onImageChange}
                  className="hidden"
                />
              </label>
              </div>
            </div>
          </div>
          

        {/* Current Links with edit option */}
        <div className={`${singlePostData.links?.length > 0 ? 'w-full md:w-11/12 mt-5' : 'hidden'}`}>
          <label className="md:text-xl text-sm font-semibold text-gray-300">Current Links</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {singlePostData.links?.map((link, index) => (
              <div
                key={index}
                className="relative group bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-700"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-100 truncate"
                >
                  <span className="inline-block bg-white text-black rounded-md px-3 py-1 text-xs font-medium mb-2 hover:bg-gray-300 transition">
                    View
                  </span>
                  <p className="text-sm font-semibold">{link.title}</p>
                </a>
                {/* Edit icon overlay */}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-gray-900  p-1.5 rounded-full text-white hover:bg-orange-500 transition-all duration-200  group-hover:opacity-100"
                  onClick={() => {
                    setCurrentLinkTitle(link.title);
                    setCurrentLinkUrl(link.url);
                    setLinks((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  ✎
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Update Links */}
        <div className="w-full md:w-11/12 mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
          <label className="block md:text-xl text-sm font-semibold text-gray-300 mb-2">
            Add / Update Links
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={currentLinkTitle}
              onChange={(e) => setCurrentLinkTitle(e.target.value)}
              placeholder="Title"
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="url"
              value={currentLinkUrl}
              onChange={(e) => setCurrentLinkUrl(e.target.value)}
              placeholder="Link URL"
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => {
                if (currentLinkTitle.trim() && currentLinkUrl.trim()) {
                  const newLink = {
                    title: currentLinkTitle.trim(),
                    url: currentLinkUrl.trim(),
                  };
                  setLinks([...links, newLink]);
                  setCurrentLinkTitle("");
                  setCurrentLinkUrl("");
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-md hover:bg-orange-600 transition-all duration-200"
            >
              Add
            </button>
          </div>

          {/* List of new links being added */}
          {links.length > 0 && (
            <div className="mt-3 space-y-2">
              {links.map((link, index) => (
              <div
                                key={`${link.title}-${index}`}
                                className="flex justify-between items-start bg-gray-700 p-3 md:p-4 rounded-md break-words"
                              >
                                <div className="text-sm break-all">
                                <span className="font-semibold mb-1"> {link.title}: </span> <br />{link.url}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index))
                                  }
                                  className="text-red-500 text-xs ml-2 hover:text-red-700"
                                >
                                  ✕
                                </button>
                              </div>
              ))}
            </div>
          )}
        </div>




          {/* Current Documents with Edit Option */}
          {singlePostData.documents && singlePostData.documents.length > 0 && (
            <div className="w-full">
              <label className="md:text-xl text-sm font-semibold flex items-center justify-between text-gray-300">Current Documents
              <MdEdit className="text-orange-500"/>
                <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={onDocumentsChange}
                        className="hidden"
                      />  
                    </label>
              <div className="flex flex-col gap-2 mt-2">
                {singlePostData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-700"
                  >
                    <a
                      href={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${doc}`}
                      className="text-xs text-gray-300 hover:text-orange-400"
                    >
                      {doc}
                    </a>
              
                  </div>
                ))}
              
              </div>

               {/* New selected documents */}
          {selectedDocs.length > 0 && (
            <div className="mt-4">
              <p className=" md:text-xl text-sm font-semibold mb-1 text-gray-400">Newly Selected:</p>
              <div className=" list-inside text-xs text-gray-300">
                {selectedDocs.map((doc, idx) => (
                  <p key={idx} className="mb-2 "> <span className="font-semibold text-white">{idx +1}.</span>  {doc}</p>
                ))}
              </div>
            </div>
          )}
            </div>
          )}

          {/* Category */}
          <div className="w-full">
            <label htmlFor="category" className="md:text-xl text-sm font-semibold text-gray-300">
              Category
            </label>
            <select
              id="category"
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Domain</option>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 w-full md:w-fit bg-orange-500 text-sm md:text-base text-white font-semibold rounded-lg hover:bg-orange-400 transition-all duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

      </div>
      <ToastContainer />
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full">
      <Footer/>

      </div>

      
      {showConfirm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300">
    <div className="bg-white p-6 rounded-lg shadow-2xl w-11/12 max-w-sm animate-fadeIn">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </div>
        <h2 className="ml-3 text-lg font-semibold text-gray-800">Confirm Deletion</h2>
      </div>

      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        Are you sure you want to delete this Post?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={deletePost}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading? 'Deleting..':'Delete'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ViewEditPost;
