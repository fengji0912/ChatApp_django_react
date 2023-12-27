// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../Authentication/UserContext';

const apiUrl = 'http://127.0.0.1:8180/api/';
const websocketUrl = 'ws://127.0.0.1:8180/ws/chats/';
const ChatWindow = ({ws, selectedId, openChat, selectedUsername, setOpenChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatWindowRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchChatMessage = async () => {
      try {
        if (!(user && user.token)) {
          console.error('User is not logged in.');
          return;
        }
        const response = await fetch(`${apiUrl}chatmessage/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({selectedId: selectedId}),
        });

        if (response.ok) {
          const messages = await response.json();
          setMessages(messages);
          console.error(messages);
        } else {
          console.error('Error fetching chatlist data');
        }
      }catch (error) {
        console.error('Error fetching chatlist data:', error);
      }
    }
    fetchChatMessage();

    if (ws) {
      console.log('WebSocket')
      ws.onopen = () => {
      console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const type = data.type;
        console.log('WebSocket message')

        if (type === 'chat_message') {
          const updateMessages = messages.map((message) =>
            message.id === data.id
              ? { ...message, sender_id: data.sender_id, receiver_id: data.receiver_id, message_text: data.message_text, timestamp: data.timestamp }
              : message
          );
          setMessages(updateMessages);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
      // Don't close the WebSocket here if it's shared among components
      // ws.close();
      };
    }
  }, [user, ws]);

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
      <div className="message-display" ref={chatWindowRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
        {messages.map((message, index) => (
           <div key={index} className={message.sender_id === selectedId ? 'received' : 'sent'}>
             <div>{message.message_text}</div>
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

