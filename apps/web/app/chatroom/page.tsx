"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { sanitizeMessage } from '../components/utils/sanitize';

const ChatRoom: React.FC = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const pseudoName = searchParams.get('pseudoName');

  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:8000'); // Adjust the URL to your server's URL
    setSocket(socketInstance);

    if (roomId) {
      socketInstance.emit('joinRoom', { roomId });
      socketInstance.on('message', (message: string) => {
        console.log(`Message received: ${message}`);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socketInstance.on('disconnected', () => {
        alert('The other user has disconnected.');
      });
    }

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    const sanitizedMessage = sanitizeMessage(inputMessage);
    if (socket && roomId) {
      console.log(`Sending message: ${sanitizedMessage}`);
      socket.emit('message', { roomId, message: sanitizedMessage });
      setMessages([...messages, sanitizedMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-900 text-white p-4">
      <div className="p-6 flex flex-col min-h-screen rounded-md w-full">
        <div className="flex justify-between items-center mb-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md">Back</button>
          <span className="text-white text-center text-2xl p-4 mb-2 rounded-md">
            Chatting with {pseudoName}
          </span>
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
