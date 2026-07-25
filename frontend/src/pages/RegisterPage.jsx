import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { register, getClientes } from '../api'

function RegisterPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [admin, setAdmin] = useState(false)
  const [clienteId, setClienteId] = useState('')
  const [clientes, setClientes] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getClientes().then(setClientes).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      const id = admin ? undefined : (clienteId || undefined)
      const data = await register(username, password, name || undefined, admin, id ? parseInt(id) : undefined)
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
            <label className="required">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="escolha um usuário"
            />
          </div>

          <div className="form-group">
            <label className="required">Senha</label>
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

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="admin"
              checked={admin}
              onChange={(e) => setAdmin(e.target.checked)}
              style={{ width: 'auto' }}
            />
            <label htmlFor="admin" style={{ marginBottom: 0 }}>Administrador</label>
          </div>

          {!admin && (
            <div className="form-group">
              <label>Cliente</label>
              <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required={!admin}>
                <option value="">Selecione seu cadastro...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <br />
        <p>
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
