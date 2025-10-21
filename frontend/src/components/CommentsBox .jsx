import React, { useEffect, useRef, useState } from "react";

import userProfile from "../images/user.png";
const CommentsBox = ({ messages, viewComments, timeStamp }) => {
  const commentBoxRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Detect if user is manually scrolling up
  const handleScroll = () => {
    if (!commentBoxRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = commentBoxRef.current;

    // If user is not near the bottom, mark as manual scrolling
    if (scrollHeight - scrollTop - clientHeight > 50) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
    }
  };

  // Attach scroll listener
  useEffect(() => {
    const div = commentBoxRef.current;
    if (div) div.addEventListener("scroll", handleScroll);
    return () => div && div.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll only if user is NOT scrolling manually
  useEffect(() => {
    if (viewComments && !isUserScrolling && commentBoxRef.current) {
      commentBoxRef.current.scrollTo({
        top: commentBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, viewComments, isUserScrolling]);

  return (
    <div
      ref={commentBoxRef}
      className={`${
        viewComments
          ? "flex-col max-h-96 overflow-y-auto"
          : "flex-col overflow-y-hidden"
      } scrollbar-hide mb-3 items-start justify-start gap-2 transition-all duration-300`}
    >
      {messages.length > 0 ? (
        (viewComments ? messages : messages.slice(0, 1)).map((msg, index) => (
          <div
            key={index}
            className="flex items-start gap-3 mb-4 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg p-3 transition-all duration-200"
          >
            <img
              src={
                msg.profile && msg.profile !== ""
                  ? `https://open-access-blog-image.s3.us-east-1.amazonaws.com/${msg.profile}`
                  : userProfile
              }
              className="w-10 h-10 rounded-full bg-white border border-gray-600 object-cover"
              alt="User Avatar"
            />
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-white">@{msg.user}</p>
                <p className="text-[10px] text-gray-400">
                  {timeStamp.slice(0, 10)}
                </p>
              </div>
              <p className="text-sm mt-1 text-gray-200">{msg.message}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="md:text-sm text-xs text-gray-400 italic">
          💭 Be the first to comment...
        </p>
      )}
    </div>
  );
};

export default CommentsBox;
