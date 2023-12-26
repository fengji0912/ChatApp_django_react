// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ selectedUsername, ws }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Add WebSocket message handling for receiving and updating messages
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const type = data.type;

        if (type === 'chat_message') {
          const newMessage = {
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            timestamp: data.timestamp,
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
        // Add handling for other message types if needed
      };
    }
  }, [ws]);

  const handleCloseChat = () => {
    // Close the chat window by setting openChat to false
    // Add any additional cleanup or logic as needed
    setOpenChat(false);
  };

  const handleSendMessage = () => {
    const timestamp = new Date().toISOString();
    if (inputMessage.trim() !== '') {
      const messageData = {
        type: 'send_message',
        receiver: selectedUsername,
        message: inputMessage,
        timestamp: timestamp,
      };

      ws.send(JSON.stringify(messageData));
      setInputMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="header">
        <span>{selectedUsername}</span>
        <button onClick={handleCloseChat}>Close</button>
      </div>
      <div className="message-display" ref={chatWindowRef}>
        {messages.map((message, index) => (
          <div key={index} className={message.sender === selectedUsername ? 'sent' : 'received'}>
            <div>{message.message}</div>
            <div className="timestamp">{message.timestamp}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
