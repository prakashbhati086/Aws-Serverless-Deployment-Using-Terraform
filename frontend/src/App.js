import React, { useState, useEffect } from 'react';
import axios from 'axios';

// You'll update this URL after deployment
const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
      await axios.post(`${API_BASE_URL}/users`, newUser);
      setNewUser({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>My Serverless App</h1>
      
      <form onSubmit={createUser} style={{ marginBottom: '20px' }}>
        <h2>Add New User</h2>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            style={{ margin: '5px', padding: '8px' }}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={{ margin: '5px', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ margin: '5px', padding: '8px 16px' }}>
          Add User
        </button>
      </form>

      <div>
        <h2>Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id} style={{ margin: '10px 0' }}>
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
