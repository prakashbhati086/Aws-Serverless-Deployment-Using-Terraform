import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'

type User = {
  userId: string
  name: string
  email: string
}

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') || ''

// Narrow unknown -> AxiosError with a small type guard
function isAxiosErr(err: unknown): err is AxiosError<{ message?: string }> {
  return axios.isAxiosError(err)
}

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get<User[]>(`${API_BASE}/users`)
      setUsers(res.data ?? [])
    } catch (e: unknown) {
      if (isAxiosErr(e)) {
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
    setOk('')
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required')
      return
    }
    try {
      await axios.post(
        `${API_BASE}/users`,
        { name: name.trim(), email: email.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      )
      setName('')
      setEmail('')
      setOk('User added')
      setTimeout(() => setOk(''), 1800)
      await fetchUsers()
    } catch (e: unknown) {
      if (isAxiosErr(e)) {
        setError(e.response?.data?.message ?? e.message ?? 'Failed to add user')
      } else {
        setError('Failed to add user')
      }
    }
  }

  const deleteUser = async (userId: string) => {
    setError('')
    setOk('')
    try {
      await axios.delete(`${API_BASE}/users/${userId}`)
      setOk('User deleted')
      setTimeout(() => setOk(''), 1500)
      await fetchUsers()
    } catch (e: unknown) {
      if (isAxiosErr(e)) {
        setError(e.response?.data?.message ?? e.message ?? 'Failed to delete user')
      } else {
        setError('Failed to delete user')
      }
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <header className="hero">
        <h1>Serverless User Manager</h1>
        <p className="subtitle">AWS Lambda • API Gateway • DynamoDB • CloudFront</p>
        <p className="api-hint">API: {API_BASE || '(not set)'}</p>
      </header>

      <section className="card">
        <h2 className="section-title">Add user</h2>

        <form onSubmit={addUser} className="form">
          <input
            className="input"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Adding…' : 'Add User'}
          </button>
        </form>

        {error && <div className="alert">⚠️ {error}</div>}
        {ok && (
          <div className="alert" style={{ background: '#064e3b', borderColor: '#10b981' }}>
            ✅ {ok}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="section-title">Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p className="muted">No users yet.</p>
        ) : (
          <ul className="list">
            {users.map((u) => (
              <li key={u.userId} className="list-item">
                <div className="avatar">{u.name.charAt(0).toUpperCase()}</div>
                <div className="info">
                  <div className="name">{u.name}</div>
                  <div className="email">{u.email}</div>
                </div>
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => deleteUser(u.userId)}
                  disabled={loading}
                  aria-label={`Delete ${u.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="footer">
        <span>Built with React + Vite • Deployed on AWS</span>
      </footer>
    </div>
  )
}
