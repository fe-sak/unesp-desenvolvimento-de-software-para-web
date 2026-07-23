import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api'

function RegisterPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      const data = await register(username, password, name || undefined)
      onLogin(data.token)
    } catch (error) {
      console.log(error)
      setErr(error.response?.data?.error || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Cadastro</h2>
        <br />
        {err && <div className="alert-error">{err}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="escolha um usuario"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="escolha uma senha"
            />
          </div>

          <div className="form-group">
            <label>Nome (opcional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="seu nome"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <br />
        <p>
          Ja tem conta? <Link to="/login">Faca login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
