import React,{useState,useEffect} from 'react'
import axios from 'axios'
import NavBar from '../ui/NavBar';
import blog1 from "../images/blog1.jpg";
import { AiOutlineMail } from 'react-icons/ai';
import { GrLinkedin } from 'react-icons/gr';
function Authors() {
    const [authors,setAuthors] = useState([])
    const email = localStorage.getItem('email');
    const [follow,setFollow] = useState(false)
    const authorsDetails = async() => {
        try{
            const response = await axios.get('http://localhost:3000/blog/author/profiles/');
            setAuthors(response.data.filter((author)=>author.email!==email))
        }
        catch(err)
        {
            console.error('error',err);
        }
    }

useEffect(()=>{

    authorsDetails();

},[]);

// const count = authors
//   .map(author => author.followers) // Extract the followers arrays
//   .flat() // Flatten the array of arrays into a single array
//   .filter(follower => follower === email) // Filter for 'neoteric@gmail.com'
//   .length; // Get the length of the filtered array

  // console.log('following count',count)
const addFollower = async(userEmail) =>{
  console.log('useremail',userEmail)
  try{
    const response = await axios.put(`http://localhost:3000/blog/author/follow/${userEmail}`,
      {emailAuthor:email}
    )
    console.log(response.data)
    authorsDetails()
  }
  catch(err)
  {
    console.error('error',err)
  }
}

console.log("authors",authors);

  return (
    <div className='w-full min-h-screen bg-gray-500 h-auto reltive  '>
        <NavBar/>
        <div className='w-11/12 mx-auto flex-col  items-center justify-center mt-10'>
            <h2 className='w-full text-center text-xl md:text-3xl text-white font-semibold'>Authors Profile</h2>
            <div
              className={`grid place-items-center gap-4 mt-7 md:mt-20 md:grid-cols-2 lg:grid-cols-4`}
            >
                {
                 authors.map((author,index)=>(
                  <div
                  key={index}
                   className='h-64 w-9/12 pt-5 flex-col items-center  rounded-lg border-2 border-black  bg-white'>
                    {
                        author.profile?
                     <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`} className='rounded-full w-20 h-20 mx-auto object-cover' alt="" />
                     :
                     <img src={blog1} className='rounded-full w-20 h-20 mx-auto object-cover' />

                     }
                     <div className='md:w-11/12 w-2/3 mx-auto flex-col items-center justify-center'>
                       <h1 className='text-center font-semibold mt-2 md:text-base'> {author.authorName}</h1>
                       <h1 className='text-center  mt-1 text-xs'> {author.email}</h1>
                       <div className='flex mx-auto items-center justify-between mt-1 gap-5 px-5'>
                         <span className='text-center text-xs mt-2 font-bold'>Followers <p className='font-bold'>{author.followers.length}</p></span>
                         {/* <span className='text-center text-xs mt-2 font-bold'>
                           <p className='font-bold'>{author.followingCount}</p></span> */}
                         <span className='text-center text-xs mt-2 font-bold'>Posts <p className='font-bold'>{author.postCount}</p></span>
                       </div>

                       <div className='flex items-center justify-center mt-2'>         
                        {
                        author.followers.includes(email)?
                        <button
                        onClick={()=>{addFollower(author.email)}}
                         className='w-fit mx-auto px-4 py-0.5  rounded-lg border bg-white border-[#130f40] text-[#130f40]'>Following...</button>
                        :
                        <button
                        onClick={()=>{addFollower(author.email)}}
                         className='w-fit mx-auto px-4 py-0.5 rounded-lg hover:bg-white hover:text-[#130f40] transition-all duration-200  border  border-[#130f40] bg-[#130f40] text-white'>Follow +</button>
                        }
                       </div>

                       {/* <div className='w-11/12 mx-auto mt-5 grid grid-cols-3 place-items-center w-full'>
                          <div className='col-span-1 cursor-pointer'><AiOutlineMail/></div>
                          <div className='col-span-1 cursor-pointer'><GrLinkedin/></div>
                          <div className='col-span-1 cursor-pointer'><AiOutlineMail/></div>
                       </div> */}

                      
                     </div>

                  </div>
                    ))
                }
                

            </div>
        </div>
        
       

    </div>
  )
}

export default Authors