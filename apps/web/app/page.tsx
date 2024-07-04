"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { generatePseudoName } from './components/utils/generatePseudoName';

const Home: React.FC = () => {
  const [pseudoName, setPseudoName] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queueCount, setQueueCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPseudoName(generatePseudoName());
      const socketInstance = io('http://localhost:8000'); // Adjust the URL to your server's URL
      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log('Connected to the server');
      });

      socketInstance.on('queueUpdate', (count: number) => {
        setQueueCount(count);
      });

      socketInstance.on('paired', ({ roomId }) => {
        console.log(`Paired with roomId: ${roomId}`);
        router.push(`/chatroom?roomId=${roomId}&pseudoName=${pseudoName}`);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  const startChat = () => {
    if (socket) {
      console.log('Joining queue...');
      socket.emit('joinQueue');
    }
  };

  if (!pseudoName) {
    // Render a loading state while pseudoName is being generated
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-evenly min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl text-center font-bold mb-8">One-on-One Real Time Chat Application</h1>
      <div className="bg-gray-800 p-8 h-96 flex flex-col rounded-md w-full max-w-3xl">
        <div className="mt-2 mb-8">
          <h2 className="text-center text-xl mb-4">Welcome, <span className='bg-green-500 rounded-md p-1'>{pseudoName}</span></h2>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="bg-white text-black font-semibold px-4 py-2 rounded-md mb-2 hover:bg-gray-200"
            onClick={startChat}
          >
            Start Chat
          </button>
          <p className="m-2">{queueCount} users are waiting in queue</p>
        </div>
      </div>
      <p className="text-center max-w-2xl">
        ** Violations of community guidelines, including hate speech, harassment, explicit content, or illegal activities, will result in warnings and may lead to temporary or permanent bans.
      </p>
    </div>
  );
};

export default Home;
