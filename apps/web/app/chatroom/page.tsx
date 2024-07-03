"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { sanitizeMessage } from '../components/utils/sanitize';

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const role = searchParams.get('role');
  const pseudoName = searchParams.get('pseudoName');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && roomId && role && pseudoName) {
      const socketInstance = io('http://localhost:8000'); // Adjust the URL to your server's URL
      setSocket(socketInstance);

      socketInstance.emit('joinRoom', { roomId, role, pseudoName });

      socketInstance.on('message', (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [roomId, role, pseudoName]);

  const handleSendMessage = () => {
    if (socket && inputMessage) {
      const sanitizedMessage = sanitizeMessage(inputMessage);
      socket.emit('message', sanitizedMessage);
      setMessages([...messages, sanitizedMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-900 text-white p-4">
      <div className="p-6 flex flex-col min-h-screen rounded-md w-full">
        <div className="flex justify-between items-center mb-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => router.back()}>Back</button>
          <span className="text-white text-center text-2xl p-4 mb-2 rounded-md">Chatting with Second Person Pseudo Name</span>
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
