import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
 
const apiUrl = 'http://127.0.0.1:8180/api/';

const ChatList = () => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await fetch(`${apiUrl}chatlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include any authentication headers if needed
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChatList(data); // Assuming data is an array of chat list items
        } else {
          console.error('Failed to fetch chat list');
        }
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };

    fetchChatList();
  }, []); // Run once when the component mounts

  return (
    <div>
      <h2>Chat List</h2>
      <ul>
        {chatList.map((chatItem) => (
          <li key={chatItem.id}>
            <Link to={`/main/chatwindow/${chatItem.id}`}>
              {chatItem.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
