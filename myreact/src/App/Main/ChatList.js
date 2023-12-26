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
  const [ws, setWs] = useState(null);

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

        const selectedUsernameFromProp = location.props?.selectedUsername;

        if (selectedUsernameFromProp) {
          setSelectedUsername(selectedUsernameFromProp);
          const isUsernameInChatList = chatList.some(chat => chat.username === selectedUsername);

          if (!isUsernameInChatList) {
            try {
              const response = await fetch(`${apiUrl}addchat/`, {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${user.token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: selectedUsername }),
              });

              if (response.ok) {
              // Add logic here if needed after successfully adding the chat
              } else {
                console.error('Error adding chat:', response.statusText);
              }
            } catch (error) {
              console.error('Error adding chat:', error);
            }
          }
          setOpenChat(true);
        }
      } catch (error) {
        console.error('Error fetching chatlist data:', error);
      }
    }
    fetchChatList();

    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;

      if (type === 'chat_list') {
        const updatedChatList = chatList.map(chat =>
          chat.id === data.id ? { ...chat, username: data.username, email: data.email} : chat
        );
        setChatList(updatedChatList);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user, chatList, setChatList, location]);

  const handleChatSelection = (username) => {
    setSelectedUsername(username);
    setOpenChat(true);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: '1' }}>
        <h2>Chat List</h2>
        <ul>
          {chatList.map((chat) => (
            <li key={chat.id}>
              <button onClick={() => handleChatSelection(chat.username)}>
                {chat.username}
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
