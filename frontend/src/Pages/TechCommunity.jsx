import React,{useState, useEffect} from 'react'
import NavBar from '../ui/NavBar'
import axios from 'axios'   
function TechCommunity() {

 const [posts, setPosts] = useState([]); 

 const username = localStorage.getItem("username");
 const email = localStorage.getItem("email");
 const role = localStorage.getItem("role");
 const [authorCommunity, setAuthorCommunity] = useState([]);

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

    useEffect(() => {
            getPosts();
            getAuthorCommunity();
     }, []);


    //  get Tech community array
 function groupByCommunity(data) {
  const communityMap = {};

  data.forEach(item => {
    const category = item.category || "Uncategorized";
    const author = item.authoremail;

    if (!communityMap[category]) {
      communityMap[category] = {
        communityName: category,
        Authors: new Set(),
        Posts: 0
      };
    }

    communityMap[category].Authors.add(author);
    communityMap[category].Posts += 1;
  });

  // Convert to array and count unique authors
  const result = Object.values(communityMap).map(item => ({
    communityName: item.communityName,
    Authors: item.Authors.size,
    Posts: item.Posts
  }));

  return result;
}

const communities = groupByCommunity(posts);

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
        getPosts();
        getAuthorCommunity();
       }
    }
    catch(err)
    {
        console.log("error",err)
    }
}

console.log("authorCommunity",authorCommunity)  
console.log("communities",communities)  


  return (
   <div className="min-h-screen relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">

      <NavBar/>

      <div>
        <h1 className="text-xl md:text-3xl font-bold text-center mt-10">Tech Communities</h1>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {communities.map((item, index) => (
        <div
        key={index}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg flex  justify-between hover:shadow-xl transition-shadow duration-300"
        >
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{item.communityName}</h2>
            <ul className="text-gray-300 space-y-1 text-sm">
            <li>
                <span className="text-xs md:text-sm font-medium text-white">Authors:</span> {item.Authors}
            </li>
            <li>
                <span className="text-xs md:text-sm font-medium text-white">Posts:</span> {item.Posts}
            </li>
            <li>
                <span className="text-xs md:text-sm font-medium text-white">Followers:</span> {item.followers}
            </li>
            </ul>
        </div>
      
        
      {role ==='coordinator' || role ==='admin'?
       <button
        
        type="button"
        // disable if already joined
        className={`${authorCommunity.includes(item.communityName)?'mt-6 self-start text-sm md:text-base font-semibold transition-colors duration-200 px-4 py-2 rounded-lg bg-orange-600 text-white cursor-pointer ':'hidden'}`}>
        {authorCommunity.includes(item.communityName) && 'Coordinator' }
        </button>:
        
            <button
            onClick={() => updateCommunity(email, item.communityName)}
            type="button"
            // disabled={authorCommunity.includes(item.communityName)} // disable if already joined
            className={`mt-6 self-start text-sm md:text-base font-semibold transition-colors duration-200 px-4 py-2 rounded-lg 
                ${authorCommunity.includes(item.communityName) 
                ? 'bg-green-600 text-white cursor-pointer' 
                : 'bg-white text-gray-800 hover:bg-gray-500'} `}
            >
            {authorCommunity.includes(item.communityName) ? 'Joined' : 'Join'}
            </button>
        }
      
        </div>
    ))}
    </div>

      </div>

    </div>
  )
}

export default TechCommunity