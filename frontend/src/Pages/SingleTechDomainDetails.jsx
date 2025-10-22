import React, { useState, useEffect } from "react";
import NavBar from "../ui/NavBar";
import blog1 from "../images/blog1.jpg";
import { AiOutlineMail } from "react-icons/ai";
import { GrLinkedin } from "react-icons/gr";
import Footer from "../ui/Footer";
import user from "../images/user.png";
import axiosInstance from "../instances/Axiosinstances";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { PiLinkSimpleFill } from "react-icons/pi";
import { BsPersonSquare } from "react-icons/bs";
import { useParams } from "react-router-dom";

function SingleTechDomainDetails() {

const {category} = useParams();
 const decodedCategory = decodeURIComponent(category);
  const [authors, setAuthors] = useState([]);
  const email = localStorage.getItem("email");


  const authorsDetails = async () => {
    try {
      const response = await axiosInstance.get(`/blog/author/getAuthorsByDomain/${decodedCategory}`);
      // const response = await axiosInstance.get('http://127.0.0.1:3000/blog/author/profiles/');
    //   setAuthors(response.data.filteredAuthors.filter((author) => author.email !== email));
      setAuthors(response.data.filteredAuthors);
      // setAuthors(response.data);
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    authorsDetails();
  }, []);




  const addFollower = async (userEmail) => {
    console.log("useremail", userEmail);
    try {
      const response = await axiosInstance.put(
        `/blog/author/follow/${userEmail}`,
        { emailAuthor: email }
      );
      if(response.status===200){
        console.log(response.data);
      authorsDetails();
      }
    } catch (err) {
      console.log("error", err);
    }
  };



  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 h-auto reltive  ">
      <NavBar />

       <h1 className="md:text-left text-center w-11/12 mx-auto text-3xl md:text-5xl font-extrabold mt-12 mb-8 bg-gradient-to-r from-blue-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
          {decodedCategory} - Community
        </h1>


      <div className="w-11/12 mx-auto min-h-screen flex flex-col items-center mt-12 text-white">
        {/* Coordinators Section */}
        {authors.filter((author) => author.role === "coordinator").length >
          0 && (
          // <h2 className="text-center text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
          <h2 className="text-center text-2xl md:text-4xl font-bold mb-6 text-white/90">
            Coordinators {`(${authors.filter((author) => author.role === "coordinator").length })`}
          </h2>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {authors
            .filter((author) => author.role === "coordinator")
            .map((author, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-5 flex flex-col items-center"
              >
                <Link to={`/viewProfile/${author.email}`}>
                  <img
                    src={
                      author.profile
                        ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`
                        : user
                    }
                    alt={author.authorName}
                    className="rounded-full bg-white w-24 h-24 object-cover border-2 border-white shadow-md hover:shadow-lg transition-all"
                  />
                </Link>

                <h1 className="text-center font-semibold mt-3 text-lg truncate w-full">
                  {author.authorName}
                </h1>
                <p className="text-center text-sm text-gray-300 truncate w-full">
                  {author.email}
                </p>

                {/* Communities */}
                {/* {author.community?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {author.community.map((com, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium backdrop-blur-md bg-white/10 text-white rounded-full shadow-sm border border-gray-400"
                      >
                        {com}
                      </span>
                    ))}
                  </div>
                )} */}

                {/* Social Links */}
                {author.profileLinks?.length > 0 && (
                  <div className="flex justify-center gap-3 mt-4">
                    {author.profileLinks.map((link, i) => (
                      <Link
                        key={i}
                        to={link.url}
                        title={link.title}
                        target="_blank"
                      >
                        {link.title === "LinkedIn" ? (
                          <FaLinkedin className="text-white text-lg hover:text-green-400 transition" />
                        ) : link.title === "GitHub" ? (
                          <FaSquareGithub className="text-white text-lg hover:text-green-400 transition" />
                        ) : link.title === "Portfolio" ? (
                          <BsPersonSquare className="text-white text-lg hover:text-green-400 transition" />
                        ) : (
                          <PiLinkSimpleFill className="text-white text-lg hover:text-green-400 transition" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Follow Button */}
                {author.email !== email ? 
                <div className="mt-4">
                  {author.followers.includes(email) ? (
                    <button
                      onClick={() => addFollower(author.email)}
                      className="px-4 py-1.5 rounded-lg cursor-pointer bg-gradient-to-r from-emerald-200 to-emerald-300 text-gray-800 font-medium text-sm cursor-default shadow-sm border border-white/20"
                    >
                      Following...
                    </button>
                  ) : (
                    <button
                      onClick={() => addFollower(author.email)}
                      className="px-4 py-1.5 rounded-lg cursor-pointer bg-gradient-to-r from-emerald-300 to-green-400 text-gray-900 font-medium text-sm hover:from-emerald-400 hover:to-green-500 transition-all duration-300 shadow-sm border border-white/20"
                    >
                      Follow +
                    </button>
                  )}
                </div>:
                    <div
                 
                      className="px-4 mt-4 py-1.5 font-medium rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500"
                    >
                      Coordinating
                    </div>
                }
              </div>
            ))}
        </div>

        {/* Students Section */}
        {authors.filter((author) => author.role === "student").length > 0 && (
          <h2 className="text-center mt-16 text-2xl md:text-4xl font-bold text-white/90">
            Students  {`(${authors.filter((author) => author.role === "student").length })`}
          </h2>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 mt-6">
          {authors
            .filter((author) => author.role === "student")
            .map((author, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-5 flex flex-col items-center"
              >
                <Link to={`/viewProfile/${author.email}`}>
                  <img
                    src={
                      author.profile
                        ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${author.profile}`
                        : user
                    }
                    alt={author.authorName}
                    className="rounded-full w-20 bg-white h-20 object-cover border-2 border-white shadow-md hover:shadow-lg transition-all"
                  />
                </Link>

                <h1 className="text-center font-semibold mt-3 text-sm md:text-base truncate w-full">
                  {author.authorName}
                </h1>
                <p className="text-center text-xs text-gray-300 truncate w-full">
                  {author.email}
                </p>

                {/* Social Links */}
                {author.profileLinks?.length > 0 && (
                  <div className="flex justify-center gap-3 mt-3">
                    {author.profileLinks.map((link, i) => (
                      <Link
                        key={i}
                        to={link.url}
                        title={link.title}
                        target="_blank"
                      >
                        {link.title === "LinkedIn" ? (
                          <FaLinkedin className="text-white text-base hover:text-green-400 transition" />
                        ) : link.title === "GitHub" ? (
                          <FaSquareGithub className="text-white text-base hover:text-green-400 transition" />
                        ) : link.title === "Portfolio" ? (
                          <BsPersonSquare className="text-white text-base hover:text-green-400 transition" />
                        ) : (
                          <PiLinkSimpleFill className="text-white text-base hover:text-green-400 transition" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SingleTechDomainDetails;
