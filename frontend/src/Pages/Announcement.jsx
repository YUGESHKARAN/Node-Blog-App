import React, { useState,useEffect } from 'react';
import axios from 'axios';
import NavBar from '../ui/NavBar';
import { RiChatDeleteFill, RiDeleteBack2Fill } from 'react-icons/ri';
// import { format } from 'date-fns';
function Announcement() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const profile = localStorage.getItem("profile");

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [links, setLinks] = useState('');
  // const [image, setImage] = useState(null);
  const [deliveredTo, setDeliveredTo] = useState('community');
  const [currentLinkTitle, setCurrentLinkTitle] = useState('');
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');
  const [showAnnouncement, setShowAnnouncement]  = useState(false); 
  const [announcement, setAnnouncement] = useState([]); 
  const role = localStorage.getItem("role");  



const fetchAllAnnouncement = async()=>{
  try{
    const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/author/${email}`);
    console.log("announcement",response.data.announcement)
    setAnnouncement(response.data.announcement)
  }
  catch(err){
    console.log("error",err)
  }
}

useEffect(()=>{
  fetchAllAnnouncement()
},[])


  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    const formData = new FormData();
    formData.append("user", username);
    formData.append("title", title);
    formData.append("message", message);
    formData.append('links', JSON.stringify(links));
    formData.append("deliveredTo", deliveredTo);
    formData.append("email", email);
    formData.append("profile", profile);

    try {
      const response = await axios.post(`https://node-blog-app-seven.vercel.app/blog/author/announcement/add`, 
         formData,
         {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        
      });

      
      if (response.status==201) {
        setTitle('');
        setMessage('');
        setLinks('');
        // setImage(null);
        setDeliveredTo('all');
        setShowAnnouncement(false);
        fetchAllAnnouncement();
      } else {
        alert("Failed to add announcement: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting announcement:", error);
    }
  };


  const deleteAnnouncement = async (id) => {
    try{
      const response = await axios.delete(`https://node-blog-app-seven.vercel.app/blog/author/announcements/${id}`);
      console.log("response",response)
      fetchAllAnnouncement();
    }
    catch(err){
      console.log("error",err)
    }
  }

  const reversedAnnouncements = Array.isArray(announcement) ? [...announcement].reverse() : [];

  console.log("user email",email) 
  return (
    <div className="min-h-screen relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">

      <NavBar/>
       <h2 className="md:text-4xl font-bold my-5 flex justify-between items-center text-xl w-11/12 md:w-1/2 mx-auto ">Announcements 
        {role!=='student' && !showAnnouncement?
        <span onClick={()=> setShowAnnouncement(true)} className='text-xs cursor-pointer hover:bg-gray-700 bg-gray-800  text-white font-semibold rounded-md p-2'>
          Add 
         </span>
         :
         <span onClick={()=> setShowAnnouncement(false)} className={`${role!=='student'?'text-xs cursor-pointer hover:bg-gray-700 bg-gray-800 text-white font-semibold rounded-md p-2':'hidden'}`}>
          back 
         </span>
         }
      </h2>
   
      {/* <h2 className="text-xl font-bold mb-4">Add Announcement</h2> */}
      <form onSubmit={handleSubmit} className={`${showAnnouncement?'space-y-4  p-4 md:w-1/2 mx-auto w-11/12  rounded-lg ':"hidden"}`}>
        <div>
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-600 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-600 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Links</label>
          <div className="flex space-x-2 mt-1">
                <input
                  type="text"
                  value={currentLinkTitle}
                  onChange={(e) => setCurrentLinkTitle(e.target.value)}
                  placeholder="Link Title"
                  className="w-1/2 px-3 py-2 bg-gray-800 border focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-600 rounded-md"
                />
                <input
                  type="url"
                  value={currentLinkUrl}
                  onChange={(e) => setCurrentLinkUrl(e.target.value)}
                  placeholder="Link URL"
                  className="w-1/2 px-3 py-2 bg-gray-800 border focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-600 rounded-md"
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
                  className="md:py-2 px-2 py-1 md:px-4 md:text-base text-sm  hover:bg-gray-500 bg-white text-gray-800 font-bold rounded-md transition duration-200"
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
  
        <div>
          <label className="block text-sm font-medium text-gray-300">Delivered To</label>
          <select
            value={deliveredTo}
            onChange={e => setDeliveredTo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="community">community</option>
            <option value="coordinators">Coordinators</option>
            <option value="all">All</option>

          </select>
        </div>
        <button type="submit" className="font-semibold hover:bg-gray-500 bg-white text-gray-800 transition-all duration-200 md:px-4 px-2 py-1 md:text-base text-sm md:py-2 rounded ">
          Submit Announcement
        </button>
      </form>

      {announcement.length === 0 ? (
        <p className={`${showAnnouncement?'hidden':'text-center text-gray-500'}`}>No announcements available.</p>
      ) : (
        <div className={`${showAnnouncement?'hidden':'space-y-4 md:w-1/2 w-11/12 min-h-screen mx-auto'}`}>
          {reversedAnnouncements
          .map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg text-black font-semibold">{announcement.title}</h3>
                <span
                onClick={()=>deleteAnnouncement(announcement._id)}  
                 className="text-sm text-red-400 cursor-pointer">
                 <RiDeleteBack2Fill />
                </span>
              </div>
             
              <p className="text-gray-600 md:text-base font-semibold text-xs mb-2">{announcement.message}</p>

            
                {announcement.links && announcement.links.length > 0 && (
                  <div className="flex md:text-base text-[10px]  flex-wrap gap-2">
                    {announcement.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
            

              <div className="text-sm flex gap-2 items-center mt-2 text-gray-600">
                <div>
                  <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${announcement.profile}`} alt="" className='md:w-9 md:h-9 w-7 h-7 rounded-full object-center' />
                </div>
                <span className='font-semibold'> {announcement.user}</span> {' '} 
                {/* <span>To: {announcement.deliveredTo}</span> */}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Announcement;
