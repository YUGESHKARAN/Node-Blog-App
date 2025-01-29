// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import NavBar from "../ui/NavBar";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Footer from "../ui/Footer";
// import { ReactTyped } from "react-typed";
// import Chatbot from "../images/chatbt.gif"
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
//   TypingIndicator,
// } from "@chatscope/chat-ui-kit-react";
// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// // import { use } from 'react';

// function AddPost() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("Education");
//   const [image, setImage] = useState(null);
//   const email = localStorage.getItem("email"); // Get email from local storage
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const onImageChange = (e) => {
//     console.log(e.target.files[0]);
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent the default form submission
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("image", image);

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `https://node-blog-app-seven.vercel.app/blog/posts/${email}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       // response.status===201 && window.location.reload();
//       setTitle("");
//       setDescription("");
//       setCategory("");
//       setImage(null);
//       toast.success("post Edited successfully");
//       navigate("/home"); // Redirect to the homepage

//       console.log("Post added successfully:", response.data);
//       // Optionally, you can reset the form or redirect the user
//     } catch (error) {
//       console.error("Error adding post:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Chatbot starts here

//   const [messages, setMessages] = useState([
//     {
//       message:
//         "Hello! Draft a context and I will help you to generate content.",
//       sender: "bot",
//       direction: "incoming",
//     },
//   ]);

//   const [isTyping, setIsTyping] = useState(false);
//   const [chatbot, setChatbot] = useState(false);

//   const backendEndpoint =
//     "https://blog-chat-backend.vercel.app/generate-content";

//   const handleSend = async (message) => {
//     const newMessage = {
//       message,
//       sender: "user",
//       direction: "outgoing",
//     };
//     setMessages((prev) => [...prev, newMessage]);

//     setIsTyping(true);

//     try {
//       const response = await axios.post(backendEndpoint, {
//         description: message,
//         // category: "job",
//       });

//       const botResponse = response.data.content || "No response received.";
//       typewriterEffect(botResponse, "bot");
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       const errorMessage = {
//         message: "An error occurred. Please try again later.",
//         sender: "bot",
//         direction: "incoming",
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const typewriterEffect = (text, sender) => {
//     const words = text.split(" ");
//     let currentMessage = "";
//     let wordIndex = 0;

//     const addWord = () => {
//       if (wordIndex < words.length) {
//         currentMessage += (wordIndex > 0 ? " " : "") + words[wordIndex];
//         const newMessage = {
//           message: currentMessage,
//           sender,
//           direction: "incoming",
//         };
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           if (
//             updatedMessages.length > 0 &&
//             updatedMessages[updatedMessages.length - 1].sender === sender
//           ) {
//             updatedMessages[updatedMessages.length - 1] = newMessage;
//           } else {
//             updatedMessages.push(newMessage);
//           }
//           return updatedMessages;
//         });
//         wordIndex++;
//         setTimeout(addWord, 200); // Adjust delay for smoother/faster typing
//       }
//     };

//     addWord();
//   };

//   useEffect(() => {
//     const incommingMessage = messages.filter(
//       (msg) => msg.direction === "incoming"
//     );
//     if (incommingMessage.length > 1) {
//       // setDescription(incommingMessage[incommingMessage.length - 1].message);
//       const lastMessage = incommingMessage[incommingMessage.length - 1].message;
//       // Parse the content if it's a valid JSON string

//       // Extract the Title and Description from the message
//       const titleMatch = lastMessage.match(/^Title:\s*(.*)$/m); // Match the title line
//       const descriptionStart = lastMessage.indexOf("\n\n") + 2; // Find where the description starts

//       if (titleMatch) {
//         setTitle(titleMatch[1].trim()); // Extract and set the title
//       }

//       if (descriptionStart > 1) {
//         setDescription(lastMessage.slice(descriptionStart).trim()); // Extract and set the description
//       }
//     }
//   }, [messages]);
//   console.log("messages", messages);

//   return (
//     <div className="w-full h-screen  ">
//       <NavBar />

//       <div className="min-h-screen  pt-10">
//         <h1 className="text-center font-semibold text-lg md:text-2xl mb-3">
//           + Add a Post
//         </h1>

//         <div className="md:w-96 px-4 mx-auto flex items-center mb-4 justify-center overflow-x-hidden">
//           <ReactTyped
//             strings={[
//               // "Looking for Assistant",
//               // "Save time on adding post",
//               // "Cook your blog with our Chatbot !!",
//               "Hello Author 🖐️🖐️🖐️",
//               "I am here to help you",
//               "Cook your blog with me !!",
//             ]}
//             typeSpeed={70}
//             backSpeed={30}
//             className="text-base basis-4/5 flex items-center justify-center  font-bold text-[#192a56]"
//             loop
//           />
//           <div className="basis-1/5 flex items-center justify-center">
           
//             <img 
//             onClick={() => setChatbot(!chatbot)}
//             src={Chatbot}
//              className="ml-2 rounded-full w-7 h-7 md:w-9 md:h-9" />
//           </div>
//         </div>

//         {!chatbot ? (
//           <form
//             onSubmit={handleSubmit}
//             className="flex  flex-col  rounded-md items-center justify-center p-5 w-11/12 md:w-6/12 gap-5 m-auto  border-2 border-black"
//           >
//             <div className="w-11/12 mt-5">
//               <label htmlFor="title" className="text-md  font-semibold ">
//                 Title
//               </label>{" "}
//               <br />
//               <input
//                 type="text"
//                 id="title"
//                 className="w-full p-3 mt-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#6D214F]"
//                 placeholder="Enter title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//             </div>
//             <div className="w-11/12 mt-5">
//               <label
//                 htmlFor="description"
//                 className="text-md basis-2/5 flex items-center font-semibold "
//               >
//                 Description{" "}
//               </label>{" "}
//               <br />
//               <textarea
//                 id="description"
//                 className="w-full p-3 mt-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D214F]"
//                 placeholder="Enter description"
//                 value={description}
//                 rows={5}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>

//             <div className="w-11/12 mt-5">
//               <label htmlFor="description" className="text-md  font-semibold ">
//                 Upload Post
//               </label>{" "}
//               <br />
//               <input
//                 type="file"
//                 accept="image/*"
//                 name="image"
//                 onChange={onImageChange}
//               />
//             </div>

//             <div className="w-11/12 mt-5">
//               <label htmlFor="category" className="text-md  font-semibold">
//                 Category
//               </label>{" "}
//               <br />
//               <select
//                 id="category"
//                 className="w-full p-3 mt-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D214F]"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <option value="Education">Education</option>
//                 <option value="Food">Food</option>
//                 <option value="Technology">Technology</option>
//                 <option value="Job">Job</option>
//                 <option value="Agriculture">Agriculture</option>
//                 <option value="Healthcare">Healthcare</option>
//                 <option value="Hospitality">Hospitality</option>
//                 <option value="Entertainment">Entertainment</option>
//                 <option value="Intrenship">Intrenship</option>
//                 <option value="Exam">Exam</option>
//               </select>
//             </div>
//             <button
//               type="submit"
//               className="px-3 py-1 bg-[#192a56] hover:bg-[#273c75] transition-all text-sm md:text-base duration-800 text-[#f7f1e3] rounded-md"
//               disabled={loading}
//             >
//               {loading ? "Submitting..." : "ADD POST"}
//             </button>
//           </form>
//         ) : (
//           <div className="md:w-9/12 p-3 h-96  rounded-lg md:p-10 mx-auto">
//             <MainContainer className="rounded-lg w-9/12 mx-auto text-xs  ">
//               <ChatContainer>
//                 <MessageList
//                   typingIndicator={
//                     isTyping && (
//                       <TypingIndicator content="Chatbot is typing..." />
//                     )
//                   }
//                 >
//                   {messages.map((msg, idx) => (
//                     <Message
//                       className="mb-4"
//                       key={idx}
//                       model={{
//                         message: msg.message,
//                         sentTime: "just now",
//                         sender: msg.sender,
//                         direction: msg.direction,
//                       }}
//                     />
//                   ))}
//                 </MessageList>
//                 <MessageInput
//                   placeholder="Type a message..."
//                   onSend={handleSend}
//                   // attachmentsButton={false} // Disable document uploader
//                   className="bg-red-100"
//                 />
//               </ChatContainer>
//             </MainContainer>
//           </div>
//         )}

//         <ToastContainer />
//       </div>

//       <div className="w-full">
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default AddPost;


import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../ui/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Footer from "../ui/Footer";
import Chatbot from "../images/chatbt.gif";
import { ReactTyped } from "react-typed";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Education");
  const [image, setImage] = useState(null);
  const email = localStorage.getItem("email"); // Get email from local storage
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      message: "Hello! Draft a context and I will help you to generate content.",
      sender: "bot",
      direction: "incoming",
    },
  ]);

  const [documents, setDocuments] = useState([]);

  const [isTyping, setIsTyping] = useState(false);
  const [chatbot, setChatbot] = useState(false);

  const backendEndpoint = "https://blog-chat-backend.vercel.app/generate-content";

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing",
    };
    setMessages((prev) => [...prev, newMessage]);

    setIsTyping(true);

    try {
      const response = await axios.post(backendEndpoint, {
        description: message,
      });

      const botResponse = response.data.content || "No response received.";
      typewriterEffect(botResponse, "bot");
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = {
        message: "An error occurred. Please try again later.",
        sender: "bot",
        direction: "incoming",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const typewriterEffect = (text, sender) => {
    const words = text.split(" ");
    let currentMessage = "";
    let wordIndex = 0;

    const addWord = () => {
      if (wordIndex < words.length) {
        currentMessage += (wordIndex > 0 ? " " : "") + words[wordIndex];
        const newMessage = {
          message: currentMessage,
          sender,
          direction: "incoming",
        };
        setMessages((prev) => {
          const updatedMessages = [...prev];
          if (
            updatedMessages.length > 0 &&
            updatedMessages[updatedMessages.length - 1].sender === sender
          ) {
            updatedMessages[updatedMessages.length - 1] = newMessage;
          } else {
            updatedMessages.push(newMessage);
          }
          return updatedMessages;
        });
        wordIndex++;
        setTimeout(addWord, 200); // Adjust delay for smoother/faster typing
      }
    };

    addWord();
  };

  useEffect(() => {
    const incommingMessage = messages.filter(
      (msg) => msg.direction === "incoming"
    );
    if (incommingMessage.length > 1) {
      const lastMessage = incommingMessage[incommingMessage.length - 1].message;
      const titleMatch = lastMessage.match(/^Title:\s*(.*)$/m); // Match the title line
      const descriptionStart = lastMessage.indexOf("\n\n") + 2; // Find where the description starts

      if (titleMatch) {
        setTitle(titleMatch[1].trim()); // Extract and set the title
      }

      if (descriptionStart > 1) {
        setDescription(lastMessage.slice(descriptionStart).trim()); // Extract and set the description
      }
    }
  }, [messages]);

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent the default form submission
  //   const formData = new FormData();
  //   formData.append("title", title);
  //   formData.append("description", description);
  //   formData.append("category", category);
  //   formData.append("image", image);

  //    // Append all selected documents
  // documents.forEach((doc) => formData.append('document', doc));

  //   setLoading(true);

  //   try {
  //     const response = await axios.post(
  //       `https://node-blog-app-seven.vercel.app/blog/posts/${email}`,
  //       // `http://localhost:3000/blog/posts/${email}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log("adding post response",response)
  //     setTitle("");
  //     setDescription("");
  //     setCategory("");
  //     setImage(null);
  //     toast.success("Post added successfully");
  //     navigate("/home"); // Redirect to the homepage
  //   } catch (error) {
  //     console.error("Error adding post:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const [currentLink, setCurrentLink] = useState('');
  const [links, setLinks] = useState([]);
  const [currentLinkTitle, setCurrentLinkTitle] = useState('');
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);
  
    // Correctly append documents
    documents.forEach((doc) => formData.append('document', doc));
  
    // Correctly append links using JSON stringification
    formData.append('links', JSON.stringify(links));
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        `https://node-blog-app-seven.vercel.app/blog/posts/${email}`,
        // `http://localhost:3000/blog/posts/${email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setImage(null);
      setLinks([]);
      toast.success("Post added successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const onDocumentsChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setDocuments(files);
  };
  
  console.log("links",links)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <NavBar />
      <div className="container min-h-screen mx-auto py-8 px-4">
        <h1 className="md:text-3xl text-xl font-bold mb-6">Add New Post</h1>
        <div className="md:w-96 px-4 mx-auto flex items-center mb-4 justify-center overflow-x-hidden">
          <ReactTyped
            strings={[
              "Hello Author 🖐️🖐️🖐️",
              "I am here to help you",
              "Cook your blog with me !!",
            ]}
            typeSpeed={70}
            backSpeed={30}
            className="text-base basis-4/5 flex items-center justify-center font-bold text-[#ffff]"
            loop
          />
          <div className="basis-1/5 flex items-center justify-center">
            <img 
              onClick={() => setChatbot(!chatbot)}
              src={Chatbot}
              className="ml-2 rounded-full w-7 h-7 md:w-9 md:h-9"
              alt="Chatbot"
            />
          </div>
        </div>
        {!chatbot ? (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter post title"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter post description"
                rows="5"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                Poster <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="image"
                onChange={onImageChange}
                className="mt-1 block w-full text-sm text-gray-300 text-xs file:mr-4 file:cursor-pointer file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-gray-500 file:text-black file:bg-white "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Links
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  type="text"
                  value={currentLinkTitle}
                  onChange={(e) => setCurrentLinkTitle(e.target.value)}
                  placeholder="Link Title"
                  className="w-1/2 px-3 py-2 bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 border border-gray-600 rounded-md"
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
                  className="py-2 px-4 hover:bg-gray-500 bg-white text-gray-800 font-bold rounded-md transition duration-200"
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
              <label htmlFor="documents" className="block text-sm font-medium text-gray-300">
               Source Documents (PDF/Word)
              </label>
              <input
                type="file"
                id="documents"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={onDocumentsChange}
                className="mt-1 block w-full text-sm text-gray-300 text-xs file:mr-4 file:cursor-pointer file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-gray-500 file:text-black file:bg-white"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full md:w-40 py-2 px-4 hover:bg-gray-500 bg-white text-gray-800 font-bold rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? "Submitting..." : "ADD POST"}
              </button>
            </div>
          </form>
        ) : (
          <div className="md:w-9/12 p-3 h-96 rounded-lg md:p-10 mx-auto">
            <MainContainer className="rounded-lg w-9/12 mx-auto text-xs">
              <ChatContainer>
                <MessageList
                  typingIndicator={
                    isTyping && (
                      <TypingIndicator content="Chatbot is typing..." />
                    )
                  }
                >
                  {messages.map((msg, idx) => (
                    <Message
                      className="mb-4"
                      key={idx}
                      model={{
                        message: msg.message,
                        sentTime: "just now",
                        sender: msg.sender,
                        direction: msg.direction,
                      }}
                    />
                  ))}
                </MessageList>
                <MessageInput
                  placeholder="Type a message..."
                  onSend={handleSend}
                  className="bg-gray-800 text-white"
                />
              </ChatContainer>
            </MainContainer>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default AddPost;