import React, { useState, useEffect } from 'react';
import { useUser } from '../Authentication/UserContext';
import { useLocation } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import '../styles/ChatList.css'

const apiUrl = 'http://127.0.0.1:8180/api/';
const websocketUrl = 'ws://127.0.0.1:8180/ws/chats/';

const ChatList = () => {
  const { user } = useUser();
  const [chatList, setChatList] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
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

        const selectedUsernameFromProp = location.state?.selectedUsername;
        const selectedIdFromProp = location.state?.selectedId;
        if (selectedUsernameFromProp) {
          setSelectedUsername(selectedUsernameFromProp);
          setSelectedId(selectedIdFromProp);
          console.log(selectedUsername, selectedId, selectedIdFromProp, selectedUsernameFromProp);
          const isUsernameInChatList = chatList.some(chat => chat.username === selectedUsernameFromProp);
          if (!isUsernameInChatList) {
            try {
              const response = await fetch(`${apiUrl}addchat/`, {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${user.token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({selectedId: selectedIdFromProp, username: selectedUsernameFromProp }),
              });

              if (response.ok) {
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
      // Don't close the WebSocket here if it's shared among components
      // ws.close();
    };
  }, [user, location, websocketUrl]);

  const handleChatSelection = (id, username) => {
    setSelectedUsername(username);
    setSelectedId(id)
    setOpenChat(true);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: '1' }}>
        <h2>Chat List</h2>
        <ul>
          {chatList.map((chat) => (
            <li key={chat.id}>
              <button onClick={() => handleChatSelection(chat.id, chat.username)}>
                {chat.username}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: '6' }}>
        {openChat ? (
          <ChatWindow ws={ws} selectedId={selectedId} selectedUsername={selectedUsername} openChat={openChat} setOpenChat={setOpenChat} />
        ) : (
          <p>Select a chat to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;
