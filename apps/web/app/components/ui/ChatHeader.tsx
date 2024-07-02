import React from 'react';

interface ChatHeaderProps {
  pseudoName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ pseudoName }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <button className="text-white">Back</button>
      <div className="text-white">{pseudoName}</div>
      <div className="flex space-x-4">
        <button className="text-white">End Chat</button>
        <button className="text-white">Report</button>
      </div>
    </div>
  );
};

export default ChatHeader;
