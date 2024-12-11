import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../ui/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Footer from '../ui/Footer';
function AddPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');
  const[image,setImage] = useState(null) ;
  const email = localStorage.getItem('email'); // Get email from local storage
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const onImageChange = (e) =>{
  console.log(e.target.files[0]) ;
  setImage(e.target.files[0]) ;
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const formData = new FormData() ;
    formData.append("title",title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', image);

    setLoading(true)


    try {
      const response = await axios.post(`https://node-blog-app-seven.vercel.app/blog/posts/${email}`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }

    });
      // response.status===201 && window.location.reload();
    setTitle('');
    setDescription('');
    setCategory('');
    setImage(null);
    toast.success('post Edited successfully') ;
    navigate("/home"); // Redirect to the homepage

      console.log('Post added successfully:', response.data);
      // Optionally, you can reset the form or redirect the user
    } catch (error) {
      console.error('Error adding post:', error);
    }
    finally{
      setLoading(false);
    }
  
 
        
}


  return (
    <div className='w-full h-screen  '>
      <NavBar />

    <div className='min-h-screen    pt-10'>

      <h1 className='text-center font-semibold text-lg md:text-2xl mb-10'>+ Add a Post</h1>

      <form onSubmit={handleSubmit} className='flex flex-col  rounded-md items-center justify-center p-5 w-11/12 md:w-6/12 gap-5 m-auto  border-2 border-black'>
        <div className='w-11/12 mt-5'>
          <label htmlFor="title" className='text-md  font-semibold '>Title</label> <br />
          <input
            type="text"
            id="title"
            className='w-full p-3 mt-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#6D214F]'
            placeholder='Enter title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='w-11/12 mt-5'>
          <label htmlFor="description" className='text-md  font-semibold '>Description</label> <br />
          <textarea
            id="description"
            className='w-full p-3 mt-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D214F]'
            placeholder='Enter description'
            value={description}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className='w-11/12 mt-5'>
          <label htmlFor="description" className='text-md  font-semibold '>Upload Post</label> <br />
          <input type="file" accept='image/*' name='image' onChange={onImageChange} />
        </div> 

        <div className='w-11/12 mt-5'>
          <label htmlFor="category" className='text-md  font-semibold'>Category</label> <br />
          <select
            id="category"
            className='w-full p-3 mt-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D214F]'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Education">Education</option>
            <option value="Food">Food</option>
            <option value="Technology">Technology</option>
            <option value="Job">Job</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Intrenship">Intrenship</option>
            <option value="Exam">Exam</option>
          </select>
        </div>
        <button
              type="submit"
              className="px-3 py-1 bg-[#192a56] hover:bg-[#273c75] transition-all text-sm md:text-base duration-800 text-[#f7f1e3] rounded-md"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'ADD POST'}
            </button>
      </form>
      <ToastContainer />

    </div>

    <div className="  w-full">
      <Footer/>

      </div>
    </div>
  );
}

export default AddPost;
