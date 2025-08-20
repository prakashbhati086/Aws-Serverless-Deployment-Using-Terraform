import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'

type User = {
  userId: string
  name: string
  email: string
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/,'') || ''

function isAxiosError(err: unknown): err is AxiosError<{ message?: string }> {
  return axios.isAxiosError(err)
}

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get<User[]>(`${API_BASE}/users`)
      setUsers(res.data || [])
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setError(e.response?.data?.message ?? e.message ?? 'Failed to load users')
      } else {
        setError('Failed to load users')
      }
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required')
      return
    }
    try {
      await axios.post(`${API_BASE}/users`, { name: name.trim(), email: email.trim() }, {
        headers: { 'Content-Type': 'application/json' }
      })
      setName('')
      setEmail('')
      await fetchUsers()
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setError(e.response?.data?.message ?? e.message ?? 'Failed to add user')
      } else {
        setError('Failed to add user')
      }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, Arial' }}>
      <h1>AWS Serverless User Management</h1>
      <p style={{ color: '#999' }}>API: {API_BASE || '(not set)'}</p>

      <form onSubmit={addUser} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: 10, fontSize: 16, cursor: 'pointer' }}>
          Add User
        </button>
      </form>

      {error && <div style={{ color: 'white', background: '#c0392b', padding: 10, borderRadius: 6, marginBottom: 16 }}>
        {error}
      </div>}

      {loading ? <p>Loading...</p> : (
        <div>
          <h2>Users</h2>
          {users.length === 0 ? <p>No users yet.</p> : (
            <ul style={{ paddingLeft: 16 }}>
              {users.map((u) => (
                <li key={u.userId} style={{ marginBottom: 8 }}>
                  <strong>{u.name}</strong> — {u.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
