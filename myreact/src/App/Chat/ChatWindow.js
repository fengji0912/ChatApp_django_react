import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ChatWindow = () => {
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    // Implement the logic to send a message to the backend
    // Append the new message to the messages state
    const newMessage = {
      text: messageInput,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleGoBack = () => {
    // Go back to the ChatList when the cross is clicked
    navigate('/main/chatlist');
  };

  return (
    <div>
      <div className="chat-header">
        <Link to="/main/chatlist">
          <span onClick={handleGoBack}>&#10006;</span>
        </Link>
        {/* Display chat participant's username or other relevant information */}
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.text}</p>
            <small>{msg.timestamp}</small>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
