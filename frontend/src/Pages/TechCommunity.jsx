import React,{useState, useEffect} from 'react'
import NavBar from '../ui/NavBar'
import axios from 'axios'   
import Footer from '../ui/Footer';
function TechCommunity() {

 const [posts, setPosts] = useState([]); 

 const username = localStorage.getItem("username");
 const email = localStorage.getItem("email");
 const role = localStorage.getItem("role");
 const [authorCommunity, setAuthorCommunity] = useState([]);
 const [authors, setAuthors] = useState([]);
//  const [communities, setCommunities] = useState([]);

 const getAuthorCommunity = async () => {
    try{
        const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/author/${email}`);
        setAuthorCommunity(response.data.community);
    }
    catch(err)
    {
        console.log("error",err)    
     }
    }
  // Fetch posts from API
 const getPosts = async () => {
   
    try {
      const response = await axios.get("https://node-blog-app-seven.vercel.app/blog/posts");
      setPosts(response.data.posts);
    } 
    catch (err) {
      console.error("Error fetching posts:", err);
    }
  
  };


  const getAuthors = async () => {
   
    try {
      const response = await axios.get("https://node-blog-app-seven.vercel.app/blog/author");
      setAuthors(response.data);
    } 
    catch (err) {
      console.error("Error fetching posts:", err);
    }
  
  };
    useEffect(() => {
            getPosts();
            getAuthorCommunity();
            getAuthors(); 
     }, []);




      // Get unique categories
  const getUniqueCategories = (posts) => {
    return [...new Set(posts.map((post) => post.category))];
  };
  const categories = getUniqueCategories(posts);



    //  get Tech community array
function getCategoryStats(authors, categoryname) {
  let followerscount = 0;
  let authorcount = 0;
  let postscount = 0;

  authors.forEach(author => {
    if (author.community.includes(categoryname)) {
      if (author.role === 'student') {
        followerscount++;
      } else if (author.role === 'coordinator') {
        authorcount++;
      }
    }
      const matchingPosts = author.posts?.filter(
        (post) => post.category === categoryname
      ) || [];

      postscount += matchingPosts.length;
  });

  return {
    categoryname,
    followerscount,
    authorcount,
    postscount
  };
}


// const communities = getCategoryStats(authors, categories);
const communities = categories.map((category) => getCategoryStats(authors, category));





const updateCommunity = async(email,techCommunity)=>{
    try{
         const response = await axios.put("https://node-blog-app-seven.vercel.app/blog/author/control/updateCommunity",
         {
            email:email,
            techcommunity:techCommunity
         },
         {
          headers: {
             'Content-Type': 'application/json',
          },
        
      }
        );
        if (response.status === 201) {
        await  getPosts();
        await  getAuthorCommunity();
        window.location.reload();
       }

      
    }
    catch(err)
    {
        console.log("error",err)
    }
}

// useEffect(()=>{
//     const categories = getUniqueCategories(posts);
//     const comm = categories.map((category) => getCategoryStats(authors, category));
//     setCommunities(comm);
// },[authorCommunity])


console.log("authorCommunity",authorCommunity)  
// console.log("communities",communities)  ;
console.log("authors",authors)  ;
console.log("categories",categories)  ;
console.log("role",role)  ;


  return (
   <div className="min-h-screen relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">

      <NavBar/>

      <div className='min-h-screen'>
        <h1 className="text-xl md:text-3xl font-bold text-center mt-10">Tech Communities</h1>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {communities.map((item, index) => (
        <div
        key={index}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg flex  justify-between hover:shadow-xl transition-shadow duration-300"
        >
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{item.categoryname}</h2>
            <ul className="text-gray-300 space-y-1 text-sm">
            <li>
                <span className="text-xs md:text-sm font-medium text-white">Authors:</span> {item.authorcount}
            </li>
            <li>
                <span className="text-xs md:text-sm font-medium text-white">Posts:</span> {item.postscount}
            </li>
            <li>
                <span className="text-xs md:text-sm font-medium text-white">Followers:</span> {item.followerscount}
            </li>
            </ul>
        </div>
      
        
      {role ==='coordinator' || role ==='admin'?
       <button
        
        type="button"
        // disable if already joined
        className={`${authorCommunity.includes(item.categoryname)?'mt-6 self-start text-sm md:text-base font-semibold transition-colors duration-200 px-4 py-2 rounded-lg bg-orange-600 text-white cursor-pointer ':'hidden'}`}>
        {authorCommunity.includes(item.categoryname) && 'Coordinator' }
        </button>:
        
            <button
            onClick={() => updateCommunity(email, item.categoryname)}
            type="button"
            // disabled={authorCommunity.includes(item.categoryname)} // disable if already joined
            className={`mt-6 self-start text-sm md:text-base font-semibold transition-colors duration-200 px-4 py-2 rounded-lg 
                ${authorCommunity.includes(item.categoryname) 
                ? 'bg-green-600 text-white cursor-pointer' 
                : 'bg-white text-gray-800 hover:bg-gray-500'} `}
            >
            {authorCommunity.includes(item.categoryname) ? 'Joined' : 'Join'}
            </button>
        }
      
        </div>
    ))}
    </div>

      </div>

        <Footer/>

    </div>
  )
}

export default TechCommunity
