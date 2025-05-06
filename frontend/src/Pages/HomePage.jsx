import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../ui/NavBar";
import BlogContainer from "./BlogContainer";
import Footer from "../ui/Footer";
import { Link } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { VscCopilot } from "react-icons/vsc";
import { GoCopilot } from "react-icons/go";
function HomePage() {
  const username = localStorage.getItem("username");
  const [posts, setPosts] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [authors, setAuthors] = useState([]);
  const [yourPost, setYourPost] = useState(0);
  const email = localStorage.getItem('email');

  const getAuthors = async () => {
    try {
      const response = await axios.get('https://node-blog-app-seven.vercel.app/blog/author');
      setAuthors(response.data);
      console.log("authors", response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAuthors();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`https://node-blog-app-seven.vercel.app/blog/posts/`);
      console.log("data", response.data);
      setCategoryCount(response.data.count);
      setPosts(response.data.posts);
      setYourPost(response.data.posts.filter(post => post.authoremail === email));
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Chatbot
  const [messages, setMessages] = useState([
    {
      "message": "Hi Chief, Blog Copilot is here. How can I help?",
      sender: "bot",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatbot, setChatbot] = useState(false);

  const backendEndpoint = "https://mongodb-rag.onrender.com/query-rag";
  // const backendEndpoint = "http://127.0.0.1:3000/query-rag";

  // const handleSend = async (message) => {
  //   const newMessage = {
  //     message,
  //     sender: "user",
  //     direction: "outgoing",
  //   };
  //   setMessages((prev) => [...prev, newMessage]);

  //   setIsTyping(true);

  //   console.log("my query mesg",message)

  //   try {
  //     const response = await axios.post(backendEndpoint, {
  //       query: message,
  //     });

  //     const botResponse = response.data.response || "No response received.";
  //     console.log("bot response",response)
  //     typewriterEffect(botResponse, "bot");
  //   } catch (error) {
  //     console.error("Error fetching response:", error);
  //     const errorMessage = {
  //       message: "An error occurred. Please try again later.",
  //       sender: "bot",
  //       direction: "incoming",
  //     };
  //     setMessages((prev) => [...prev, errorMessage]);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };
  const handleSend = async (message) => {
    // Sanitize input message to remove HTML tags
    const sanitizedMessage = message.replace(/<[^>]*>/g, ""); // Removes HTML tags
    console.log("san mesg",sanitizedMessage)
    const newMessage = {
      message: sanitizedMessage,
      sender: "user",
      direction: "outgoing",
    };
  
    // Add user message to the messages array
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
  
    // console.log("User's query message:", sanitizedMessage);
  
    try {
      // Send POST request to the backend
      const response = await axios.post(backendEndpoint, {
        query: sanitizedMessage,
      });
  
      // Extract bot response or use a fallback
      const botResponse = response.data?.response || "No response received from the bot.";
      console.log("Bot response:", response);
  
      // Show the bot's response with a typewriter effect
      typewriterEffect(botResponse, "bot");
    } catch (error) {
      console.error("Error fetching response:", error);
  
      // Log error details for debugging
      if (error.response) {
        console.error("Server Response Data:", error.response.data);
        console.error("Server Response Status:", error.response.status);
      }
  
      // Add error message to the messages array
      const errorMessage = {
        message: "An error occurred. Please try again later.",
        sender: "bot",
        direction: "incoming",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Ensure typing status is cleared
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

  
  // console.log('your posts', yourPost);
  // console.log('email', email);

  return (
    <div className="min-h-screen relative bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 text-white">
      <NavBar />

      <div className="md:text-2xl text-xl mb-10 font-bold text-center mt-5">Welcome to Blog Browser!</div>

      <div className="grid grid-cols-8 gap-1.5 md:gap-3 w-11/12 md:w-9/12 my-5 mx-auto">
        <div className="col-span-2 p-1 md:w-11/12 w-full md:h-fit lg:h-36 bg-gray-800 rounded-lg shadow-xl flex items-center justify-center">
          <Link to='/yourposts'>
          <div className="text-center flex-col justify-center">
            <h1 className="md:text-3xl text-sm text-white">{yourPost.length}</h1>
            <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-orange-400">My Posts</h3>
          </div>
          </Link>
          
        </div>

        <div className="col-span-2 p-1 md:w-11/12 w-full md:h-fit lg:h-36 bg-gray-800 rounded-lg shadow-xl flex items-center justify-center">
          <div className="text-center flex-col justify-center">
            <h1 className="md:text-3xl text-sm text-white">{posts.length}</h1>
            <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-orange-400">Total Posts</h3>
          </div>
        </div>

        <div className="col-span-2 p-1 md:w-11/12 w-full md:h-fit lg:h-36 bg-gray-800 rounded-lg shadow-xl flex items-center justify-center">
          <Link to='/authors'>
            <div className="text-center flex-col justify-center">
              <h1 className="md:text-3xl text-sm text-white">{authors.length}</h1>
              <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-orange-400">Authors</h3>
            </div>
          </Link>
        </div>

        <div className="col-span-2 p-2 md:w-11/12 md:h-fit lg:h-36 bg-gray-800 rounded-lg shadow-xl flex items-center justify-center">
        
          <div className="text-center flex-col justify-center">
            <h1 className="md:text-3xl text-sm text-white">{categoryCount}</h1>
            <h3 className="text-xs md:text-sm lg:text-2xl font-semibold text-orange-400">Categories</h3>
          </div>
        </div>
      </div>

      <div className="min-h-screen h-auto">
        <BlogContainer />
      </div>

      <div 
      onClick={()=>{setChatbot(!chatbot)}}
      className={`${email==='yugeshkaran01@gmail.com'?'fixed md:right-10 cursor-pointer  md:bottom-10 right-5 bottom-5':'hidden'}`}>
        <GoCopilot   className="md:text-xl text-xl rounded-full font-bold" />
      </div>
      <div className={`${chatbot?'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50':'hidden'}`}>
        <div className="flex-col w-full"> 

    

        <MainContainer className="rounded-lg h-96 md:w-1/2 w-9/12 mx-auto bg-gradient-to-br from-gray-900 to-gray-800 md:text-lg text-xs shadow-lg">
          <ChatContainer className="bg-gray-900 rounded-lg">
            <MessageList
              typingIndicator={
                isTyping && (
                  <TypingIndicator
                    className="bg-gray-900 w-full text-gray-400"
                    content="Copilot is typing..."
                  />
                )
              }
              className="bg-gray-900 text-gray-200 p-4"
            >
              {messages.map((msg, idx) => (
                <Message
                  className="mb-4 text-white"
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
              className="bg-gray-800 text-white rounded-lg p-2"
            />
          </ChatContainer>
        </MainContainer>

          <div
            onClick={() => setChatbot(!chatbot)}
            className="text-center mt-4 bg-orange-500 cursor-pointer w-24 mx-auto rounded-md py-1 text-sm"
          >
            Close
          </div>

        </div>          
      </div>      

      <Footer />
    </div>
  );
}

export default HomePage;