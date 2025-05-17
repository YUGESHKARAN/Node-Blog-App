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
      message: "Hello developer, I am here to convert your text to post content.",
      sender: "bot",
      direction: "incoming",
    },
  ]);

  const [documents, setDocuments] = useState([]);

  const [isTyping, setIsTyping] = useState(false);
  const [chatbot, setChatbot] = useState(false);

  const backendEndpoint = "https://blog-chat-backend.vercel.app/generate-content";
  // const backendEndpoint = "http://127.0.0.1:5000/generate-content";

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
      console.log("botResponse", botResponse);
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

  // useEffect(() => {
  //   const incommingMessage = messages.filter(
  //     (msg) => msg.direction === "incoming"
  //   );
  //   if (incommingMessage.length > 1) {
  //     const lastMessage = incommingMessage[incommingMessage.length - 1].message;
  //     const titleMatch = lastMessage.match(/^Title:\s*(.*)$/m); // Match the title line
  //     const descriptionStart = lastMessage.indexOf("\n\n") + 2; // Find where the description starts

  //     if (titleMatch) {
  //       setTitle(titleMatch[1].trim()); // Extract and set the title
  //     }

  //     if (descriptionStart > 1) {
  //       setDescription(lastMessage.slice(descriptionStart).trim()); // Extract and set the description
  //     }
  //   }
  // }, [messages]);


  useEffect(() => {
    const incommingMessage = messages.filter(
      (msg) => msg.direction === "incoming"
    );
  
    if (incommingMessage.length > 1) {
      const lastMessage = incommingMessage[incommingMessage.length - 1].message;
  
      // Combine message with hashtags
      setDescription(lastMessage);
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
  
  // console.log("links",links)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <NavBar />
      <div className="container min-h-screen mx-auto md:w-1/2 mx-auto w-11/12 py-8 px-4">
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
              className="ml-2 cursor-pointer rounded-full w-7 h-7 md:w-9 md:h-9"
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
                  className="md:py-2 md:px-4 px-2 py-1 hover:bg-gray-500 bg-white text-gray-800 font-bold rounded-md transition duration-200"
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
                className="w-full md:w-40 md:py-2 px-2 py-1 md:px-4 hover:bg-gray-500 bg-white text-gray-800 font-bold rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? "Submitting..." : "ADD POST"}
              </button>
            </div>
          </form>
        ) : (
          <div className="md:w-9/12 p-3 h-96 rounded-lg md:p-10 mx-auto">
            <MainContainer className="rounded-lg w-9/12 mx-auto md:text-sm text-xs">
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