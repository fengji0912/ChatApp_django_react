import React, { useState, useEffect } from 'react';

const apiUrl = 'http://127.0.0.1:8180/api/';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContactList = async () => {
      try {
        const response = await fetch(`${apiUrl}contactlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include any authentication headers if needed
          },
        });

        if (response.ok) {
          const data = await response.json();
          setContacts(data); // Assuming data is an array of contact items
        } else {
          console.error('Failed to fetch contact list');
        }
      } catch (error) {
        console.error('Error fetching contact list:', error);
      }
    };

    fetchContactList();
  }, []); // Run once when the component mounts

  return (
    <div>
      <h2>Contact List</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <p>{contact.username}</p>
            <p>{contact.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
