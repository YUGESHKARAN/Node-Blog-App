import React,{useState,useEffect} from 'react'
import NavBar from '../ui/NavBar';
import blog1 from "../images/blog1.jpg";
import { AiOutlineMail } from 'react-icons/ai';
import { GrLinkedin } from 'react-icons/gr';
import Footer from '../ui/Footer';
import user from "../images/user.png";
import axiosInstance from '../instances/Axiosinstances';

function Authors() {
    const [authors,setAuthors] = useState([])
    const email = localStorage.getItem('email');
    const [follow,setFollow] = useState(false);
    const [recommendation,setRecommendation] = useState([]) ; 
    const authorsDetails = async() => {
        try{
            const response = await axiosInstance.get('/blog/author/profiles/');
            // const response = await axiosInstance.get('http://127.0.0.1:3000/blog/author/profiles/');
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

const recommendtion_system  = async() =>{
  try{
    const response = await axiosInstance.post('https://recommendation-system-omega.vercel.app/recommended', {email} )

    // console.log("recommedation data",response.data)
    setRecommendation(response.data.remonneded_people)
  }
  catch(err)
  {
    console.log("error",err)
  }
}

useEffect(()=>{
  recommendtion_system();
},[recommendation])
// console.log(recommendation)
// const count = authors
//   .map(author => author.followers) // Extract the followers arrays
//   .flat() // Flatten the array of arrays into a single array
//   .filter(follower => follower === email) // Filter for 'neoteric@gmail.com'
//   .length; // Get the length of the filtered array

  // console.log('following count',count)
const addFollower = async(userEmail) =>{
  console.log('useremail',userEmail)
  try{
    const response = await axiosInstance.put(`/blog/author/follow/${userEmail}`,
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

const recommendaedAutors = authors.filter((author)=>recommendation.includes(author.email)).filter(author => author.role === "coordinator"); 

console.log("authors",authors);
console.log("recommendaedAutors",recommendaedAutors);

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 h-auto reltive  '>
        <NavBar/>

        { recommendaedAutors.length>0 && 
        <div className='w-11/12  h-auto mx-auto flex-col  items-center justify-center mt-10'>
            <h2 className='w-full  text-left text-sm text-green-400 md:text-3xl font-semibold'>Recommended</h2>
            <div
              className={`flex justify-start w-full items-center gap-2 overflow-x-auto scrollbar-hide mt-3`}
            >
               {
                 recommendaedAutors.map((author,index)=>(
                  
                  <div
                  key={index}
                  className="md:h-24 h-24 p-4 w-fit px-4 gap-1 md:w-fit items-start   flex justify-start items-center rounded-lg shadow-lg bg-[#fff]/20">
                  <div className='w-fit  flex-col items-start justify-start md:w-1/3  '>
                      {
                          author.profile?
                      <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`} className='rounded-full w-10 h-10 mx-auto object-cover' alt="" />
                      :
                      <img src={user} className='rounded-full w-10 h-10 bg-white border-2 border-black mx-auto object-cover' />
                      }

                     <div className='flex items-center justify-center mt-2'>         
                        {
                        author.followers.includes(email)?
                        <button
                        onClick={()=>{addFollower(author.email)}}
                         className='w-fit mx-auto px-4 py-0.5  rounded-lg shadow-lg bg-gray-200 text-[#000]'>Following...</button>
                        :
                        <button
                        onClick={()=>{addFollower(author.email)}}
                         className='w-fit mx-auto px-4 py-0.5 rounded-lg text-xs text-nowrap bg-gray-800 text-white'>Follow +</button>
                        }
                      </div>
                  </div>
                     <div className=' md:w-2/3 w-3/5   flex-col items-start justify-start'>
                       <h1 className='text-center font-semibold text-white text-wrap w-full scrollbar-hide overflow-x-auto md:text-base'> {author.authorName}</h1>
                       <h1 className='text-center  mt-0.5 text-[9px] text-white md:text-xs'> {author.email}</h1>
                       <div className='flex mx-auto items-center justify-between mt-0.5 gap-5 px-5'>
                         <span className='text-center text-green-400 text-[10px] mt-0.5 font-semibold'>Followers <p className='text-white'>{author.followers.length}</p></span>
                         {/* <span className='text-center text-[10px] mt-0.5 font-bold'>
                           <p className='font-bold'>{author.followingCount}</p></span> */}
                         <span className='text-center text-green-400  text-[10px] mt-0.5 font-semibold'>Posts <p className='text-white'>{author.postCount}</p></span>
                       </div>                      
                     </div>

                  </div>
                    ))
                }
          </div>
        </div>
        }

        <div className='w-11/12 min-h-screen h-auto mx-auto flex-col  items-center justify-center mt-10'>
            <h2 className='w-full text-white text-center text-sm md:text-3xl font-semibold'>Authors Profile</h2>
            <div
              className={`grid place-items-center gap-4 mt-7 md:mt-20 grid-cols-2 lg:grid-cols-4`}
            >
                {
                 authors
                 .filter(author => author.role === "coordinator")
                 .map((author,index)=>(
                  <div
                  key={index}
                  className="md:h-64 h-64 w-40 md:w-9/12 pt-5 flex-col items-center rounded-lg shadow-lg bg-[#fff]/20">
                    {
                        author.profile?
                     <img src={`https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`} className='rounded-full w-20 h-20 mx-auto object-cover' alt="" />
                     :
                     <img src={user} className='rounded-full w-20 h-20 bg-white border-2 border-black mx-auto object-cover' />

                     }
                     <div className='md:w-11/12 md:w-2/3 mx-auto flex-col items-center justify-center'>
                       <h1 className='text-center font-semibold text-white text-wrap w-full scrollbar-hide overflow-x-auto mt-2 md:text-base'> {author.authorName}</h1>
                       <h1 className='text-center  mt-1 text-[9px] text-white md:text-xs'> {author.email}</h1>
                       <div className='flex mx-auto items-center justify-between mt-1 gap-5 px-5'>
                         <span className='text-center text-yellow-500 text-xs mt-2 font-semibold'>Followers <p className='text-white'>{author.followers.length}</p></span>
                         {/* <span className='text-center text-xs mt-2 font-bold'>
                           <p className='font-bold'>{author.following?author.following.lenght:0}</p></span> */}
                         <span className='text-center text-yellow-500  text-xs mt-2 font-semibold'>Posts <p className='text-white'>{author.postCount}</p></span>
                       </div>

                       <div className='flex items-center justify-center mt-2'>         
                        {
                        author.followers.includes(email)?
                        <button
                        onClick={()=>{addFollower(author.email)}}
                         className='w-fit mx-auto px-4 py-0.5  rounded-lg shadow-lg bg-gray-200 text-[#000]'>Following...</button>
                        :
                        <button
                        onClick={()=>{addFollower(author.email)}}
                         className='w-fit mx-auto px-4 py-0.5 rounded-lg  bg-gray-800 text-white'>Follow +</button>
                        }
                       </div>
                      
                     </div>

                  </div>
                    ))
                }
                

            </div>
        </div>
        
       
<Footer/>
    </div>
  )
}

export default Authors