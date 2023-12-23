import React, { useState, useEffect } from 'react';
import { useUser } from '../Authentication/UserContext';
import { useLocation } from 'react-router-dom';
import ChatWindow from './ChatWindow';

const apiUrl = 'http://127.0.0.1:8180/api/';
const websocketUrl = 'ws://127.0.0.1:8180/ws/chats/';

const ChatList = () => {
  const { user } = useUser();
  const [chatList, setChatList] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        if (!(user && user.token)) {
          console.error('User is not logged in.');
          return;
        }

        const response = await fetch(`${apiUrl}chatlist/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const chatlistData = await response.json();
          setChatList(chatlistData);
        } else {
          console.error('Error fetching chatlist data');
        }
      } catch (error) {
        console.error('Error fetching chatlist data:', error);
      }
    };

    fetchChatList();
  }, [user]);

  useEffect(() => {
    const selectedUsername = location.state?.selectedUsername;

    if (selectedUsername) {
      handleChatSelection(selectedUsername);
    }
  }, [location]);

  const handleChatSelection = (username) => {
    const existingChat = findChatWithContact(selectedUsername);

    if (existingChat) {
      setSelectedUsername(existingChat);
    } else {
      createChat(username);
    }

    setOpenChat(true);
  };

  const findChatWithContact = (username) => {
    return chatList.find((chat) => chat.username === username);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: '1' }}>
        <h2>Chat List</h2>
        <ul>
          {chatList.map((chat) => (
            <li key={chat.id}>
              <button onClick={() => handleChatSelection(chat.username)}>
                Open Chat with {chat.username}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: '1' }}>
        {openChat ? (
          <ChatWindow selectedUsername={selectedUsername} ws={ws} />
        ) : (
          <p>Select a chat to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;
