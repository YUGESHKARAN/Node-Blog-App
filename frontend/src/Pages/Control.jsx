import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../ui/NavBar';
import { MdDeleteForever } from 'react-icons/md';
import Footer from '../ui/Footer';
import { IoSearch } from "react-icons/io5";

function Control() {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatedRoles, setUpdatedRoles] = useState({});
  const [assignedCommunities, setAssignedCommunities] = useState({});
  const [posts, setPosts] = useState([]);
  const email = localStorage.getItem('email');
  const getAuthors = async () => {
    try {
      const response = await axios.get('https://node-blog-app-seven.vercel.app/blog/author');
      setAuthors(response.data);
      setFilteredAuthors(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAuthors();
  }, []);

  useEffect(() => {
    filterAndSearch();
  }, [searchQuery, roleFilter, authors]);

  const handleRoleChange = (id, newRole) => {
    setUpdatedRoles((prev) => ({ ...prev, [id]: newRole }));
  };

  const updateRole = async (email, id) => {
    const roleToUpdate = updatedRoles[id];
    if (!roleToUpdate) {
      alert('Please select a role before updating.');
      return;
    }

    try {
      const response = await axios.put(
        'https://node-blog-app-seven.vercel.app/blog/author/control/updateRole',
        { role: roleToUpdate, email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        alert('Role updated successfully');
        getAuthors();
      }
    } catch (err) {
      console.error(err);
    }
  };
const filterAndSearch = () => {
  let filtered = authors;

  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (author) =>
        (author.name?.toLowerCase().includes(query) || '') ||
        (author.email?.toLowerCase().includes(query) || '')
    );
  }

  if (roleFilter !== '') {
    filtered = filtered.filter((author) => author.role === roleFilter);
  }

  setFilteredAuthors(filtered);
};

const deleteAuthor = async (email) => {
    const confirm = window.confirm('Are you sure want to delete your account');
    if (!confirm) return;
  const secretKey = prompt('Enter your secret key to confirm deletion:');
  if (secretKey?.trim() !== 'admin') {
    alert('Incorrect secret key. Deletion cancelled.');
    return;
  }

    try {
      const response = await axios.delete(
        `https://node-blog-app-seven.vercel.app/blog/author/${email}`
      );
    //   toast.success("Account deleted successfully");
     getAuthors();
    } catch (err) {
      console.log(err);
    }
  };


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
     }, []);

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


  const handleCommunityCheckbox = (email, communityName) => {
  setAssignedCommunities(prev => {
    const current = prev[email] || [];
    const isChecked = current.includes(communityName);
    return {
      ...prev,
      [email]: isChecked
        ? current.filter(c => c !== communityName)
        : [...current, communityName]
    };
  });
};


const updateAssignedCommunities = async (email) => {
  console.log("updateAssignedCommunities email", email);
  const selectedCommunities = assignedCommunities[email] || [];
  console.log("selected commu",selectedCommunities)
  try {
   const  response  =  await axios.put(`https://node-blog-app-seven.vercel.app/blog/author/control/coordinatorUpdate`, {
      techCommunities: selectedCommunities,
      email:email
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },  
    }
  );

  console.log(response.data)

  if(response.status === 201 ){
    alert("Communities updated successfully");
  }
  } catch (err) {
    console.error("Error updating communities", err);
  }
};


useEffect(() => {
  if (Array.isArray(authors)) {
    setAssignedCommunities((prev) => {
      const newAssignments = { ...prev };
      authors.forEach((author) => {
        if (author?.email && author?.community && !newAssignments[author.email]) {
          newAssignments[author.email] = [...author.community];
        }
      });
      return newAssignments;
    });
  }
}, [authors]);



// console.group("filteredAuthors",filteredAuthors)

// console.log("authorCommusnity",authorCommunity)
  return (
    <div className='relative w-full min-h-screen h-auto  bg-gradient-to-br from-gray-900 to-gray-700'>
      <NavBar />
      <h1 className='md:text-4xl font-bold my-5 text-white text-center text-xl w-11/12 mx-auto'>
        Blog Control Panel
      </h1>

      {/* Search and Filter */}
      <div className='w-11/12 mx-auto flex  md:flex-row justify-between items-center gap-4 mb-6'>

        <div className='md:w-1/3 w-3/5 px-4 py-2 flex items-center gap-2 justify-center rounded-xl bg-gray-600  text-xs md:text-base text-white placeholder-gray-400'>
          <IoSearch className='text-white'/>
          <input
            type='text'
            placeholder='Search by name or email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full bg-gray-600   focus:outline-none focus:ring-0'
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className=' md:w-1/4 w-1/5 md:px-4 md:py-2 px-2 py-1 rounded bg-gray-600 text-xs md:text-base text-white'
        >
          <option value=''>All Roles</option>
          <option value='student'>Student</option>
          <option value='coordinator'>Coordinator</option>
          <option value='admin'>Admin</option>
        </select>
      </div>

     <h1 className={`${roleFilter==='admin' || roleFilter=== ''?'text-center text-base md:text-3xl mb-6 font-bold  text-white':'hidden'}`}>Admins</h1>
      {/* Author admin */}
      <div className={`${roleFilter===''?'h-auto md:mb-16 mb-10   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-2':roleFilter==='admin'?'min-h-screen md:mb-16 mb-10   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-2':'hidden'}`}>
       {[
  // First, filter authors based on their roles
          ...filteredAuthors.filter((author) => author.role === 'admin'),
        ].map((author) => (
          <div key={author._id} className='bg-gray-900 w-11/12 mx-auto md:w-full h-fit p-4 flex flex-col justify-between rounded-lg shadow-md'>
            <h2 className='flex justify-between items-center text-xl font-semibold text-white'>
              {author.authorname}
              <span
                onClick={() => deleteAuthor(author.email)}   
                className='text-red-400 cursor-pointer'> 
                <MdDeleteForever />
              </span>
            </h2>
            <p className='text-gray-400 text-xs md:text-base mt-2'>{author.email}</p>

            <div className='md:flex justify-start md:space-x-4 items-center'>
              <p className='text-gray-400 text-xs md:text-base mt-2'>Role: {author.role}</p>
              <p className={`${author.role === 'student' ? 'hidden' : 'text-gray-400 text-xs md:text-base mt-2'}`}>
                Followers: {author.followers.length}
              </p>
              <p className={`${author.role === 'student' ? 'hidden' : 'text-gray-400 text-xs md:text-base mt-2'}`}>
                Posts: {author.posts.length}
              </p>
            </div>

            <div className='flex items-center mt-4'>
              <select
                className='mt-2 p-2  text-xs md:text-base mr-4 rounded bg-gray-800 text-white'
                value={updatedRoles[author._id] || author.role}
                onChange={(e) => handleRoleChange(author._id, e.target.value)}
              >
                <option value='student'>Student</option>
                <option value='coordinator'>Coordinator</option>
                <option value='admin'>Admin</option>
              </select>

              <button
                className='mt-2 md:px-4 px-2  text-xs md:text-base py-1 font-semibold hover:bg-gray-500 bg-white text-gray-800 transition-all duration-200 rounded'
                onClick={() => updateRole(author.email, author._id)}
              >
                Update Role
              </button>
            </div>

            {author.role === 'coordinator' && (
              <div className="mt-4 text-white">
                <p className="mb-1 text-sm font-semibold">Assign Tech Communities:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {communities.map((community, idx) => (
                    <label key={idx} className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={
                          assignedCommunities[author.email]?.includes(community.communityName) || false
                        }
                        onChange={() =>
                          handleCommunityCheckbox(author.email, community.communityName)
                        }
                        className="form-checkbox accent-green-500"
                      />
                      <span>{community.communityName}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => updateAssignedCommunities(author.email)}
                  className="mt-2 text-xs md:text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Save Communities
                </button>
              </div>
            )}
          </div>
        ))}

      </div>

       <h1 className={`${roleFilter==='coordinator' ||roleFilter=== ''?'text-center text-base md:text-3xl mb-6 font-bold  text-white':'hidden'}`}>Coordinators</h1>
      {/* Author Coordinators */}
      <div className={`${roleFilter===''?'h-auto md:mb-16 mb-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-2':roleFilter==='coordinator'?'min-h-screen h-auto md:mb-16 mb-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-2':'hidden'}`}>
       {[
  // First, filter authors based on their roles
          ...filteredAuthors.filter((author) => author.role === 'coordinator'),
        ].map((author) => (
          <div key={author._id} className='bg-gray-900 w-11/12 mx-auto md:w-full h-fit p-4 flex flex-col justify-between rounded-lg shadow-md'>
            <h2 className='flex justify-between items-center text-xl font-semibold text-white'>
              {author.authorname}
              <span
                onClick={() => deleteAuthor(author.email)}   
                className='text-red-400 cursor-pointer'> 
                <MdDeleteForever />
              </span>
            </h2>
            <p className='text-gray-400 text-xs md:text-base mt-2'>{author.email}</p>

            <div className='md:flex justify-start md:space-x-4 items-center'>
              <p className='text-gray-400 text-xs md:text-base mt-2'>Role: {author.role}</p>
              <p className={`${author.role === 'student' ? 'hidden' : 'text-gray-400 text-xs md:text-base mt-2'}`}>
                Followers: {author.followers.length}
              </p>
              <p className={`${author.role === 'student' ? 'hidden' : 'text-gray-400 text-xs md:text-base mt-2'}`}>
                Posts: {author.posts.length}
              </p>
            </div>

            <div className='flex items-center mt-4'>
              <select
                className='mt-2 p-2  text-xs md:text-base mr-4 rounded bg-gray-800 text-white'
                value={updatedRoles[author._id] || author.role}
                onChange={(e) => handleRoleChange(author._id, e.target.value)}
              >
                <option value='student'>Student</option>
                <option value='coordinator'>Coordinator</option>
                <option value='admin'>Admin</option>
              </select>

              <button
                className='mt-2 md:px-4 px-2  text-xs md:text-base py-1 font-semibold hover:bg-gray-500 bg-white text-gray-800 transition-all duration-200 rounded'
                onClick={() => updateRole(author.email, author._id)}
              >
                Update Role
              </button>
            </div>

            {author.role === 'coordinator' && (
              <div className="mt-4 text-white">
                <p className="mb-1 text-sm font-semibold">Assign Tech Communities:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {communities.map((community, idx) => (
                    <label key={idx} className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={
                          assignedCommunities[author.email]?.includes(community.communityName) || false
                        }
                        onChange={() =>
                          handleCommunityCheckbox(author.email, community.communityName)
                        }
                        className="form-checkbox accent-green-500"
                      />
                      <span>{community.communityName}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => updateAssignedCommunities(author.email)}
                  className="mt-2 text-xs md:text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Save Communities
                </button>
              </div>
            )}
          </div>
        ))}

      </div>

       <h1 className={`${roleFilter==='student' ||roleFilter=== ''?'text-center text-base md:text-3xl mb-6 font-bold  text-white':'hidden'}`}>Students</h1>
      {/* Author students */}
      <div className={`${roleFilter===''?'h-auto md:mb-16 mb-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-2':roleFilter==='student'?' min-h-screen h-auto md:mb-16 mb-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-11/12 mx-auto mt-2':'hidden'}`}>
       {[
  // First, filter authors based on their roles
          ...filteredAuthors.filter((author) => author.role === 'student'),
        ].map((author) => (
          <div key={author._id} className='bg-gray-900 w-11/12 mx-auto md:w-full h-fit p-4 flex flex-col justify-between rounded-lg shadow-md'>
            <h2 className='flex justify-between items-center text-xl font-semibold text-white'>
              {author.authorname}
              <span
                onClick={() => deleteAuthor(author.email)}   
                className='text-red-400 cursor-pointer'> 
                <MdDeleteForever />
              </span>
            </h2>
            <p className='text-gray-400 text-xs md:text-base mt-2'>{author.email}</p>


            <div className='flex items-center mt-4'>
              <select
                className='mt-2 p-2  text-xs md:text-base mr-4 rounded bg-gray-800 text-white'
                value={updatedRoles[author._id] || author.role}
                onChange={(e) => handleRoleChange(author._id, e.target.value)}
              >
                <option value='student'>Student</option>
                <option value='coordinator'>Coordinator</option>
              </select>

              <button
                className='mt-2 md:px-4 px-2  text-xs md:text-base py-1 font-semibold hover:bg-gray-500 bg-white text-gray-800 transition-all duration-200 rounded'
                onClick={() => updateRole(author.email, author._id)}
              >
                Update Role
              </button>
            </div>

  
          </div>
        ))}

      </div>
    
       <Footer/>
    </div>
  );
}

export default Control;
