import React from 'react';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'self' | 'other';
}

interface ChatMessagesProps {
  messages: ChatMessage[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-2 p-2 rounded-md ${
            message.sender === 'self' ? 'bg-blue-500 text-white self-end' : 'bg-gray-700 text-white'
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
