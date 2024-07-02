// pages/chatroom.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { sanitizeMessage } from '../components/utils/sanitize';

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  const handleSendMessage = () => {
    const sanitizedMessage = sanitizeMessage(inputMessage);
    setMessages([...messages, sanitizedMessage]);
    setInputMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-900 text-white p-4">
                  <span className=" text-white text-center text-2xl p-4 mb-2 rounded-md"> Chatting with Second Person Pseudo Name</span>

      <div className="bg-gray-800 p-8  flex flex-col min-h-[80vh] rounded-md w-full max-w-[140vh]">
        <div className="flex justify-between items-center mb-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md">Back</button>
          <div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">End Chat</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">Report</button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto bg-gray-700 p-4 rounded-md">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <p>{message}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            className="flex-grow p-3 m-1 rounded-md bg-gray-600 text-white"
            placeholder="Enter your chat message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-3 px-6 m-1 rounded-md ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
