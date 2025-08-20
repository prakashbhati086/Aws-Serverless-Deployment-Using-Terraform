import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Simple User Management React App
 * Perfect for demonstrating full-stack serverless architecture
 */

// API URL - will be replaced during deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data.users || []);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const createUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setError('Please fill in both name and email.');
      return;
    }

    setError(null);
    
    try {
      await axios.post(`${API_BASE_URL}/users`, {
        name: newUser.name.trim(),
        email: newUser.email.trim()
      });
      
      // Clear form and refresh users
      setNewUser({ name: '', email: '' });
      fetchUsers();
      
    } catch (err) {
      setError('Failed to create user. Please try again.');
      console.error('Error creating user:', err);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🚀 Serverless User Management</h1>
        <p style={styles.subtitle}>
          Built with React, AWS Lambda & DynamoDB
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {/* Add User Form */}
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>➕ Add New User</h2>
        <form onSubmit={createUser} style={styles.form}>
          <input
            type="text"
            placeholder="Enter full name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Enter email address"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div style={styles.listSection}>
        <h2 style={styles.sectionTitle}>
          👥 Users ({users.length})
        </h2>
        
        {loading ? (
          <div style={styles.loading}>
            ⏳ Loading users...
          </div>
        ) : users.length === 0 ? (
          <div style={styles.empty}>
            📝 No users found. Add your first user above!
          </div>
        ) : (
          <div>
            {users.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userEmail}>📧 {user.email}</div>
                <div style={styles.userDate}>
                  📅 {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>💻 Built with React + AWS Serverless Architecture</p>
        <p style={styles.apiUrl}>API: {API_BASE_URL}</p>
      </footer>
    </div>
  );
}

// Styles object for clean, professional look
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f8f9fa'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    fontSize: '2.5em',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.1em',
    margin: '0'
  },
  error: {
    background: '#ffe6e6',
    border: '1px solid #ff9999',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '20px',
    color: '#d63384'
  },
  formSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  listSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    color: '#2c3e50',
    marginTop: '0',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e9ecef',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  loading: {
    textAlign: 'center',
    padding: '30px',
    color: '#6c757d',
    fontSize: '1.1em'
  },
  empty: {
    textAlign: 'center',
    padding: '30px',
    color: '#6c757d',
    fontSize: '1.1em'
  },
  userCard: {
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.2s'
  },
  userName: {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  userEmail: {
    color: '#495057',
    marginBottom: '5px'
  },
  userDate: {
    color: '#6c757d',
    fontSize: '0.9em'
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#6c757d',
    borderTop: '1px solid #e9ecef'
  },
  apiUrl: {
    fontSize: '0.8em',
    marginTop: '5px',
    fontFamily: 'monospace'
  }
};

export default App;
