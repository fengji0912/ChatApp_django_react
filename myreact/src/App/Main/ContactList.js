import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Authentication/UserContext';

const apiUrl = 'http://127.0.0.1:8180/api/';
const websocketUrl = 'ws://127.0.0.1:8180/ws/contacts/';

const ContactList = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [contacts, setContacts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showAddFriendPopup, setShowAddFriendPopup] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!(user && user.token)) {
          console.error('User is not logged in.');
          navigate('/');
          return;
        }

        const fetchContactList = async () => {
          try {
            const response = await fetch(`${apiUrl}contactlist/`, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${user.token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              setContacts(data);
            } else {
              console.error('Failed to fetch contact list');
            }
          } catch (error) {
            console.error('Error fetching contact list:', error);
          }
        };

        const fetchRequestList = async () => {
          try {
            const response = await fetch(`${apiUrl}requestlist/`, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${user.token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              setRequests(data);
            } else {
              console.error('Failed to fetch request list');
            }
          } catch (error) {
            console.error('Error fetching request list:', error);
          }
        };

        const fetchResponseList = async () => {
          try {
            const response = await fetch(`${apiUrl}responselist/`, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${user.token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              setResponses(data);
            } else {
              console.error('Failed to fetch response list');
            }
          } catch (error) {
            console.error('Error fetching response list:', error);
          }
        };

        // Fetch data when the component mounts
        fetchContactList();
        fetchRequestList();
        fetchResponseList();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchData();

    // Establish WebSocket connection
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;

      if (type === 'friend_request_response') {
        // Handle friend request response
        const updatedContacts = contacts.map(contact =>
          contact.id === contact.id ? { ...contact, username:data.username, email:data.email } : contact
        );
        setContacts(updatedContacts);

        const updatedRequests = requests.map(request =>
          request.id === request.id ? { ...request, email:data.email, status: data.status } : request
        );
        setRequests(updatedRequests);

        const updatedResponses = responses.map(response =>
          response.id === data.id ? { ...response, email:data.email, status: data.status } : response
        );
        setResponses(updatedResponses);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    return () => {
      socket.close();
    };

  }, [user, navigate, contacts, requests, responses]);


  const handleAddFriend = () => {
    setShowAddFriendPopup(true);
  };

  const handleAddFriendSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}addfriend/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newFriendEmail }),
      });

      if (response.ok) {
        setShowAddFriendPopup(false);
        setNewFriendEmail('');
      } else {
        console.error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleDeleteFriend = (friend) => {
    setSelectedFriend(friend);
    setShowDeletePopup(true);
  };

  const handleDeleteFriendSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}deletefriend/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({friend: selectedFriend }),
      });

      if (response.ok) {
        setShowDeletePopup(false);
      } else {
        console.error('Failed to delete friend');
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
    }
  };

   const handleFriendRequestResponse = async (friend_id, status) => {
    try {
      const response = await fetch(`${apiUrl}respondtofriendrequest/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: friend_id, status: status }),
      });

      if (response.ok) {
        ws.send(JSON.stringify({ type: 'friend_request_response', id: friend_id, status }));
      } else {
        console.error('Failed to respond to friend request');
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  const handleContactSelection = (contactUsername) => {
    navigate('/chatlist', { state: { selectedUsername: contactUsername } });
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: '1' }}>
        <h2>Contact List</h2>
        <button onClick={handleAddFriend}>Add Friend</button>

        {showAddFriendPopup && (
          <div className="add-friend-popup">
            <p>Enter the email of the friend you want to add:</p>
            <input
              type="email"
              value={newFriendEmail}
              onChange={(e) => setNewFriendEmail(e.target.value)}
            />
            <button onClick={handleAddFriendSubmit}>Add Friend</button>
            <button onClick={() => setShowAddFriendPopup(false)}>Cancel</button>
          </div>
        )}

        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <p>{contact.username}</p>
              <p>{contact.email}</p>
              <button onClick={() => handleDeleteFriend(contact)}>
                Delete Friend
              </button>
              <button onClick={() => handleContactSelection(contact.username)}>
                Open Chat with {contact.username}
              </button>
            </li>
          ))}
        </ul>

        {showDeletePopup && (
          <div className="delete-friend-popup">
            <p>Are you sure you want to delete {selectedFriend.username}?</p>
            <button onClick={handleDeleteFriendSubmit}>Sure, I want to delete</button>
            <button onClick={() => setShowDeletePopup(false)}>No, thanks</button>
          </div>
        )}
      </div>

      <div style={{ flex: '1' }}>
        <h3>Friend Requests</h3>
        {requests.map((request) => (
          <li key={request.id}>
            <p>{request.email}</p>
            <p>{request.status}</p>
          </li>
        ))}
      </div>

      <div style={{ flex: '1' }}>
        <h3>Response List</h3>
        {responses.map((response) => (
          <li key={response.id}>
            <p>{response.email} wants to be your friend.</p>
            {response.status === 'pending' && (
              <>
                <button onClick={() => handleFriendRequestResponse(response.id,'accepted')}>
                  Accept
                </button>
                <button onClick={() => handleFriendRequestResponse(response.id,'declined')}>
                  Decline
                </button>
              </>
            )}
            {response.status != 'pending' && (
            <p>Status: {response.status}</p>)}
          </li>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
