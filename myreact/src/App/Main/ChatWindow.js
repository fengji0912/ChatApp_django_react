// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../Authentication/UserContext';

const apiUrl = 'http://127.0.0.1:8180/api/';
const websocketUrl = 'ws://127.0.0.1:8180/ws/chats/';
const ChatWindow = ({selectedId, openChat, selectedUsername, setOpenChat  }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatWindowRef = useRef(null);
  const { user } = useUser();
  const [ws, setWs] = useState(null);

  console.log(selectedId, openChat, selectedUsername)
  useEffect(() => {
    // Add WebSocket message handling for receiving and updating messages
    if (selectedId) {
      const socket = new WebSocket(websocketUrl);

      socket.onopen = () => {
        console.log('WebSocket connection opened');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const type = data.type;
        console.log(selectedId)

        if (type === 'chat_message') {
          const updateMessages = messages.map(message =>
            message.id === data.id ? { ...message,sender: data.sender,
            receiver: data.receiver,
            message_text: data.message_text,
            timestamp: data.timestamp} : message
          );
          setMessages(updateMessages);
          console.log(messages)
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [user]);

  const handleCloseChat = () => {
    // Close the chat window by setting openChat to false
    // Add any additional cleanup or logic as needed
    setOpenChat(false);
  };

  const handleSendMessage = async () => {
  const timestamp = new Date().toISOString();
  console.log();
  if (inputMessage.trim() !== '') {
    try {
      const response = await fetch(`${apiUrl}sendmessage/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp: timestamp, selectedId: selectedId, Message: inputMessage }),
      });

      if (response.ok) {
        // Add logic here if needed after successfully adding the chat
      } else {
        console.error('Error send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error send message:', error);
    }
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
