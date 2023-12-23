import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../Authentication/UserContext';
import { useNavigate } from 'react-router-dom';

const apiUrl = 'http://127.0.0.1:8180/api/';

const ChatList = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [chatList, setChatList] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        if (!(user && user.token)) {
          console.error('User is not logged in.');
          navigate('/');
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

  const createChatWithContact = async (contactId) => {
    try {
      const response = await fetch(`${apiUrl}createchat/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactId }),
      });

      if (response.ok) {
        // Reload the chat list or update it with the newly created chat
        fetchChatList();
      } else {
        console.error('Error creating chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleContactSelection = (contactId) => {
    setSelectedContact(contactId);
    createChatWithContact(contactId);
    // Close the modal or navigate to the chat window
  };

  return (
    <div>
      <h2>Chat List</h2>
      <button onClick={handleCreateChatClick}>Create Chat</button>
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
